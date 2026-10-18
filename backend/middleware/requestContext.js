// ============================================================
//  JNEET+ AI — middleware/requestContext.js
//    requestId        — attaches an id to every request/response so a
//                       student's "something went wrong" screenshot can
//                       be matched to a server log line.
//    accessLog        — one line per request: method, PATH ONLY (never
//                       the query string, body or cookies), status, ms.
//    requireTrustedOrigin — CSRF defence-in-depth for cookie auth: a
//                       state-changing browser request whose Origin
//                       isn't on our allowlist is rejected, even if the
//                       cookie would have been sent. Requests with no
//                       Origin header (curl, server-to-server, webhooks)
//                       are not browser CSRF vectors and pass through.
// ============================================================

import crypto from "crypto";

export function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && /^[\w-]{8,64}$/.test(incoming) ? incoming : crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
}

export function accessLog(req, res, next) {
  const start = process.hrtime.bigint();
  // originalUrl, captured NOW: Express rewrites req.url/req.path while routing,
  // which would otherwise log "/ask" instead of "/api/ai/ask". Query string dropped.
  const path = req.originalUrl.split("?")[0];
  res.on("finish", () => {
    if (path === "/health") return; // uptime pings are noise
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`[http] ${req.id} ${req.method} ${path} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
}

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function requireTrustedOrigin(allowedOrigins) {
  const allowed = new Set(allowedOrigins);
  return (req, res, next) => {
    if (!UNSAFE.has(req.method)) return next();
    const origin = req.get("origin");
    if (!origin) return next();
    if (allowed.has(origin.replace(/\/$/, ""))) return next();
    return res.status(403).json({ success: false, error: "Request origin is not allowed." });
  };
}
