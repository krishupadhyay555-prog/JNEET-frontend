// ============================================================
//  JNEET+ AI — utils/authCookie.js
//  Single source of truth for the session cookie + JWT so login,
//  logout, password change and account deletion can never drift
//  apart (a cookie cleared with different attributes than it was
//  set with is NOT cleared by the browser).
//
//  SameSite:
//    - production default "none" (frontend and API on different
//      sites, e.g. vercel.app + onrender.com),
//    - set COOKIE_SAMESITE=lax once the API lives on a subdomain of
//      the site (api.jneetai.com) — safer against CSRF and immune to
//      third-party-cookie blocking in Safari/Chrome.
// ============================================================

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const COOKIE_NAME = "jneet_token";

function sameSite() {
  if (env.COOKIE_SAMESITE) return env.COOKIE_SAMESITE;
  return env.NODE_ENV === "production" ? "none" : "lax";
}

export function baseCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  const ss = sameSite();
  return {
    httpOnly: true,
    // SameSite=None is only valid together with Secure
    secure:   isProd || ss === "none",
    sameSite: ss,
    path:     "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function sessionCookieOptions() {
  return { ...baseCookieOptions(), maxAge: env.SESSION_DAYS * 24 * 60 * 60 * 1000 };
}

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, examMode: user.examMode, tv: user.tokenVersion || 0 },
    env.JWT_SECRET,
    {
      expiresIn: `${env.SESSION_DAYS}d`,
      issuer:    "jneet-ai",
      audience:  "jneet-ai-client",
    }
  );
}

export function setSessionCookie(res, user) {
  res.cookie(COOKIE_NAME, generateToken(user), sessionCookieOptions());
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
}
