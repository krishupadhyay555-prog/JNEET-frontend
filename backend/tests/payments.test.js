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
import { computeNewPeriod } from "../services/payments/billing.js";
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
    let m = /^\/payments\/([^/]+)$/.exec(path);
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
  await Promise.all([User.deleteMany({}), Payment.deleteMany({}), AiDaily.deleteMany({})]);
  clearMailbox(); stubRazorpay();
});
afterEach(() => { globalThis.fetch = realFetch; });

describe("plan catalog", () => {
  it("is public and priced on the server", async () => {
    const res = await client().get("/api/payments/plans");
    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(true);
    expect(res.body.plans.map((p) => p.id)).toEqual(["pro_1m", "pro_4m", "elite_1m", "elite_4m"]);
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
    const order = await c.post("/api/payments/order").send({ planId: "elite_4m" });
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
    const order = await c.post("/api/payments/order").send({ planId: "pro_4m" });
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
    expect(left).toBeGreaterThan(119.9);
    expect(left).toBeLessThan(120.1);          // 120 days, not 240 or 360
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
    await User.updateOne({ email: body.email }, { plan: "elite", planExpiresAt: new Date(Date.now() + 300 * DAY) });
    const far = await c.post("/api/payments/order").send({ planId: "elite_4m" });
    expect(far.status).toBe(409);
    expect(far.body.code).toBe("TOO_FAR_AHEAD");
  });
});
