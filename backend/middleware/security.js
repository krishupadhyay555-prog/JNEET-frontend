// ============================================================
//  JNEET+ AI — middleware/security.js  (v2 — API-only CSP)
//  This server only returns JSON/SSE — it never serves HTML, scripts
//  or styles — so the strictest possible policy applies
//  (default-src 'none'). The previous allowlist (Gemini domain,
//  fonts, inline styles) described a web page, which this isn't.
//  The browser-facing CSP belongs on the FRONTEND host
//  (frontend/vercel.json).
// ============================================================

import helmet        from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { env }       from "../config/env.js";

const isProd = env.NODE_ENV === "production";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc:     ["'none'"],
      frameAncestors: ["'none'"],
      baseUri:        ["'none'"],
      formAction:     ["'none'"],
    },
  },
  frameguard: { action: "deny" },
  noSniff: true,
  hidePoweredBy: true,
  hsts: isProd ? { maxAge: 63072000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: "no-referrer" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy:   { policy: "same-origin" },
  // cross-origin: the browser app (another origin) reads our responses via CORS
  crossOriginResourcePolicy: { policy: "cross-origin" },
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
});

// Strips keys containing '$' or '.' from body/params/query so
// { "email": { "$gt": "" } } style NoSQL injection cannot reach Mongo.
export const sanitizeMiddleware = mongoSanitize({
  replaceWith:     "_",
  onSanitizeError: (req, res) => {
    res.status(400).json({
      success: false,
      error:   "Invalid characters detected in request. Request blocked.",
    });
  },
});
