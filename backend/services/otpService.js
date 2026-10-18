// ============================================================
//  JNEET+ AI — services/otpService.js
//  One place for generating / hashing / verifying one-time codes.
//
//  Codes are stored as HMAC-SHA256(JWT_SECRET, purpose|userId|otp):
//    - a leaked database can't be used to brute-force the 6 digits
//      without also having the server secret,
//    - a code issued for one purpose (e.g. password reset) can never
//      verify for another (e.g. login), even for the same user.
//  Hashes written by the older bcrypt implementation ("$2…") still
//  verify, so codes in flight during a deploy don't break.
// ============================================================

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export const OTP_VALIDITY_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(purpose, userId, otp) {
  return crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`${purpose}|${String(userId)}|${otp}`)
    .digest("hex");
}

export async function verifyOtp(purpose, userId, otp, storedHash) {
  if (!storedHash || typeof otp !== "string") return false;

  if (storedHash.startsWith("$2")) {
    return bcrypt.compare(otp, storedHash);
  }

  const expected = Buffer.from(hashOtp(purpose, userId, otp), "hex");
  const actual = Buffer.from(storedHash, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

// Seconds the caller must still wait before another code may be sent.
// `expiresAt` is `OTP_VALIDITY_MS` after issuance, so issuance time
// can be derived from it without storing another field.
export function cooldownRemainingSec(expiresAt, now = Date.now()) {
  if (!expiresAt) return 0;
  const issuedAt = new Date(expiresAt).getTime() - OTP_VALIDITY_MS;
  const remainingMs = OTP_RESEND_COOLDOWN_MS - (now - issuedAt);
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

// Generates a code, stores its hash on the user document and saves.
// Returns the plain code (to be emailed — never logged or stored).
export async function issueOtp(user, purpose, fields) {
  const otp = generateOtp();
  user[fields.hash] = hashOtp(purpose, user._id, otp);
  user[fields.expiresAt] = new Date(Date.now() + OTP_VALIDITY_MS);
  user[fields.attempts] = 0;
  await user.save({ validateBeforeSave: false });
  return otp;
}

export function clearOtp(user, fields) {
  user[fields.hash] = null;
  user[fields.expiresAt] = null;
  user[fields.attempts] = 0;
}

export const OTP_FIELDS = {
  verify: { hash: "emailOtpHash", expiresAt: "emailOtpExpiresAt", attempts: "emailOtpAttempts" },
  reset:  { hash: "resetOtpHash", expiresAt: "resetOtpExpiresAt", attempts: "resetOtpAttempts" },
  login:  { hash: "loginOtpHash", expiresAt: "loginOtpExpiresAt", attempts: "loginOtpAttempts" },
};

// Shared "check a submitted code" routine. Returns
//   { ok: true }                               on success (fields NOT cleared — caller clears)
//   { ok: false, status, error, clear: bool }  on failure (caller persists `clear`)
export async function checkOtp(user, purpose, submitted) {
  const f = OTP_FIELDS[purpose];
  const hash = user[f.hash];
  const expiresAt = user[f.expiresAt];

  if (!hash || !expiresAt) {
    return { ok: false, status: 400, clear: false, error: "Invalid or expired code. Please request a new one." };
  }

  if (new Date(expiresAt).getTime() < Date.now()) {
    clearOtp(user, f);
    return { ok: false, status: 400, clear: true, error: "This code has expired. Please request a new one." };
  }

  if ((user[f.attempts] ?? 0) >= OTP_MAX_ATTEMPTS) {
    clearOtp(user, f);
    return { ok: false, status: 429, clear: true, error: "Too many incorrect attempts. Please request a new code." };
  }

  const valid = await verifyOtp(purpose, user._id, submitted, hash);
  if (!valid) {
    user[f.attempts] = (user[f.attempts] ?? 0) + 1;
    const remaining = OTP_MAX_ATTEMPTS - user[f.attempts];
    if (remaining <= 0) clearOtp(user, f);
    return {
      ok: false,
      status: 400,
      clear: true,
      error:
        remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Incorrect code. Please request a new code.",
    };
  }

  return { ok: true };
}
