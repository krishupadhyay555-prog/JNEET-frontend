// B4 payments: Razorpay is replaced by a small in-memory fake that
// behaves like the real REST API (orders, payments, capture) and signs
// checkout callbacks / webhooks with the same HMAC rules.
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";

vi.hoisted(() => {
  process.env.RAZORPAY_KEY_ID = "rzp_test_fakeKeyId";
  process.env.RAZORPAY_KEY_SECRET = "fake_key_secret_for_tests";
  process.env.RAZORPAY_WEBHOOK_SECRET = "fake_webhook_secret_for_tests";
  process.env.RAZORPAY_API_URL = "https://rzp.fake/v1";
});

import User from "../models/User.js";
import Payment from "../models/Payment.js";
import AiDaily from "../models/AiDaily.js";
import { mailbox, clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient, client } from "./helpers.js";
import { computeNewPeriod, reconcilePayments, releaseExpiredSeats } from "../services/payments/billing.js";
import WebhookEvent from "../models/WebhookEvent.js";
import SeatCounter from "../models/SeatCounter.js";
import { effectivePlan, canPayDirectly } from "../utils/plan.js";
import { env } from "../config/env.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const DAY = 24 * 60 * 60 * 1000;
const realFetch = globalThis.fetch;
let rz; // fake Razorpay state

function hmac(secret, data) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function stubRazorpay() {
  rz = { orders: new Map(), payments: new Map(), n: 0, captureMode: "auto", failCreate: false, calls: [] };
  globalThis.fetch = vi.fn(async (url, init = {}) => {
    const u = String(url);
    if (!u.startsWith("https://rzp.fake/v1")) return realFetch(url, init);
    const path = u.slice("https://rzp.fake/v1".length);
    rz.calls.push(`${init.method} ${path}`);
    const auth = init.headers?.Authorization;
    const expected = `Basic ${Buffer.from("rzp_test_fakeKeyId:fake_key_secret_for_tests").toString("base64")}`;
    if (auth !== expected) return Response.json({ error: { description: "auth" } }, { status: 401 });
    if (init.method === "POST" && path === "/orders") {
      if (rz.failCreate) return Response.json({ error: { description: "down" } }, { status: 500 });
      const body = JSON.parse(init.body);
      const id = `order_T${String(++rz.n).padStart(10, "0")}`;
      const o = { id, amount: body.amount, currency: body.currency, receipt: body.receipt, notes: body.notes, status: "created" };
      rz.orders.set(id, o);
      return Response.json(o);
    }
    let m = /^\/orders\/([^/]+)\/payments$/.exec(path);
    if (init.method === "GET" && m) {
      return Response.json({ items: [...rz.payments.values()].filter((p) => p.order_id === m[1]) });
    }
    m = /^\/payments\/([^/]+)$/.exec(path);
    if (init.method === "GET" && m) {
      const p = rz.payments.get(m[1]);
      return p ? Response.json(p) : Response.json({ error: { description: "nf" } }, { status: 404 });
    }
    m = /^\/payments\/([^/]+)\/capture$/.exec(path);
    if (init.method === "POST" && m) {
      const p = rz.payments.get(m[1]);
      if (!p || p.status !== "authorized") return Response.json({ error: { description: "bad" } }, { status: 400 });
      p.status = "captured";
      return Response.json(p);
    }
    return Response.json({ error: { description: "?" } }, { status: 404 });
  });
}

// What Razorpay's checkout does when the payer finishes.
function payOrder(orderId, { amount, email = "payer@example.com" } = {}) {
  const o = rz.orders.get(orderId);
  const id = `pay_T${String(++rz.n).padStart(10, "0")}`;
  rz.payments.set(id, {
    id, order_id: orderId, amount: amount ?? o.amount, currency: "INR",
    status: rz.captureMode === "auto" ? "captured" : "authorized", method: "upi", email,
  });
  return { orderId, paymentId: id, signature: hmac("fake_key_secret_for_tests", `${orderId}|${id}`) };
}

function webhookBody(event, paymentId) {
  const p = rz.payments.get(paymentId);
  return JSON.stringify({ event, payload: { payment: { entity: p } } });
}
const sendWebhook = (c, raw, secret = "fake_webhook_secret_for_tests") =>
  c.post("/api/payments/webhook").set("Content-Type", "application/json")
    .set("X-Razorpay-Signature", hmac(secret, raw)).send(raw);

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Payment.deleteMany({}), AiDaily.deleteMany({}), WebhookEvent.deleteMany({}), SeatCounter.deleteMany({})]);
  clearMailbox(); stubRazorpay();
});
afterEach(() => { globalThis.fetch = realFetch; });

describe("plan catalog", () => {
  it("is public and priced on the server", async () => {
    const res = await client().get("/api/payments/plans");
    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(true);
    expect(res.body.plans.map((p) => p.id)).toEqual(["pro_1m", "elite_1m", "jee_pass", "neet_pass"]);
    expect(res.body.plans.every((p) => Number.isInteger(p.amount) && p.amount > 0)).toBe(true);
    expect(res.body.features.free[0]).toMatch(/5 AI doubts/);
    expect(JSON.stringify(res.body)).not.toContain("fake_key_secret");
  });
});

describe("student checkout (adult)", () => {
  it("creates an order with the server price and activates Pro after a verified payment", async () => {
    const { c, body } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(order.status).toBe(201);
    expect(order.body.keyId).toBe("rzp_test_fakeKeyId");
    expect(order.body.amount).toBe(19900);
    expect(rz.orders.get(order.body.orderId).amount).toBe(19900);

    const ver = await c.post("/api/payments/verify").send(payOrder(order.body.orderId));
    expect(ver.status).toBe(200);
    expect(ver.body.applied).toBe(true);
    expect(ver.body.plan).toBe("pro");

    const me = await c.get("/api/payments/me");
    expect(me.body.plan).toBe("pro");
    const left = (new Date(me.body.expiresAt) - Date.now()) / DAY;
    expect(left).toBeGreaterThan(29.9);
    expect(left).toBeLessThan(30.1);
    expect(me.body.history).toHaveLength(1);

    // The new plan drives the AI quota right away.
    const usage = await c.get("/api/ai/usage");
    expect(usage.status).toBe(200);
    expect(usage.body.daily?.limit ?? usage.body.usage?.daily?.limit).toBe(env.AI_DAILY.pro);

    expect(mailbox.receipts.map((r) => r.to).sort()).toEqual([body.email, "payer@example.com"].sort());
  });

  it("refuses a forged signature and never activates", async () => {
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(order.body.orderId);
    const res = await c.post("/api/payments/verify").send({ ...paid, signature: "a".repeat(64) });
    expect(res.status).toBe(400);
    expect((await c.get("/api/payments/me")).body.plan).toBe("free");
  });

  it("refuses a payment whose amount differs from the order", async () => {
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    const res = await c.post("/api/payments/verify").send(payOrder(order.body.orderId, { amount: 100 }));
    expect(res.status).toBe(400);
    expect((await c.get("/api/payments/me")).body.plan).toBe("free");
  });

  it("captures an authorized payment when auto-capture is off", async () => {
    rz.captureMode = "manual";
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    const res = await c.post("/api/payments/verify").send(payOrder(order.body.orderId));
    expect(res.status).toBe(200);
    expect(res.body.plan).toBe("elite");
    expect(rz.calls.some((x) => x.endsWith("/capture"))).toBe(true);
  });

  it("cannot confirm someone else's order", async () => {
    const a = await signedInClient();
    const b = await signedInClient();
    const order = await a.c.post("/api/payments/order").send({ planId: "pro_1m" });
    const res = await b.c.post("/api/payments/verify").send(payOrder(order.body.orderId));
    expect(res.status).toBe(404);
  });

  it("rejects unknown plans, client-sent amounts and the app shell", async () => {
    const { c } = await signedInClient();
    expect((await c.post("/api/payments/order").send({ planId: "pro_99m" })).status).toBe(400);
    expect((await c.post("/api/payments/order").send({ planId: "pro_1m", amount: 1 })).status).toBe(400);
    const twa = await c.post("/api/payments/order").set("X-App-Shell", "twa").send({ planId: "pro_1m" });
    expect(twa.status).toBe(403);
    expect(twa.body.code).toBe("APP_SHELL");
  });

  it("says so clearly when Razorpay is down", async () => {
    rz.failCreate = true;
    const { c } = await signedInClient();
    const res = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(res.status).toBe(502);
    expect(await Payment.countDocuments()).toBe(0);
  });
});

describe("webhook", () => {
  it("activates the plan even if the student closed the tab, and only once", async () => {
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(order.body.orderId);
    const raw = webhookBody("payment.captured", paid.paymentId);
    const w = client();
    expect((await sendWebhook(w, raw)).status).toBe(200);
    expect((await sendWebhook(w, raw)).status).toBe(200);                 // Razorpay retry
    expect((await sendWebhook(w, webhookBody("order.paid", paid.paymentId))).status).toBe(200);
    const ver = await c.post("/api/payments/verify").send(paid);          // late browser callback
    expect(ver.status).toBe(200);

    const me = await c.get("/api/payments/me");
    const left = (new Date(me.body.expiresAt) - Date.now()) / DAY;
    expect(me.body.plan).toBe("pro");
    expect(left).toBeGreaterThan(29.9);
    expect(left).toBeLessThan(30.1);           // 30 days, not 60 or 90
    expect(mailbox.receipts.length).toBe(2);   // student + payer, once
  });

  it("checkout and webhook arriving together still add the days once", async () => {
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(order.body.orderId);
    await Promise.all([
      c.post("/api/payments/verify").send(paid),
      sendWebhook(client(), webhookBody("payment.captured", paid.paymentId)),
      sendWebhook(client(), webhookBody("order.paid", paid.paymentId)),
    ]);
    const u = await User.findOne({}).lean();
    const left = (new Date(u.planExpiresAt) - Date.now()) / DAY;
    expect(left).toBeLessThan(30.1);
  });

  it("ignores bad signatures and marks failed payments", async () => {
    const { c } = await signedInClient();
    const order = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(order.body.orderId);
    const raw = webhookBody("payment.captured", paid.paymentId);
    expect((await sendWebhook(client(), raw, "wrong_secret")).status).toBe(400);
    expect((await c.get("/api/payments/me")).body.plan).toBe("free");

    rz.payments.get(paid.paymentId).status = "failed";
    expect((await sendWebhook(client(), webhookBody("payment.failed", paid.paymentId))).status).toBe(200);
    expect((await Payment.findOne({ orderId: order.body.orderId })).status).toBe("failed");
  });
});

describe("under-18 and parent payment link", () => {
  it("blocks a minor from paying and lets the parent pay via the link", async () => {
    const { c } = await signedInClient({ dateOfBirth: "2011-03-10", parentEmail: "mom@example.com" });
    const self = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(self.status).toBe(403);
    expect(self.body.code).toBe("PARENT_PAYS");
    expect((await c.get("/api/payments/me")).body.canPayDirectly).toBe(false);

    const link = await c.post("/api/payments/parent-link");
    expect(link.status).toBe(200);
    const token = link.body.url.split("/pay/")[1];

    const parent = client();
    const info = await parent.get(`/api/payments/parent/${token}`);
    expect(info.status).toBe(200);
    expect(info.body.studentFirstName).toBe("Test");
    expect(info.body).not.toHaveProperty("email");

    expect((await parent.post(`/api/payments/parent/${token}/order`).send({ planId: "pro_1m" })).status).toBe(400);
    const order = await parent.post(`/api/payments/parent/${token}/order`).send({ planId: "pro_1m", isParent: true });
    expect(order.status).toBe(201);
    const ver = await parent.post(`/api/payments/parent/${token}/verify`).send(payOrder(order.body.orderId, { email: "mom@example.com" }));
    expect(ver.status).toBe(200);
    expect((await c.get("/api/payments/me")).body.plan).toBe("pro");
    expect((await Payment.findOne({})).payer).toBe("parent");
  });

  it("rejects a tampered or foreign token", async () => {
    const res = await client().get("/api/payments/parent/not-a-token");
    expect(res.status).toBe(404);
  });
});

describe("period rules", () => {
  const now = new Date("2026-12-01T00:00:00Z");
  it("extends the same tier from the current end date", () => {
    const user = { plan: "pro", planExpiresAt: new Date(now.getTime() + 10 * DAY) };
    const r = computeNewPeriod(user, "pro", 30, now);
    expect(r.tier).toBe("pro");
    expect((r.end - now) / DAY).toBeCloseTo(40, 5);
  });
  it("converts unused Pro days into Elite days by value on upgrade", () => {
    const user = { plan: "pro", planExpiresAt: new Date(now.getTime() + 21 * DAY) };
    const r = computeNewPeriod(user, "elite", 30, now);
    expect(r.tier).toBe("elite");
    // 21 Pro days × (199/349) + 30 Elite days
    expect((r.end - now) / DAY).toBeCloseTo(30 + 21 * 199 / 349, 5);
  });
  it("starts fresh when the old pass has ended", () => {
    const user = { plan: "elite", planExpiresAt: new Date(now.getTime() - DAY) };
    expect(effectivePlan(user, now)).toBe("free");
    const r = computeNewPeriod(user, "pro", 120, now);
    expect(r.tier).toBe("pro");
    expect((r.end - now) / DAY).toBeCloseTo(120, 5);
  });
  it("keeps a manual grant with no end date", () => {
    expect(effectivePlan({ plan: "elite", planExpiresAt: null }, now)).toBe("elite");
  });
  it("uses the date of birth for the adult check", () => {
    expect(canPayDirectly({ dateOfBirth: new Date("2008-11-30"), consent: { ageGroup: "minor" } }, now)).toBe(true);
    expect(canPayDirectly({ dateOfBirth: new Date("2008-12-02"), consent: { ageGroup: "minor" } }, now)).toBe(false);
    expect(canPayDirectly({ consent: { ageGroup: null } }, now)).toBe(false);
  });
});

describe("plan expiry and limits", () => {
  it("an expired pass drops to Free everywhere", async () => {
    const { c, body } = await signedInClient();
    await User.updateOne({ email: body.email }, { plan: "pro", planExpiresAt: new Date(Date.now() - 1000) });
    const me = await c.get("/api/payments/me");
    expect(me.body.plan).toBe("free");
    expect(me.body.lapsedAt).toBeTruthy();
    const prof = await c.get("/api/auth/me");
    expect(prof.status).toBe(200);
    expect(JSON.stringify(prof.body)).toContain('"plan":"free"');
  });

  it("won't sell Pro while Elite is active, or stack more than ~13 months", async () => {
    const { c, body } = await signedInClient();
    await User.updateOne({ email: body.email }, { plan: "elite", planExpiresAt: new Date(Date.now() + 20 * DAY) });
    const lower = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(lower.status).toBe(409);
    expect(lower.body.code).toBe("HIGHER_PLAN_ACTIVE");
    await User.updateOne({ email: body.email }, { plan: "elite", planExpiresAt: new Date(Date.now() + 380 * DAY) });
    const far = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    expect(far.status).toBe(409);
    expect(far.body.code).toBe("TOO_FAR_AHEAD");
  });
});

// ── 14 Nov hardening: double charge, lost callbacks, repeats, refunds ──
const sendWebhookWithId = (c, raw, id) =>
  c.post("/api/payments/webhook").set("Content-Type", "application/json")
    .set("X-Razorpay-Signature", hmac("fake_webhook_secret_for_tests", raw))
    .set("X-Razorpay-Event-Id", id).send(raw);

describe("hardening: one order, one charge", () => {
  it("a double click or second tab gets the SAME order (one Razorpay order created)", async () => {
    const { c } = await signedInClient();
    const [a, b] = await Promise.all([
      c.post("/api/payments/order").send({ planId: "pro_1m" }),
      c.post("/api/payments/order").send({ planId: "pro_1m" }),
    ]);
    const ok = [a, b].filter((r) => r.status === 201);
    const busy = [a, b].filter((r) => r.status === 409);
    // Either both got the same order, or one was told to wait — never two orders.
    expect(rz.orders.size).toBe(1);
    expect(new Set(ok.map((r) => r.body.orderId)).size).toBe(1);
    expect(ok.length + busy.length).toBe(2);
    const again = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(again.body.orderId).toBe(ok[0].body.orderId);
    expect(again.body.reused).toBe(true);
    expect(rz.orders.size).toBe(1);
  });

  it("an old tab's order paid after a new plan was opened is honoured but flagged for the founder", async () => {
    const { c } = await signedInClient();
    const first = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const second = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    expect(second.body.orderId).not.toBe(first.body.orderId);
    const old = await Payment.findOne({ orderId: first.body.orderId }).lean();
    expect(old.supersededAt).not.toBeNull();

    const ver = await c.post("/api/payments/verify").send(payOrder(first.body.orderId));
    expect(ver.body.applied).toBe(true);                 // money never ignored
    const doc = await Payment.findOne({ orderId: first.body.orderId }).lean();
    expect(doc.flag).toBe("superseded_paid");
    expect(mailbox.alerts.some((a) => /superseded/i.test(a.subject))).toBe(true);
  });

  it("two separate purchases within 30 minutes are both honoured and flagged as a possible duplicate", async () => {
    const { c } = await signedInClient();
    const o1 = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    await c.post("/api/payments/verify").send(payOrder(o1.body.orderId));
    const o2 = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    expect(o2.body.orderId).not.toBe(o1.body.orderId);   // first one is finished, so a new order
    await c.post("/api/payments/verify").send(payOrder(o2.body.orderId));
    const d2 = await Payment.findOne({ orderId: o2.body.orderId }).lean();
    expect(d2.flag).toBe("possible_duplicate");
    expect(mailbox.alerts.some((a) => /duplicate/i.test(a.subject))).toBe(true);
    const u = await User.findOne({}).lean();
    expect((new Date(u.planExpiresAt) - Date.now()) / DAY).toBeGreaterThan(59.9); // both months given
  });

  it("each order keeps an audit trail", async () => {
    const { c } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    await c.post("/api/payments/verify").send(payOrder(o.body.orderId));
    const d = await Payment.findOne({ orderId: o.body.orderId }).lean();
    expect(d.events.map((e) => e.type)).toEqual(["order_created", "captured", "plan_applied"]);
  });
});

describe("hardening: money taken = plan given", () => {
  it("reconciliation activates a captured payment when BOTH the callback and the webhook were lost", async () => {
    const { c } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    payOrder(o.body.orderId);                          // paid at Razorpay; tab closed; no webhook
    expect((await User.findOne({}).lean()).plan ?? "free").not.toBe("elite");

    // Too early: the sweep leaves very fresh orders to the normal flow.
    expect((await reconcilePayments()).applied).toBe(0);
    const later = new Date(Date.now() + 4 * 60 * 1000);
    const r = await reconcilePayments({ now: later });
    expect(r.applied).toBe(1);
    const u = await User.findOne({}).lean();
    expect(u.plan).toBe("elite");
    const d = await Payment.findOne({ orderId: o.body.orderId }).lean();
    expect(d.source).toBe("reconcile");
    expect((await reconcilePayments({ now: later })).applied).toBe(0);   // never twice
  });

  it("reconciliation captures an authorized payment, then activates it", async () => {
    const { c } = await signedInClient();
    rz.captureMode = "manual";
    const o = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    payOrder(o.body.orderId);
    const r = await reconcilePayments({ now: new Date(Date.now() + 4 * 60 * 1000) });
    expect(r.applied).toBe(1);
    expect(rz.calls.some((x) => /capture$/.test(x))).toBe(true);
  });

  it("an unpaid order is left alone by reconciliation", async () => {
    const { c } = await signedInClient();
    await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const r = await reconcilePayments({ now: new Date(Date.now() + 4 * 60 * 1000) });
    expect(r).toEqual({ checked: 1, applied: 0 });
    expect((await User.findOne({}).lean()).plan ?? "free").toBe("free");
  });
});

describe("hardening: webhook repeats and refunds", () => {
  it("the same webhook event id is processed only once", async () => {
    const { c } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(o.body.orderId);
    const raw = webhookBody("payment.captured", paid.paymentId);
    expect((await sendWebhookWithId(client(), raw, "evt_TEST000001")).status).toBe(200);
    expect((await sendWebhookWithId(client(), raw, "evt_TEST000001")).status).toBe(200);
    expect(await WebhookEvent.countDocuments({ eventId: "evt_TEST000001" })).toBe(1);
    const d = await Payment.findOne({ orderId: o.body.orderId }).lean();
    expect(d.events.filter((e) => e.type === "plan_applied")).toHaveLength(1);
  });

  it("a full refund (done by the founder in Razorpay) takes the paid days back", async () => {
    const { c } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(o.body.orderId);
    await c.post("/api/payments/verify").send(paid);
    expect((await User.findOne({}).lean()).plan).toBe("pro");

    const raw = JSON.stringify({ event: "refund.processed", payload: { refund: { entity: { id: "rfnd_T1", payment_id: paid.paymentId, amount: 19900 } } } });
    expect((await sendWebhook(client(), raw)).status).toBe(200);
    const u = await User.findOne({}).lean();
    expect(effectivePlan(u)).toBe("free");
    const d = await Payment.findOne({ orderId: o.body.orderId }).lean();
    expect(d.status).toBe("refunded");
    expect(mailbox.alerts.some((a) => /refund/i.test(a.subject))).toBe(true);
    expect((await sendWebhook(client(), raw)).status).toBe(200);           // repeat is harmless
  });

  it("a forged refund webhook changes nothing", async () => {
    const { c } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "pro_1m" });
    const paid = payOrder(o.body.orderId);
    await c.post("/api/payments/verify").send(paid);
    const raw = JSON.stringify({ event: "refund.processed", payload: { refund: { entity: { id: "rfnd_X", payment_id: paid.paymentId, amount: 19900 } } } });
    expect((await sendWebhook(client(), raw, "wrong_secret")).status).toBe(400);
    expect((await User.findOne({}).lean()).plan).toBe("pro");
  });

  it("the catalog says test mode with rzp_test_ keys", async () => {
    const res = await client().get("/api/payments/plans");
    expect(res.body.mode).toBe("test");
  });
});

describe("exam passes, exam lock and fair-use cap", () => {
  it("JEE pass: early-bird price from real seats, ends 30 Apr 2027, locks the exam, unlocks analysis", async () => {
    const plans = (await client().get("/api/payments/plans")).body.plans
    const jee = plans.find((p) => p.id === "jee_pass")
    expect(jee).toMatchObject({ exam: "JEE", amount: 69900, current: 59900 })
    expect(jee.early.seatsLeft).toBe(500)

    const { c, body } = await signedInClient({ examMode: "JEE" })
    const order = await c.post("/api/payments/order").send({ planId: "jee_pass" })
    expect(order.status).toBe(201)
    expect(order.body.amount).toBe(59900)
    expect((await c.post("/api/payments/verify").send(payOrder(order.body.orderId))).body.plan).toBe("pro")
    const u = await User.findOne({ email: body.email }).lean()
    expect(u.planExam).toBe("JEE")
    expect(new Date(u.planPassUntil).toISOString().slice(0, 10)).toBe("2027-04-30")
    expect((await client().get("/api/payments/plans")).body.plans.find((p) => p.id === "jee_pass").early.seatsLeft).toBe(499)

    const sw = await c.patch("/api/user/exam-mode").send({ examMode: "NEET" })
    expect(sw.status).toBe(403)
    expect(sw.body.code).toBe("PLAN_EXAM_LOCKED")
  })

  it("a NEET account can't buy the JEE pass", async () => {
    const { c } = await signedInClient({ examMode: "NEET" })
    const r = await c.post("/api/payments/order").send({ planId: "jee_pass" })
    expect(r.body.code).toBe("WRONG_EXAM")
  })

  it("free accounts can switch exam once, then once a week", async () => {
    const { c } = await signedInClient({ examMode: "JEE" })
    expect((await c.patch("/api/user/exam-mode").send({ examMode: "NEET" })).status).toBe(200)
    const again = await c.patch("/api/user/exam-mode").send({ examMode: "JEE" })
    expect(again.status).toBe(429)
    expect(again.body.code).toBe("SWITCH_COOLDOWN")
  })
})


// ── 24 Nov audit: early-bird seat race, exact pass refunds, chargebacks ──
describe("audit: early-bird seats are atomic", () => {
  const seatsLeft = async () => (await client().get("/api/payments/plans")).body.plans.find((p) => p.id === "jee_pass").early.seatsLeft;

  it("seat race at 498/500: 3 buyers at once → exactly 2 get ₹599, 1 gets ₹699, never 501 seats", async () => {
    await SeatCounter.create({ _id: "jee_pass", reserved: 498 });
    const buyers = await Promise.all([1, 2, 3].map(() => signedInClient({ examMode: "JEE" })));
    const orders = await Promise.all(buyers.map(({ c }) => c.post("/api/payments/order").send({ planId: "jee_pass" })));
    expect(orders.map((o) => o.status)).toEqual([201, 201, 201]);
    expect(orders.map((o) => o.body.amount).sort()).toEqual([59900, 59900, 69900]);
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(500);
    expect(await seatsLeft()).toBe(0);
    // Each one is charged exactly the price on its order.
    for (let i = 0; i < 3; i += 1) {
      const r = await buyers[i].c.post("/api/payments/verify").send(payOrder(orders[i].body.orderId));
      expect(r.body.applied).toBe(true);
    }
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(500);
    expect(await Payment.countDocuments({ amount: 59900, appliedAt: { $ne: null } })).toBe(2);
  });

  it("seat 500 is reserved when the order is made, so the next buyer sees ₹699 (499 → 500 → 501)", async () => {
    await SeatCounter.create({ _id: "jee_pass", reserved: 499 });
    expect(await seatsLeft()).toBe(1);
    const a = await signedInClient({ examMode: "JEE" });
    const oa = await a.c.post("/api/payments/order").send({ planId: "jee_pass" });
    expect(oa.body.amount).toBe(59900);
    expect(await seatsLeft()).toBe(0);
    const b = await signedInClient({ examMode: "JEE" });
    expect((await b.c.post("/api/payments/order").send({ planId: "jee_pass" })).body.amount).toBe(69900);
    // Double-tap by A keeps the SAME ₹599 order and does not take a 2nd seat.
    const again = await a.c.post("/api/payments/order").send({ planId: "jee_pass" });
    expect(again.body).toMatchObject({ orderId: oa.body.orderId, amount: 59900, reused: true });
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(500);
  });

  it("an unpaid order gives its seat back after 30 min; a late payment is still honoured and flagged if full", async () => {
    await SeatCounter.create({ _id: "jee_pass", reserved: 499 });
    const a = await signedInClient({ examMode: "JEE" });
    const oa = await a.c.post("/api/payments/order").send({ planId: "jee_pass" });
    expect(await releaseExpiredSeats()).toBe(0); // too fresh
    expect(await releaseExpiredSeats({ now: new Date(Date.now() + 31 * 60 * 1000) })).toBe(1);
    expect(await seatsLeft()).toBe(1);
    // Someone else takes the freed seat.
    const b = await signedInClient({ examMode: "JEE" });
    const ob = await b.c.post("/api/payments/order").send({ planId: "jee_pass" });
    expect(ob.body.amount).toBe(59900);
    // A pays the old ₹599 order late: plan given (money never ignored), founder told.
    const r = await a.c.post("/api/payments/verify").send(payOrder(oa.body.orderId));
    expect(r.body.applied).toBe(true);
    const d = await Payment.findOne({ orderId: oa.body.orderId }).lean();
    expect(d.flag).toBe("early_seat_over");
    expect(mailbox.alerts.some((m) => /seats filled/i.test(m.subject))).toBe(true);
  });

  it("gateway down → the seat is given back (no ghost seats)", async () => {
    await SeatCounter.create({ _id: "jee_pass", reserved: 10 });
    rz.failCreate = true;
    const { c } = await signedInClient({ examMode: "JEE" });
    expect((await c.post("/api/payments/order").send({ planId: "jee_pass" })).status).toBe(502);
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(10);
  });

  it("the client can't choose the price: amount/tier/days in the body are ignored", async () => {
    const { c } = await signedInClient({ examMode: "JEE" });
    const o = await c.post("/api/payments/order").send({ planId: "jee_pass", amount: 100, tier: "elite", days: 9999, exam: "NEET" });
    expect([201, 400]).toContain(o.status);
    if (o.status === 201) {
      expect(o.body.amount).toBe(59900);
      expect(o.body.tier).toBe("pro");
    }
  });
});

describe("audit: refunds and chargebacks take back exactly what was bought", () => {
  async function buyJeePass() {
    const s = await signedInClient({ examMode: "JEE" });
    const o = await s.c.post("/api/payments/order").send({ planId: "jee_pass" });
    const paid = payOrder(o.body.orderId);
    await s.c.post("/api/payments/verify").send(paid);
    return { ...s, paid };
  }

  it("full refund of a JEE pass bought on a free account → back to free, deep analysis off", async () => {
    const { c, body, paid } = await buyJeePass();
    const raw = JSON.stringify({ event: "refund.processed", payload: { refund: { entity: { id: "rfnd_A1", payment_id: paid.paymentId, amount: 59900 } } } });
    expect((await sendWebhook(c, raw)).status).toBe(200);
    const u = await User.findOne({ email: body.email }).lean();
    expect(effectivePlan(u)).toBe("free");
    expect(u.planPassUntil).toBeNull();
  });

  it("a lost chargeback removes the plan; a new dispute only flags it", async () => {
    const { c, body, paid } = await buyJeePass();
    const dispute = (event) => JSON.stringify({ event, payload: { dispute: { entity: { id: "disp_A1", payment_id: paid.paymentId } } } });
    await sendWebhook(c, dispute("payment.dispute.created"));
    let u = await User.findOne({ email: body.email }).lean();
    expect(effectivePlan(u)).toBe("pro");
    expect((await Payment.findOne({ paymentId: paid.paymentId }).lean()).flag).toBe("dispute");
    await sendWebhook(c, dispute("payment.dispute.lost"));
    u = await User.findOne({ email: body.email }).lean();
    expect(effectivePlan(u)).toBe("free");
    expect((await Payment.findOne({ paymentId: paid.paymentId }).lean()).status).toBe("refunded");
  });

  it("forged dispute webhook (wrong secret) is rejected and changes nothing", async () => {
    const { c, body, paid } = await buyJeePass();
    const raw = JSON.stringify({ event: "payment.dispute.lost", payload: { dispute: { entity: { id: "disp_X", payment_id: paid.paymentId } } } });
    expect((await sendWebhook(c, raw, "wrong_secret")).status).toBe(400);
    expect(effectivePlan(await User.findOne({ email: body.email }).lean())).toBe("pro");
  });
});

// ── 28 Nov audit: order race, double refund webhooks, seats, caps ──
describe("audit 28 Nov: payment races and leaks", () => {
  it("stress: 3 taps at once, 12 rounds → never more than one Razorpay order per student", async () => {
    for (let round = 0; round < 12; round += 1) {
      const { c } = await signedInClient();
      const before = rz.orders.size;
      const res = await Promise.all([1, 2, 3].map(() => c.post("/api/payments/order").send({ planId: "pro_1m" })));
      expect(res.every((r) => [201, 409].includes(r.status))).toBe(true);
      expect(rz.orders.size - before).toBe(1);
      expect(new Set(res.filter((r) => r.status === 201).map((r) => r.body.orderId)).size).toBe(1);
    }
  }, 60000); // 12 sign-ups + 36 orders: slow CI machines need more than 5 s

  async function paidPass() {
    const s = await signedInClient({ examMode: "JEE" });
    const o = await s.c.post("/api/payments/order").send({ planId: "jee_pass" });
    const paid = payOrder(o.body.orderId);
    await s.c.post("/api/payments/verify").send(paid);
    return { ...s, paid };
  }

  it("refund.created + refund.processed arriving together take the days back ONCE and free the early-bird seat", async () => {
    const { c, body, paid } = await paidPass();
    const plan1 = await User.findOne({ email: body.email }).lean();
    expect(plan1.plan).toBe("pro");
    const seatsBefore = (await SeatCounter.findById("jee_pass").lean()).reserved;
    const mk = (event, id) => JSON.stringify({ event, payload: { refund: { entity: { id, payment_id: paid.paymentId, amount: 59900 } } } });
    const [a, b] = await Promise.all([
      sendWebhookWithId(c, mk("refund.created", "rfnd_1"), "evt_r1"),
      sendWebhookWithId(c, mk("refund.processed", "rfnd_1"), "evt_r2"),
    ]);
    expect([a.status, b.status]).toEqual([200, 200]);
    const d = await Payment.findOne({ paymentId: paid.paymentId }).lean();
    expect(d.events.filter((e) => e.type === "refunded")).toHaveLength(1);
    expect(d.seatHeld).toBe(false);
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(seatsBefore - 1);
    expect(effectivePlan(await User.findOne({ email: body.email }).lean())).toBe("free");
  });

  it("saving the order fails after the seat was taken → seat and lock are given back", async () => {
    await SeatCounter.create({ _id: "jee_pass", reserved: 5 });
    const { c } = await signedInClient({ examMode: "JEE" });
    const spy = vi.spyOn(Payment, "create").mockRejectedValueOnce(new Error("db blip"));
    const r = await c.post("/api/payments/order").send({ planId: "jee_pass" });
    spy.mockRestore();
    expect(r.status).toBe(503);
    expect((await SeatCounter.findById("jee_pass").lean()).reserved).toBe(5);
    expect((await c.post("/api/payments/order").send({ planId: "jee_pass" })).status).toBe(201); // lock was cleared
  });

  it("a captured retry on a 'failed' order is still found by the reconcile sweep", async () => {
    const { c, body } = await signedInClient();
    const o = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    await Payment.updateOne({ orderId: o.body.orderId }, { $set: { status: "failed" } });
    payOrder(o.body.orderId);                       // retry succeeded at Razorpay; webhook lost
    const r = await reconcilePayments({ now: new Date(Date.now() + 4 * 60 * 1000) });
    expect(r.applied).toBe(1);
    expect((await User.findOne({ email: body.email }).lean()).plan).toBe("elite");
  });

  it("an old pass tab paid while Elite is on does NOT give Elite until the pass date", async () => {
    const { c, body } = await signedInClient({ examMode: "JEE" });
    const passOrder = await c.post("/api/payments/order").send({ planId: "jee_pass" });
    const e = await c.post("/api/payments/order").send({ planId: "elite_1m" });
    await c.post("/api/payments/verify").send(payOrder(e.body.orderId));
    const eliteEnd = new Date((await User.findOne({ email: body.email }).lean()).planExpiresAt);
    await c.post("/api/payments/verify").send(payOrder(passOrder.body.orderId));
    const u = await User.findOne({ email: body.email }).lean();
    expect(u.plan).toBe("elite");
    const passEnd = new Date((await Payment.findOne({ orderId: passOrder.body.orderId }).lean()).passEndsAt);
    expect(new Date(u.planExpiresAt) < passEnd).toBe(true);           // value-converted, not till 30 Apr
    expect(new Date(u.planExpiresAt) >= eliteEnd).toBe(true);         // money still honoured
  });
});

describe("audit 28 Nov: AI monthly cap with a pass", () => {
  it("pass = ₹30, Elite bought after a pass keeps ₹100", async () => {
    const { capFor } = await import("../services/ai/monthlyCap.js");
    expect(capFor({ plan: "pro", planPass: true })).toBe(30);
    expect(capFor({ plan: "elite", planPass: true })).toBe(100);
    expect(capFor({ plan: "pro" })).toBe(50);
    expect(capFor({ plan: "free" })).toBe(10);
  });
});
