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
//  Safety nets (14 Nov hardening):
//    - One open order per student: a double-click / second tab gets
//      the SAME Razorpay order back (a Razorpay order can be paid only
//      once), and a per-user lock stops two orders racing.
//    - Three independent ways a captured payment turns the plan on:
//      checkout callback, webhook, and reconcilePayments() (every 5 min
//      it asks Razorpay about any unfinished order) — money taken =
//      plan given, even if the tab closed and the webhook was lost.
//    - Webhook repeats are ignored by event id; refunds are recorded and
//      a full refund takes the paid days back.
//    - Anything odd (possible duplicate purchase, refund, amount
//      mismatch) sets Payment.flag and emails the founder.
// ============================================================

import jwt from "jsonwebtoken";
import Payment from "../../models/Payment.js";
import WebhookEvent from "../../models/WebhookEvent.js";
import SeatCounter from "../../models/SeatCounter.js";
import User from "../../models/User.js";
import { env } from "../../config/env.js";
import { getPlan, paymentsEnabled, TIER_RANK, dailyValue, publicCatalog } from "../../config/plans.js";
import { effectivePlan, planStatus } from "../../utils/plan.js";
import * as rzp from "./razorpay.js";
import { sendPaymentReceipt, sendAdminAlert } from "../emailService.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AHEAD_DAYS = 400;
const CLAIM_TTL_MS = 2 * 60 * 1000;
const PARENT_LINK_DAYS = 7;
const REUSE_ORDER_MS = 15 * 60 * 1000;   // same plan within 15 min → same order
const ORDER_LOCK_MS = 15 * 1000;         // per-user lock while an order is created
const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;
const RECONCILE_MIN_AGE_MS = 3 * 60 * 1000;
const RECONCILE_MAX_AGE_MS = 3 * DAY_MS;
const SEAT_HOLD_MS = 30 * 60 * 1000;     // an unpaid early-bird order keeps its seat this long

function ev(type, source, note = "") {
  return { at: new Date(), type, source, note: String(note).slice(0, 200) };
}

function alertFounder(subject, lines) {
  sendAdminAlert(subject, lines).catch((err) => console.warn("[pay] alert email failed:", err.message));
}

function orderResponse(doc, plan, preview) {
  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: doc.orderId,
    amount: doc.amount,
    currency: "INR",
    planId: plan.id,
    tier: plan.tier,
    months: plan.months,
    newEnd: preview.end,
    newTier: preview.tier,
  };
}

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

// ── Early-bird seats ─────────────────────────────────────────────
// SeatCounter.reserved = paid early seats + seats held by open orders.
// A seat is taken atomically when the order is created (so the price on
// the Razorpay order is the price the student pays), and given back if
// the order isn't paid within 30 min or the student opens another order.
async function ensureCounter(plan) {
  if (await SeatCounter.exists({ _id: plan.id })) return;
  const used = await Payment.countDocuments({ planId: plan.id, amount: plan.early.amount, appliedAt: { $ne: null } });
  await SeatCounter.updateOne({ _id: plan.id }, { $setOnInsert: { reserved: used } }, { upsert: true })
    .catch((err) => { if (err?.code !== 11000) throw err; });
}
export async function earlySeatsUsed(plan) {
  if (!plan?.early) return 0;
  await ensureCounter(plan);
  return (await SeatCounter.findById(plan.id).lean())?.reserved ?? 0;
}
async function takeSeat(plan) {
  await ensureCounter(plan);
  return Boolean(await SeatCounter.findOneAndUpdate(
    { _id: plan.id, reserved: { $lt: plan.early.seats } }, { $inc: { reserved: 1 } }, { projection: { _id: 1 } }
  ));
}
async function giveBackSeat(planId) {
  await SeatCounter.updateOne({ _id: planId, reserved: { $gt: 0 } }, { $inc: { reserved: -1 } });
}
// Frees the seat of one unpaid order (atomic on the Payment, so a seat is
// never given back twice, and never while the plan is being applied).
async function releaseSeat(docId, planId, note) {
  const r = await Payment.updateOne(
    { _id: docId, seatHeld: true, appliedAt: null, claimedAt: null },
    { $set: { seatHeld: false }, $push: { events: ev("seat_released", "system", note) } }
  );
  if (r.modifiedCount === 1) { await giveBackSeat(planId); return true; }
  return false;
}
export async function releaseExpiredSeats({ now = new Date() } = {}) {
  const docs = await Payment.find({ seatHeld: true, appliedAt: null, createdAt: { $lt: new Date(now.getTime() - SEAT_HOLD_MS) } })
    .select("_id planId").limit(200).lean();
  let released = 0;
  for (const d of docs) if (await releaseSeat(d._id, d.planId, "not paid within 30 min")) released += 1;
  return released;
}
export async function currentPrice(plan) {
  if (!plan?.early) return plan.amount;
  return (await earlySeatsUsed(plan)) < plan.early.seats ? plan.early.amount : plan.amount;
}

// ── Orders ───────────────────────────────────────────────────────
export async function startOrder(user, planId, { payer }) {
  if (!paymentsEnabled()) {
    throw new BillingError(503, "PAYMENTS_OFF", "Paid plans are not open yet. Please check back soon.");
  }
  const base = getPlan(planId);
  if (!base || base.hidden) throw new BillingError(400, "BAD_PLAN", "That plan does not exist.");
  const plan = { ...base }; // amount is decided below, after the seat check
  const exam = plan.exam ?? user.examMode ?? null;
  if (plan.exam && user.examMode && plan.exam !== user.examMode) {
    throw new BillingError(409, "WRONG_EXAM", `This pass is for ${plan.exam}. Your account is set to ${user.examMode}.`);
  }

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

  // Double-click / second tab: hand back the order that is already open
  // for this plan, so there is only ever one thing to pay.
  const open = await Payment.findOne({
    userId: user._id, planId: plan.id, payer, status: "created", appliedAt: null,
    supersededAt: null, createdAt: { $gt: new Date(now.getTime() - REUSE_ORDER_MS) },
  }).sort({ createdAt: -1 }).lean();
  if (open && (open.amount === base.amount || (base.early && open.seatHeld && open.amount === base.early.amount))) {
    return { ...orderResponse(open, plan, preview), reused: true };
  }

  // Per-user lock: two requests at the same instant can't both create orders.
  const locked = await User.findOneAndUpdate(
    { _id: user._id, $or: [{ payLockUntil: null }, { payLockUntil: { $lt: now } }] },
    { $set: { payLockUntil: new Date(now.getTime() + ORDER_LOCK_MS) } },
    { projection: { _id: 1 } }
  );
  if (!locked) throw new BillingError(409, "ORDER_IN_PROGRESS", "A payment is already being started. Please wait a few seconds.");

  // Early-bird: take a seat atomically, or charge the full price.
  let seatHeld = false;
  plan.amount = base.amount;
  if (base.early && (await takeSeat(base))) { seatHeld = true; plan.amount = base.early.amount; }
  const abort = async () => {
    await User.updateOne({ _id: user._id }, { $set: { payLockUntil: null } });
    if (seatHeld) await giveBackSeat(base.id);
  };

  let order;
  try {
    order = await rzp.createOrder({
      amount: plan.amount,
      receipt: `jn_${userId.slice(-10)}_${Date.now().toString(36)}`,
      notes: { userId, planId: plan.id, payer },
    });
  } catch (err) {
    await abort();
    console.error("[pay] create order failed:", err.message);
    throw new BillingError(502, "GATEWAY_ERROR", "Couldn't start the payment right now. Please try again in a minute.");
  }
  if (order?.amount !== plan.amount || order?.currency !== "INR" || !order?.id) {
    await abort();
    throw new BillingError(502, "GATEWAY_ERROR", "Couldn't start the payment right now. Please try again in a minute.");
  }

  const doc = await Payment.create({
    userId: user._id, payer, planId: plan.id, tier: plan.tier, days: plan.days,
    exam, pass: plan.duration === "pass", passEndsAt: plan.duration === "pass" ? new Date(plan.endsAt) : null,
    amount: plan.amount, currency: "INR", orderId: order.id, seatHeld,
    events: [ev("order_created", payer, seatHeld ? "early-bird seat held" : "")],
  });
  // Any other open order of this student is now "superseded": if it is
  // still paid later (old tab), the money is honoured but flagged.
  await Payment.updateMany(
    { userId: user._id, status: "created", appliedAt: null, supersededAt: null, _id: { $ne: doc._id } },
    { $set: { supersededAt: now }, $push: { events: ev("superseded", "system", `by ${order.id}`) } }
  );
  // Their older unpaid orders give back any early-bird seat at once.
  const held = await Payment.find({ userId: user._id, seatHeld: true, appliedAt: null, _id: { $ne: doc._id } }).select("_id planId").lean();
  for (const h of held) await releaseSeat(h._id, h.planId, `student opened ${order.id}`);
  await User.updateOne({ _id: user._id }, { $set: { payLockUntil: null } });

  return orderResponse(doc, plan, preview);
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
      await flagPayment(doc._id, "mismatch", "checkout", `payment ${paymentId} does not match`);
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
export async function handleWebhook(rawBody, signature, eventId = null) {
  if (!rzp.verifyWebhookSignature(rawBody, signature)) return 400;
  let evt;
  try { evt = JSON.parse(rawBody.toString("utf8")); } catch { return 400; }

  const id = typeof eventId === "string" && /^[\w-]{6,80}$/.test(eventId) ? eventId : null;
  if (id && (await WebhookEvent.exists({ eventId: id }))) return 200; // repeat delivery

  const status = await processWebhookEvent(evt);
  if (status === 200 && id) {
    await WebhookEvent.create({ eventId: id, event: evt.event ?? null, orderId: evt?.payload?.payment?.entity?.order_id ?? null })
      .catch((err) => { if (err?.code !== 11000) throw err; });
  }
  return status;
}

async function processWebhookEvent(evt) {
  if (evt?.event === "refund.processed" || evt?.event === "refund.created") return handleRefund(evt);
  if (typeof evt?.event === "string" && evt.event.startsWith("payment.dispute.")) return handleDispute(evt);

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
    await flagPayment(doc._id, "mismatch", "webhook", `payment ${entity.id} amount/currency differs`);
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
    { $set: { claimedAt: now, status: "paid", paymentId, method: method ?? null, payerEmail: email ?? null, source },
      $push: { events: ev("captured", source, paymentId) } },
    { returnDocument: "after" }
  );
  if (!claimed) return Payment.findById(paymentDocId); // already applied, or being applied right now
  if (!claimed.paidAt) await Payment.updateOne({ _id: claimed._id, paidAt: null }, { $set: { paidAt: now } });
  await keepEarlySeat(claimed);

  let before; let period; let endBefore = null; let passUntilBefore = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const user = await User.findById(claimed.userId).select("plan planExpiresAt planPassUntil examMode").lean();
    if (!user) throw new Error("user for payment not found");
    before = effectivePlan(user, now);
    period = computeNewPeriod(user, claimed.tier, claimed.days, now);
    endBefore = before !== "free" && user.planExpiresAt ? new Date(user.planExpiresAt) : null;
    passUntilBefore = user.planPassUntil ? new Date(user.planPassUntil) : null;
    // Deep analysis (pass) runs till the pass date — never longer just
    // because an older monthly plan happens to end later.
    const passUntil = claimed.pass
      ? new Date(Math.max(passUntilBefore?.getTime() ?? 0, new Date(claimed.passEndsAt ?? period.end).getTime()))
      : null;
    if (claimed.pass && claimed.passEndsAt) {
      // A pass ends on its fixed date (or later, if the student already had more).
      const curEnd = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
      period = { ...period, end: curEnd && curEnd > claimed.passEndsAt && before !== "free" ? curEnd : new Date(claimed.passEndsAt) };
    }
    const upd = await User.updateOne(
      { _id: user._id, plan: user.plan ? user.plan : { $in: [null, "free"] }, planExpiresAt: user.planExpiresAt ?? null },
      { $set: { plan: period.tier, planExpiresAt: period.end, planExam: claimed.exam ?? user.examMode ?? null,
        ...(claimed.pass ? { planPassUntil: passUntil } : {}) } }
    );
    if (upd.modifiedCount === 1) break;
    if (attempt === 3) throw new Error("plan update kept conflicting");
  }

  const done = await Payment.findOneAndUpdate(
    { _id: claimed._id },
    { $set: { appliedAt: new Date(), planBefore: before, planAfter: period.tier, periodEnd: period.end, endBefore, passUntilBefore },
      $push: { events: ev("plan_applied", source, `${before} → ${period.tier} till ${period.end.toISOString()}`) } },
    { returnDocument: "after" }
  );
  console.log(`[pay] applied ${done.orderId} (${done.planId}) via ${source}`);
  sendReceipt(done).catch(() => {});
  await checkForDuplicate(done);
  return done;
}

// A paid early-price order always keeps (or re-takes) its seat. If its
// seat had been given back (paid after 30 min) and the 500 are now full,
// the money is still honoured and the founder is told.
async function keepEarlySeat(doc) {
  const plan = getPlan(doc.planId);
  if (!plan?.early || doc.amount !== plan.early.amount || doc.seatHeld) return;
  await ensureCounter(plan);
  const c = await SeatCounter.findOneAndUpdate({ _id: plan.id }, { $inc: { reserved: 1 } }, { returnDocument: "after" });
  const over = (c?.reserved ?? 0) > plan.early.seats;
  await Payment.updateOne({ _id: doc._id }, { $set: { seatHeld: true, ...(over ? { flag: "early_seat_over" } : {}) },
    $push: { events: ev("seat_retaken", "system", over ? "early seats were already full" : "") } });
  if (over) alertFounder("Early-bird order paid after seats filled", [
    `Order ${doc.orderId} · ₹${doc.amount / 100} · plan ${doc.planId}.`,
    `It was paid late (after its seat hold expired), so early-bird seats are now ${c.reserved}/${plan.early.seats}.`,
    "The plan was activated at the early price the student was shown. No action needed unless you want to cap it.",
  ]);
}

// Money is never refused once captured — but a second purchase within
// 30 minutes, or a paid "old tab" order, is flagged for the founder,
// who can refund it from the Razorpay dashboard (refund webhook below
// then takes the days back automatically).
async function checkForDuplicate(doc) {
  const recent = await Payment.countDocuments({
    userId: doc.userId, _id: { $ne: doc._id }, appliedAt: { $gt: new Date(doc.appliedAt.getTime() - DUPLICATE_WINDOW_MS) },
  });
  const flag = doc.supersededAt ? "superseded_paid" : recent > 0 ? "possible_duplicate" : null;
  if (!flag) return;
  await Payment.updateOne({ _id: doc._id }, { $set: { flag }, $push: { events: ev("flagged", "system", flag) } });
  alertFounder(flag === "possible_duplicate" ? "Possible duplicate purchase" : "Old (superseded) order was paid", [
    `Order ${doc.orderId} · payment ${doc.paymentId} · ₹${doc.amount / 100} · plan ${doc.planId}.`,
    flag === "possible_duplicate"
      ? "The same student had another payment activated in the last 30 minutes."
      : "The student had already opened a different plan when this older order was paid.",
    "The plan days were added (money is never ignored). If the student did not mean to buy twice, refund this payment from the Razorpay dashboard — the extra days are removed automatically.",
  ]);
}

async function flagPayment(docId, flag, source, note) {
  const doc = await Payment.findOneAndUpdate({ _id: docId }, { $set: { flag }, $push: { events: ev("flagged", source, `${flag}: ${note}`) } }, { returnDocument: "after" });
  if (doc) alertFounder(`Payment ${flag}`, [`Order ${doc.orderId} · plan ${doc.planId} · ₹${doc.amount / 100}.`, note, "The plan was NOT activated for this payment. Check it in the Razorpay dashboard."]);
}

// ── Refunds (only the founder can refund, from the Razorpay dashboard) ──
async function handleRefund(evt) {
  const refund = evt?.payload?.refund?.entity;
  if (!refund?.payment_id) return 200;
  const doc = await Payment.findOne({ paymentId: refund.payment_id });
  if (!doc) return 200;
  if (doc.status === "refunded") return 200;
  const full = Number(refund.amount) >= doc.amount;

  if (!full || !doc.appliedAt) {
    await Payment.updateOne({ _id: doc._id }, { $set: { flag: "refund" }, $push: { events: ev("refund", "webhook", `${refund.id} ₹${refund.amount / 100}${full ? "" : " (partial)"}`) } });
    alertFounder("Refund recorded", [`Order ${doc.orderId}: refund ${refund.id} of ₹${refund.amount / 100}.`, full ? "Plan had not been activated." : "Partial refund — the plan was left as it is."]);
    return 200;
  }

  await takeBackPaid(doc);
  await Payment.updateOne({ _id: doc._id }, { $set: { status: "refunded", flag: "refund" }, $push: { events: ev("refunded", "webhook", `${refund.id}; paid days removed`) } });
  alertFounder("Refund processed — paid days removed", [`Order ${doc.orderId} · ₹${doc.amount / 100} refunded (${refund.id}).`]);
  return 200;
}

// Takes back exactly what one activated payment added.
//   Pass  → the time span it added (pass end − old end), and the deep-
//           analysis date goes back to what it was. Value maths would only
//           remove ~90 days of a ₹599 pass, which is wrong.
//   Month → its value in days of the current tier (handles upgrades).
async function takeBackPaid(doc) {
  const now = new Date();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const user = await User.findById(doc.userId).select("plan planExpiresAt planPassUntil").lean();
    if (!user) return;
    const current = effectivePlan(user, now);
    const set = {};
    if (doc.pass) set.planPassUntil = doc.passUntilBefore ?? null;
    if (current !== "free" && user.planExpiresAt) {
      const end = new Date(user.planExpiresAt).getTime();
      let backMs;
      if (doc.pass && doc.periodEnd && (doc.endBefore || doc.planBefore === "free")) {
        const base = doc.endBefore ? Math.max(new Date(doc.endBefore).getTime(), new Date(doc.appliedAt).getTime()) : new Date(doc.appliedAt).getTime();
        backMs = Math.max(0, new Date(doc.periodEnd).getTime() - base);
      } else {
        backMs = (doc.amount / dailyValue(current)) * DAY_MS;
      }
      const newEnd = new Date(end - backMs);
      if (newEnd <= now) { set.plan = "free"; set.planExpiresAt = null; } else set.planExpiresAt = newEnd;
    }
    if (!Object.keys(set).length) return;
    const upd = await User.updateOne({ _id: user._id, plan: user.plan, planExpiresAt: user.planExpiresAt }, { $set: set });
    if (upd.modifiedCount === 1) return;
  }
}

// Chargebacks: a new dispute is flagged for the founder; a LOST dispute
// (money returned to the payer by the bank) removes the plan like a refund.
async function handleDispute(evt) {
  const d = evt?.payload?.dispute?.entity;
  const paymentId = d?.payment_id ?? evt?.payload?.payment?.entity?.id;
  if (!paymentId) return 200;
  const doc = await Payment.findOne({ paymentId });
  if (!doc) return 200;
  if (evt.event === "payment.dispute.lost") {
    if (doc.status === "refunded") return 200;
    if (doc.appliedAt) await takeBackPaid(doc);
    await Payment.updateOne({ _id: doc._id }, { $set: { status: "refunded", flag: "dispute" }, $push: { events: ev("dispute_lost", "webhook", `${d?.id ?? ""}; paid days removed`) } });
    alertFounder("Chargeback lost — paid days removed", [`Order ${doc.orderId} · ₹${doc.amount / 100} · dispute ${d?.id ?? "?"}.`]);
    return 200;
  }
  await Payment.updateOne({ _id: doc._id }, { $set: { flag: "dispute" }, $push: { events: ev(evt.event.replace("payment.", ""), "webhook", d?.id ?? "") } });
  if (evt.event === "payment.dispute.created") {
    alertFounder("Chargeback (dispute) opened", [`Order ${doc.orderId} · ₹${doc.amount / 100} · dispute ${d?.id ?? "?"}.`, "Reply with evidence in the Razorpay dashboard before the deadline. The plan stays on unless the dispute is lost."]);
  }
  return 200;
}

// ── Reconciliation: the third safety net ──────────────────────────
// Asks Razorpay about every order that is not finished yet (3 min – 3
// days old). A captured payment turns the plan on; an authorized one is
// captured first. Runs every 5 minutes on the server.
export async function reconcilePayments({ now = new Date() } = {}) {
  if (!paymentsEnabled()) return { checked: 0, applied: 0 };
  await releaseExpiredSeats({ now }).catch((err) => console.warn("[pay] seat release failed:", err.message));
  const docs = await Payment.find({
    appliedAt: null, status: { $in: ["created", "paid"] },
    createdAt: { $lt: new Date(now.getTime() - RECONCILE_MIN_AGE_MS), $gt: new Date(now.getTime() - RECONCILE_MAX_AGE_MS) },
  }).limit(50).lean();

  let applied = 0;
  for (const doc of docs) {
    try {
      const list = await rzp.fetchOrderPayments(doc.orderId);
      const items = Array.isArray(list?.items) ? list.items : [];
      let p = items.find((x) => x.status === "captured" && x.amount === doc.amount && x.currency === "INR");
      if (!p) {
        const auth = items.find((x) => x.status === "authorized" && x.amount === doc.amount && x.currency === "INR");
        if (auth) p = await rzp.capturePayment(auth.id, doc.amount).catch(() => null);
      }
      if (p?.status === "captured" && p.order_id === doc.orderId) {
        const done = await applyPaid(doc._id, { paymentId: p.id, method: p.method, email: p.email, source: "reconcile" });
        if (done?.appliedAt) applied += 1;
      }
    } catch (err) {
      console.warn(`[pay] reconcile ${doc.orderId} skipped:`, err.message);
    }
  }
  if (applied) console.log(`[pay] reconcile: activated ${applied} payment(s) the callback/webhook missed`);
  return { checked: docs.length, applied };
}

export function startPaymentReconcileJob() {
  if (env.NODE_ENV === "test") return null;
  const t = setInterval(() => { reconcilePayments().catch((e) => console.warn("[pay] reconcile failed:", e.message)); }, 5 * 60 * 1000);
  t.unref?.();
  return t;
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

// Catalog + real early-bird seats and today's price (never a fake counter).
export async function catalogWithSeats(cat = publicCatalog()) {
  for (const p of cat.plans) {
    p.current = p.amount;
    if (!p.early) continue;
    const used = await earlySeatsUsed({ id: p.id, early: p.early });
    p.early.seatsLeft = Math.max(0, p.early.seats - used);
    if (p.early.seatsLeft > 0) p.current = p.early.amount;
  }
  return cat;
}

export async function describeForParent(user) {
  const first = (String(user.name ?? "").trim().split(/\s+/)[0] || "Student").slice(0, 30);
  const catalog = await catalogWithSeats();
  catalog.plans = catalog.plans.filter((p) => !p.exam || p.exam === user.examMode);
  return { studentFirstName: first, examMode: user.examMode, ...planStatus(user), catalog };
}

// ── helpers ───────────────────────────────────────────────────────
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
export function istDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
