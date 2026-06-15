// ============================================================
//  JNEET+ AI — limiters/authLimiter.js
//  Strict limiter for /api/auth routes.
//  Brute-force protection: 10 attempts per 15 minutes per IP.
//  Decoupled from server.js — imported directly by authRoutes.js.
//
//  FIX (express-rate-limit v7):
//    - handler must accept (req, res, next, options) — 4 args.
//      In v7 the library passes `next` as the 3rd argument; omitting it
//      leaves the middleware chain with an unresolvable `next` reference
//      which throws "next is not a function" on every auth request.
//    - req.rateLimit.resetTime is a Date object in v7, NOT epoch ms.
//      Use .getTime() before dividing, otherwise Math.ceil returns NaN.
// ============================================================

import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,  // 15 minutes
  max:             10,               // Max 10 attempts per window
  standardHeaders: "draft-7",       // RateLimit-* headers (RFC draft 7)
  legacyHeaders:   false,

  // Only count failed requests — successful logins don't burn attempts
  skipSuccessfulRequests: true,

  // v7 REQUIRED signature: (req, res, next, options)
  // `next` must be accepted even if not called — omitting it breaks the chain
  handler: (req, res, _next, _options) => {
    // resetTime is a Date in v7 — call .getTime() to get epoch ms
    const resetMs      = req.rateLimit?.resetTime instanceof Date
      ? req.rateLimit.resetTime.getTime()
      : Date.now() + 15 * 60 * 1000;
    const retryAfterSec = Math.ceil((resetMs - Date.now()) / 1000);

    res.status(429).json({
      success:    false,
      error:      "Too many attempts. Please wait 15 minutes before trying again.",
      retryAfter: retryAfterSec > 0 ? retryAfterSec : 900,
    });
  },

  keyGenerator: (req) => `auth:${req.ip}:${req.path}`,
});