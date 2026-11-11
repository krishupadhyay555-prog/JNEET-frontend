// ============================================================
//  JNEET+ AI — middleware/captcha.js
//  Cloudflare Turnstile verification for the endpoints that send an
//  e-mail or accept a password (register, login, login-code,
//  forgot-password, resend-verification).
//
//  - OFF unless TURNSTILE_SECRET_KEY is set (safe to deploy first).
//  - Every request must carry a FRESH token (`captchaToken`); Cloudflare
//    tokens are single-use, so a replayed token is rejected.
//  - Fails OPEN when it is our problem or Cloudflare's (outage, 5xx,
//    wrong secret): a student is never locked out because of a captcha
//    misconfiguration. It fails CLOSED only when Cloudflare says the
//    token itself is bad or missing.
//  - Does not touch the rate limiters (they are unchanged).
// ============================================================

import { env } from "../config/env.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 4000;
const OUR_PROBLEM = new Set(["missing-input-secret", "invalid-input-secret", "internal-error", "bad-request"]);

export async function verifyTurnstile(token, ip, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof token !== "string" || token.length < 5 || token.length > 2048) {
    return { ok: false, reason: "missing" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    if (ip) body.set("remoteip", String(ip));

    const res = await fetchImpl(VERIFY_URL, { method: "POST", body, signal: controller.signal });
    if (!res.ok) {
      console.warn(`[Captcha] Cloudflare answered ${res.status} — letting the request through`);
      return { ok: true, skipped: true };
    }
    const data = await res.json().catch(() => null);
    if (data?.success === true) return { ok: true };

    const codes = Array.isArray(data?.["error-codes"]) ? data["error-codes"] : [];
    if (codes.some((c) => OUR_PROBLEM.has(c))) {
      console.error("[Captcha] Turnstile is misconfigured (check TURNSTILE_SECRET_KEY):", codes.join(","));
      return { ok: true, skipped: true };
    }
    return { ok: false, reason: "invalid", codes };
  } catch (err) {
    console.warn("[Captcha] verification unavailable — letting the request through:", err?.name || err?.message);
    return { ok: true, skipped: true };
  } finally {
    clearTimeout(timer);
  }
}

export const requireCaptcha = async (req, res, next) => {
  if (!env.TURNSTILE_SECRET_KEY) return next();
  try {
    const result = await verifyTurnstile(req.body?.captchaToken, req.ip);
    if (result.ok) return next();
    return res.status(400).json({
      success: false,
      code: "CAPTCHA_FAILED",
      error: result.reason === "missing"
        ? "The security check didn't load. Turn off any ad-blocker or VPN for this site and try again."
        : "The security check expired or failed. Please try again.",
    });
  } catch (err) {
    return next(err);
  }
};
