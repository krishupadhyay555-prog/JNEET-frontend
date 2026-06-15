// ============================================================
//  JNEET+ AI — limiters/aiLimiter.js
//  Optimized limiter for /api/ai routes.
//  Prevents API abuse: 30 requests per minute per user (by ID).
//
//  FIX (express-rate-limit v7):
//    - handler must accept (req, res, next, options) — 4 args.
//    - req.rateLimit.resetTime is a Date object in v7, not epoch ms.
// ============================================================

import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs:        60 * 1000,   // 1 minute
  max:             30,           // Max 30 AI requests per minute
  standardHeaders: "draft-7",
  legacyHeaders:   false,

  // Key by authenticated user ID — not IP.
  keyGenerator: (req) => {
    const userId = req.user?.id?.toString();
    return userId ? `ai:user:${userId}` : `ai:ip:${req.ip}`;
  },

  // v7 REQUIRED signature: (req, res, next, options)
  handler: (req, res, _next, _options) => {
    const resetMs       = req.rateLimit?.resetTime instanceof Date
      ? req.rateLimit.resetTime.getTime()
      : Date.now() + 60 * 1000;
    const retryAfterSec = Math.ceil((resetMs - Date.now()) / 1000);

    res.status(429).json({
      success:    false,
      error:      "Slow down! You're sending too many questions. Please wait a moment.",
      retryAfter: retryAfterSec > 0 ? retryAfterSec : 60,
    });
  },
});