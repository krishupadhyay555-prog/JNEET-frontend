// ============================================================
//  JNEET+ AI — controllers/paymentController.js  (B4, web only)
//    PUBLIC
//      GET  /api/payments/plans                 catalog (+ enabled flag)
//      POST /api/payments/webhook               Razorpay events (raw body, HMAC)
//      GET  /api/payments/parent/:token         parent link: who + plans
//      POST /api/payments/parent/:token/order   parent starts a payment
//      POST /api/payments/parent/:token/verify  parent checkout callback
//    STUDENT (logged in)
//      GET  /api/payments/me                    plan, end date, receipts
//      POST /api/payments/order                 adult student starts a payment
//      POST /api/payments/verify                checkout callback
//      POST /api/payments/parent-link           7-day link for a parent
//  The app shell (Play Store TWA) never shows any of this — and if it
//  ever calls the order routes, the server refuses (X-App-Shell: twa).
// ============================================================

import User from "../models/User.js";
import { publicCatalog } from "../config/plans.js";
import { canPayDirectly } from "../utils/plan.js";
import {
  BillingError, startOrder, confirmCheckout, handleWebhook, billingSummary,
  makeParentLink, userFromParentToken, describeForParent,
} from "../services/payments/billing.js";

function fail(res, err, next) {
  if (err instanceof BillingError) {
    return res.status(err.status).json({ success: false, code: err.code, error: err.message });
  }
  return next(err);
}

function fromAppShell(req) {
  return String(req.get("x-app-shell") || "").toLowerCase() === "twa";
}
const APP_SHELL_ERROR = {
  success: false, code: "APP_SHELL",
  error: "Plans can't be bought inside the app. Please visit jneetai.com in your browser.",
};

export const getPlans = (req, res) => {
  res.set("Cache-Control", "public, max-age=300");
  res.json({ success: true, ...publicCatalog() });
};

export const getMine = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const summary = await billingSummary(user);
    res.set("Cache-Control", "no-store");
    return res.json({ success: true, ...summary, canPayDirectly: canPayDirectly(user) });
  } catch (err) { return next(err); }
};

export const createOrder = async (req, res, next) => {
  try {
    if (fromAppShell(req)) return res.status(403).json(APP_SHELL_ERROR);
    const user = await User.findById(req.user.id).lean();
    if (!canPayDirectly(user)) {
      return res.status(403).json({
        success: false, code: "PARENT_PAYS",
        error: "Students under 18 can't pay by themselves. Send the payment link to your parent or guardian instead.",
      });
    }
    const order = await startOrder(user, req.body.planId, { payer: "student" });
    return res.status(201).json({
      success: true, ...order,
      prefill: { name: user.name, email: user.email },
      description: describe(order),
    });
  } catch (err) { return fail(res, err, next); }
};

export const verify = async (req, res, next) => {
  try {
    const out = await confirmCheckout({ ...req.body, userId: req.user.id });
    return res.json({ success: true, ...out });
  } catch (err) { return fail(res, err, next); }
};

export const parentLink = (req, res) => {
  if (fromAppShell(req)) return res.status(403).json(APP_SHELL_ERROR);
  return res.json({ success: true, ...makeParentLink({ _id: req.user.id }) });
};

export const describeParent = async (req, res, next) => {
  try {
    const user = await userFromParentToken(req.params.token);
    return res.json({ success: true, ...describeForParent(user) });
  } catch (err) { return fail(res, err, next); }
};

export const parentOrder = async (req, res, next) => {
  try {
    const user = await userFromParentToken(req.params.token);
    const order = await startOrder(user, req.body.planId, { payer: "parent" });
    return res.status(201).json({ success: true, ...order, prefill: {}, description: describe(order) });
  } catch (err) { return fail(res, err, next); }
};

export const parentVerify = async (req, res, next) => {
  try {
    const user = await userFromParentToken(req.params.token);
    const out = await confirmCheckout({ ...req.body, userId: user._id });
    return res.json({ success: true, ...out });
  } catch (err) { return fail(res, err, next); }
};

export const webhook = async (req, res, next) => {
  try {
    const status = await handleWebhook(req.body, req.get("x-razorpay-signature"));
    return res.status(status).json({ ok: status === 200 });
  } catch (err) { return next(err); }
};

function describe(order) {
  const t = order.tier === "elite" ? "Elite" : "Pro";
  return `${t} · ${order.months} month${order.months > 1 ? "s" : ""} (prepaid, non-refundable)`;
}
