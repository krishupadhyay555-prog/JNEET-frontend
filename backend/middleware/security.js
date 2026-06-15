// ============================================================
//  JNEET+ AI — middleware/security.js
//  Helmet (hardened CSP) + express-mongo-sanitize.
//  Applied globally in server.js BEFORE any route handler.
// ============================================================

import helmet          from "helmet";
import mongoSanitize   from "express-mongo-sanitize";
import { env }         from "../config/env.js";

const isProd = env.NODE_ENV === "production";

// ── Hardened Helmet Configuration ────────────────────────────
export const helmetMiddleware = helmet({
  // Content Security Policy — strict allowlist
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],  // needed for inline CSS in some frameworks
      fontSrc:        ["'self'", "https://fonts.gstatic.com"],
      imgSrc:         ["'self'", "data:", "https:"],
      connectSrc:     [
        "'self'",
        "https://generativelanguage.googleapis.com",  // Gemini API
        ...(isProd ? [] : ["http://localhost:5173", "http://localhost:3000"]),
      ],
      frameSrc:       ["'none'"],
      objectSrc:      ["'none'"],
      baseUri:        ["'self'"],
      formAction:     ["'self'"],
      upgradeInsecureRequests: isProd ? [] : null,
    },
    reportOnly: false,
  },

  // Prevent clickjacking — no iframing this app
  frameguard: { action: "deny" },

  // Block MIME sniffing
  noSniff: true,

  // XSS protection header (legacy browsers)
  xssFilter: true,

  // Don't reveal server tech stack
  hidePoweredBy: true,

  // HTTP Strict Transport Security — only in production
  hsts: isProd
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,

  // Referrer policy — don't leak URL info to third parties
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },

  // Prevent loading in cross-origin contexts
  crossOriginEmbedderPolicy: false, // disabled — would break Gemini SSE streaming
  crossOriginOpenerPolicy:   { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
});

// ── NoSQL Injection Sanitizer ─────────────────────────────────
// Strips keys containing '$' and '.' from req.body, req.params,
// and req.query before they reach any route handler.
// Prevents: { "email": { "$gt": "" } } injection attacks.
export const sanitizeMiddleware = mongoSanitize({
  replaceWith:     "_",  // Replace forbidden keys with '_' instead of deleting
  onSanitizeError: (req, res) => {
    res.status(400).json({
      success: false,
      error:   "Invalid characters detected in request. Request blocked.",
    });
  },
});