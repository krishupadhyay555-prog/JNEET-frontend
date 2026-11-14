// ============================================================
//  JNEET+ AI — middleware/admin.js
//  Founder-only routes. Runs AFTER protect. The logged-in account's
//  email must be in ADMIN_EMAILS (Render env, never in code) and be
//  verified. Everyone else gets a plain 404 — the admin area does not
//  even admit that it exists.
// ============================================================

import { env } from "../config/env.js";

export function isAdminEmail(email) {
  return Boolean(email) && env.ADMIN_EMAIL_SET.has(String(email).trim().toLowerCase());
}

export function requireAdmin(req, res, next) {
  if (!req.user || !isAdminEmail(req.user.email)) {
    return res.status(404).json({ success: false, error: "Not found." });
  }
  res.set("Cache-Control", "no-store");
  res.set("X-Robots-Tag", "noindex");
  console.log(`[admin] ${req.id} ${req.method} ${req.originalUrl.split("?")[0]}`);
  return next();
}
