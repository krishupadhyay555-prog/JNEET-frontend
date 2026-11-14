// ============================================================
//  JNEET+ AI — services/payments/razorpay.js
//  Thin Razorpay REST client (no SDK: three calls + two HMAC checks).
//    createOrder     POST /v1/orders
//    fetchPayment    GET  /v1/payments/:id
//    capturePayment  POST /v1/payments/:id/capture  (only if the
//                    dashboard is not set to auto-capture)
//    verifyCheckoutSignature  HMAC_SHA256(order_id|payment_id, key_secret)
//    verifyWebhookSignature   HMAC_SHA256(raw body, webhook secret)
//  Both comparisons are constant-time. Errors never include the keys.
// ============================================================

import crypto from "crypto";
import { env } from "../../config/env.js";

const TIMEOUT_MS = 10_000;

export class RazorpayError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = "RazorpayError";
    this.status = status;
  }
}

function authHeader() {
  const raw = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function call(method, path, body) {
  let res;
  try {
    res = await fetch(`${env.RAZORPAY_API_URL}${path}`, {
      method,
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new RazorpayError(`Razorpay unreachable (${err.name})`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const desc = data?.error?.description || `HTTP ${res.status}`;
    throw new RazorpayError(`Razorpay ${method} ${path.split("/")[1]} failed: ${desc}`, res.status);
  }
  return data;
}

export function createOrder({ amount, receipt, notes }) {
  return call("POST", "/orders", { amount, currency: "INR", receipt, notes });
}

export function fetchPayment(paymentId) {
  return call("GET", `/payments/${encodeURIComponent(paymentId)}`);
}

export function capturePayment(paymentId, amount) {
  return call("POST", `/payments/${encodeURIComponent(paymentId)}/capture`, { amount, currency: "INR" });
}

function safeEqualHex(expected, given) {
  if (typeof given !== "string" || !/^[0-9a-f]{64}$/i.test(given)) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(given.toLowerCase(), "hex"));
}

export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET || !Buffer.isBuffer(rawBody)) return false;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return safeEqualHex(expected, signature);
}
