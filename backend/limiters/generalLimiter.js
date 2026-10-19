// ============================================================
//  JNEET+ AI — limiters/generalLimiter.js
//  Baseline abuse protection for the whole API (previously only
//  /auth and /ai were limited, so /test, /notes, /chat could be
//  hammered without limit).
//
//    apiLimiter   — 300 requests / minute / IP, every /api route
//    userLimiter  — 120 requests / minute / signed-in user (keyed on
//                   the user id, so shared school/hostel Wi-Fi isn't
//                   punished); used on the data routes
//    heavyLimiter — 12 / minute / user for expensive operations such
//                   as starting a full test
// ============================================================

import rateLimit from "express-rate-limit";

function ipBucket(ip) {
  if (!ip || !ip.includes(":")) return ip || "unknown";
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip.split(":").slice(0, 4).join(":");
}

function limited(message) {
  return (req, res) => {
    const resetMs = req.rateLimit?.resetTime instanceof Date
      ? req.rateLimit.resetTime.getTime()
      : Date.now() + 60_000;
    const retryAfter = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ success: false, error: message, retryAfter });
  };
}

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `api:${ipBucket(req.ip)}`,
  handler: limited("Too many requests. Please slow down and try again in a minute."),
});

export const userLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => (req.user?.id ? `user:${req.user.id}` : `ip:${ipBucket(req.ip)}`),
  handler: limited("You're doing that too quickly. Please wait a moment."),
});

export const heavyLimiter = rateLimit({
  windowMs: 60_000,
  limit: 12,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => (req.user?.id ? `heavy:${req.user.id}` : `heavy-ip:${ipBucket(req.ip)}`),
  handler: limited("You're starting tests too quickly. Please wait a moment."),
});
