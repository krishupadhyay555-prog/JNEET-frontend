// ============================================================
//  JNEET+ AI — services/payments/billing.js
//  Business rules for paid plans (B4).
//    startOrder()        price from config/plans.js → Razorpay order
//    confirmCheckout()   browser callback: signature + Razorpay check
//    handleWebhook()     Razorpay → us (works even if the tab closed)
//    applyPaid()         adds the days to the account EXACTLY once
//  Period rules:
//    - Same tier again      → days are added after the current end.
//    - Pro → Elite upgrade  → unused Pro days are converted to Elite
//                             days by value (1-month prices), then the
//                             new Elite days are added. Nothing lost.
//    - Pro while Elite is active → refused at order time (would only
//                             make the Elite pass slightly longer, which
//                             is confusing); if it still arrives (race),
//                             it is converted by value the same way.
//    - Never more than 400 days ahead in total.
// ============================================================

import jwt from "jsonwebtoken";
import Payment from "../../models/Payment.js";
import User from "../../models/User.js";
import { env } from "../../config/env.js";
import { getPlan, paymentsEnabled, TIER_RANK, dailyValue, publicCatalog } from "../../config/plans.js";
import { effectivePlan, planStatus } from "../../utils/plan.js";
import * as rzp from "./razorpay.js";
import { sendPaymentReceipt } from "../emailService.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AHEAD_DAYS = 400;
const CLAIM_TTL_MS = 2 * 60 * 1000;
const PARENT_LINK_DAYS = 7;

export class BillingError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ── Period maths ─────────────────────────────────────────────────
export function computeNewPeriod(user, tier, days, now = new Date()) {
  const current = effectivePlan(user, now);
  const nowMs = now.getTime();

  if (current === "free") return { tier, end: new Date(nowMs + days * DAY_MS) };

  const curEnd = user.planExpiresAt ? new Date(user.planExpiresAt).getTime() : null;
  // A manual grant with no end date: start the paid pass from today.
  const remainingDays = curEnd ? Math.max(0, (curEnd - nowMs) / DAY_MS) : 0;

  if (current === tier && curEnd) return { tier, end: new Date(curEnd + days * DAY_MS) };

  const newTier = TIER_RANK[tier] >= TIER_RANK[current] ? tier : current;
  const value = remainingDays * dailyValue(current) + days * dailyValue(tier);
  const newDays = value / dailyValue(newTier);
  return { tier: newTier, end: new Date(nowMs + newDays * DAY_MS) };
}

function daysAhead(date, now = new Date()) {
  return (new Date(date).getTime() - now.getTime()) / DAY_MS;
}

// ── Orders ───────────────────────────────────────────────────────
export async function startOrder(user, planId, { payer }) {
  if (!paymentsEnabled()) {
    throw new BillingError(503, "PAYMENTS_OFF", "Paid plans are not open yet. Please check back soon.");
  }
  const plan = getPlan(planId);
  if (!plan) throw new BillingError(400, "BAD_PLAN", "That plan does not exist.");

  const now = new Date();
  const current = effectivePlan(user, now);
  if (TIER_RANK[current] > TIER_RANK[plan.tier]) {
    const till = user.planExpiresAt ? ` till ${istDate(user.planExpiresAt)}` : "";
    throw new BillingError(409, "HIGHER_PLAN_ACTIVE",
      `${cap(current)} is already active${till}. You can buy ${cap(plan.tier)} after it ends.`);
  }
  const preview = computeNewPeriod(user, plan.tier, plan.days, now);
  if (daysAhead(preview.end, now) > MAX_AHEAD_DAYS) {
    throw new BillingError(409, "TOO_FAR_AHEAD",
      "Your plan already covers many months ahead. You can extend it again closer to the end date.");
  }

  const userId = String(user._id);
  let order;
  try {
    order = await rzp.createOrder({
      amount: plan.amount,
      receipt: `jn_${userId.slice(-10)}_${Date.now().toString(36)}`,
      notes: { userId, planId: plan.id, payer },
    });
  } catch (err) {
    console.error("[pay] create order failed:", err.message);
    throw new BillingError(502, "GATEWAY_ERROR", "Couldn't start the payment right now. Please try again in a minute.");
  }
  if (order?.amount !== plan.amount || !order?.id) {
    throw new BillingError(502, "GATEWAY_ERROR", "Couldn't start the payment right now. Please try again in a minute.");
  }

  await Payment.create({
    userId: user._id, payer, planId: plan.id, tier: plan.tier, days: plan.days,
    amount: plan.amount, currency: "INR", orderId: order.id,
  });

  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: plan.amount,
    currency: "INR",
    planId: plan.id,
    tier: plan.tier,
    months: plan.months,
    newEnd: preview.end,
    newTier: preview.tier,
  };
}

// ── Confirmation from the browser (Razorpay checkout handler) ────
export async function confirmCheckout({ orderId, paymentId, signature, userId }) {
  if (!rzp.verifyCheckoutSignature({ orderId, paymentId, signature })) {
    throw new BillingError(400, "BAD_SIGNATURE", "We couldn't verify this payment. If money was deducted, it will be confirmed automatically within a few minutes.");
  }
  const doc = await Payment.findOne({ orderId });
  if (!doc || String(doc.userId) !== String(userId)) {
    throw new BillingError(404, "NO_ORDER", "Payment not found.");
  }
  if (doc.appliedAt) return result(doc);

  let p;
  try {
    p = await rzp.fetchPayment(paymentId);
    if (p.order_id !== orderId || p.amount !== doc.amount || p.currency !== "INR") {
      console.error(`[pay] mismatch on ${orderId}: order/amount differs`);
      throw new BillingError(400, "MISMATCH", "This payment does not match the order.");
    }
    if (p.status === "authorized") {
      p = await rzp.capturePayment(paymentId, doc.amount).catch(async (err) => {
        // Already captured by auto-capture between our two calls is fine.
        const again = await rzp.fetchPayment(paymentId);
        if (again.status === "captured") return again;
        throw err;
      });
    }
  } catch (err) {
    if (err instanceof BillingError) throw err;
    console.error("[pay] confirm failed:", err.message);
    throw new BillingError(502, "GATEWAY_ERROR", "Payment received — we're still confirming it. Your plan will turn on within a few minutes.");
  }
  if (p.status !== "captured") {
    throw new BillingError(402, "NOT_CAPTURED", "The payment isn't complete yet. If money was deducted, it will be confirmed automatically within a few minutes.");
  }
  const applied = await applyPaid(doc._id, { paymentId, method: p.method, email: p.email, source: "checkout" });
  return result(applied);
}

// ── Webhook (Razorpay → us) ───────────────────────────────────────
// Returns an HTTP status: 200 = handled/ignored, 400 = bad signature,
// 500 = try again later (Razorpay retries non-2xx).
export async function handleWebhook(rawBody, signature) {
  if (!rzp.verifyWebhookSignature(rawBody, signature)) return 400;
  let evt;
  try { evt = JSON.parse(rawBody.toString("utf8")); } catch { return 400; }

  const entity = evt?.payload?.payment?.entity;
  if (!entity?.order_id) return 200;
  const doc = await Payment.findOne({ orderId: entity.order_id });
  if (!doc) return 200; // not one of ours (e.g. a payment link made by hand)

  if (evt.event === "payment.failed") {
    await Payment.updateOne({ _id: doc._id, status: "created" }, { $set: { status: "failed", paymentId: entity.id ?? null, method: entity.method ?? null } });
    return 200;
  }
  if (evt.event !== "payment.captured" && evt.event !== "order.paid") return 200;
  if (entity.status !== "captured") return 200;
  if (entity.amount !== doc.amount || entity.currency !== "INR") {
    console.error(`[pay] webhook amount mismatch on ${doc.orderId}`);
    return 200;
  }
  try {
    const applied = await applyPaid(doc._id, { paymentId: entity.id, method: entity.method, email: entity.email, source: "webhook" });
    return applied.appliedAt ? 200 : 500; // another worker mid-way → let Razorpay retry
  } catch (err) {
    console.error("[pay] webhook apply failed:", err.message);
    return 500;
  }
}

// ── Add the days to the account, exactly once ─────────────────────
export async function applyPaid(paymentDocId, { paymentId, method, email, source }) {
  const now = new Date();
  const claimed = await Payment.findOneAndUpdate(
    { _id: paymentDocId, appliedAt: null, $or: [{ claimedAt: null }, { claimedAt: { $lt: new Date(now - CLAIM_TTL_MS) } }] },
    { $set: { claimedAt: now, status: "paid", paymentId, method: method ?? null, payerEmail: email ?? null, source } },
    { returnDocument: "after" }
  );
  if (!claimed) return Payment.findById(paymentDocId); // already applied, or being applied right now
  if (!claimed.paidAt) await Payment.updateOne({ _id: claimed._id, paidAt: null }, { $set: { paidAt: now } });

  let before; let period;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const user = await User.findById(claimed.userId).select("plan planExpiresAt").lean();
    if (!user) throw new Error("user for payment not found");
    before = effectivePlan(user, now);
    period = computeNewPeriod(user, claimed.tier, claimed.days, now);
    const upd = await User.updateOne(
      { _id: user._id, plan: user.plan ? user.plan : { $in: [null, "free"] }, planExpiresAt: user.planExpiresAt ?? null },
      { $set: { plan: period.tier, planExpiresAt: period.end } }
    );
    if (upd.modifiedCount === 1) break;
    if (attempt === 3) throw new Error("plan update kept conflicting");
  }

  const done = await Payment.findOneAndUpdate(
    { _id: claimed._id },
    { $set: { appliedAt: new Date(), planBefore: before, planAfter: period.tier, periodEnd: period.end } },
    { returnDocument: "after" }
  );
  console.log(`[pay] applied ${done.orderId} (${done.planId}) via ${source}`);
  sendReceipt(done).catch(() => {});
  return done;
}

async function sendReceipt(doc) {
  const user = await User.findById(doc.userId).select("name email").lean();
  if (!user) return;
  const to = new Set([user.email]);
  if (doc.payerEmail && doc.payerEmail.toLowerCase() !== user.email.toLowerCase()) to.add(doc.payerEmail.toLowerCase());
  const plan = getPlan(doc.planId);
  for (const addr of to) {
    try {
      await sendPaymentReceipt(addr, {
        studentName: user.name,
        planName: `${cap(doc.planAfter)}${plan ? ` · ${plan.months} month${plan.months > 1 ? "s" : ""}` : ""}`,
        amount: doc.amount,
        paymentId: doc.paymentId,
        orderId: doc.orderId,
        paidAt: doc.paidAt ?? doc.appliedAt,
        validTill: doc.periodEnd,
      });
    } catch (err) {
      console.warn("[pay] receipt email failed:", err.message);
      return;
    }
  }
  await Payment.updateOne({ _id: doc._id }, { $set: { receiptSent: true } });
}

function result(doc) {
  return { status: doc.status, applied: Boolean(doc.appliedAt), plan: doc.planAfter, expiresAt: doc.periodEnd };
}

// ── Status for the student ────────────────────────────────────────
export async function billingSummary(user) {
  const history = await Payment.find({ userId: user._id, status: "paid" })
    .sort({ createdAt: -1 }).limit(20)
    .select("planId tier amount paymentId paidAt periodEnd payer method appliedAt")
    .lean();
  return {
    ...planStatus(user),
    paymentsEnabled: paymentsEnabled(),
    history: history.map((h) => ({
      planId: h.planId, tier: h.tier, amount: h.amount, paymentId: h.paymentId,
      paidAt: h.paidAt, validTill: h.periodEnd, payer: h.payer, method: h.method, active: Boolean(h.appliedAt),
    })),
  };
}

// ── Parent payment link (signed, 7 days, no login needed) ─────────
export function makeParentLink(user) {
  const token = jwt.sign({ sub: String(user._id), typ: "parent_pay" }, env.JWT_SECRET, {
    expiresIn: `${PARENT_LINK_DAYS}d`, audience: "parent-pay",
  });
  return {
    url: `${env.APP_URL}/pay/${token}`,
    expiresAt: new Date(Date.now() + PARENT_LINK_DAYS * DAY_MS),
  };
}

export async function userFromParentToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(String(token), env.JWT_SECRET, { audience: "parent-pay" });
  } catch (err) {
    throw new BillingError(err.name === "TokenExpiredError" ? 410 : 404, "BAD_LINK",
      err.name === "TokenExpiredError"
        ? "This payment link has expired. Ask your child to send a new one from the app."
        : "This payment link is not valid.");
  }
  if (decoded.typ !== "parent_pay") throw new BillingError(404, "BAD_LINK", "This payment link is not valid.");
  const user = await User.findById(decoded.sub).lean();
  if (!user || !user.isActive) throw new BillingError(404, "BAD_LINK", "This payment link is not valid.");
  return user;
}

export function describeForParent(user) {
  const first = (String(user.name ?? "").trim().split(/\s+/)[0] || "Student").slice(0, 30);
  return { studentFirstName: first, examMode: user.examMode, ...planStatus(user), catalog: publicCatalog() };
}

// ── helpers ───────────────────────────────────────────────────────
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
export function istDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
