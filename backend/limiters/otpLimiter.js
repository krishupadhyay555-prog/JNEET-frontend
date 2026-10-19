// ============================================================
//  JNEET+ AI — limiters/otpLimiter.js
//  authLimiter only counts FAILED requests (skipSuccessfulRequests),
//  so a "send me a code" request that succeeds was never limited —
//  someone could make us email thousands of addresses (cost +
//  sender-reputation damage), or bomb one victim's inbox from many
//  IPs. These limiters count EVERY request.
//
//    otpIpLimiter    — 20 code-send requests / hour / IP
//    otpEmailLimiter — 6 code-send requests / hour / mailbox
//                      (keyed on the normalized address, so Gmail
//                      dot/plus variants share one bucket)
//    consentLimiter  — public parent-consent pages, 40 / 15 min / IP
// ============================================================

import rateLimit from "express-rate-limit";
import { normalizeEmail } from "../utils/email.js";

// IPv6 users get a fresh address per connection inside their /64, so
// bucket IPv6 by its /64 prefix; IPv4 is used as-is.
function ipKeyGenerator(ip) {
  if (!ip || !ip.includes(":")) return ip || "unknown";
  if (ip.startsWith("::ffff:")) return ip.slice(7); // IPv4-mapped
  return ip.split(":").slice(0, 4).join(":");
}

function tooMany(message, fallbackSec) {
  return (req, res) => {
    const resetMs = req.rateLimit?.resetTime instanceof Date
      ? req.rateLimit.resetTime.getTime()
      : Date.now() + fallbackSec * 1000;
    const retryAfter = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ success: false, error: message, retryAfter });
  };
}

export const otpIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `otp-ip:${ipKeyGenerator(req.ip ?? "")}`,
  handler: tooMany("Too many code requests from this network. Please try again in an hour.", 3600),
});

export const otpEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = normalizeEmail(req.body?.email);
    return email ? `otp-email:${email}` : `otp-noemail:${ipKeyGenerator(req.ip ?? "")}`;
  },
  handler: tooMany("Too many code requests for this email. Please try again in an hour.", 3600),
});

export const consentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `consent:${ipKeyGenerator(req.ip ?? "")}`,
  handler: tooMany("Too many requests. Please try again in a few minutes.", 900),
});
