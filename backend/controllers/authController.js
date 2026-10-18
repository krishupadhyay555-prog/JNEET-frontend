// ============================================================
//  JNEET+ AI — controllers/authController.js  (v9 — launch hardening)
//
//  WHAT CHANGED vs v8
//   1. HONEST EMAIL: register()/resend no longer swallow mail
//      failures. The response says `emailSent: true|false`, the
//      failure (HTTP status from Brevo, never the key) is logged, and
//      the user can resend immediately instead of waiting for a code
//      that was never sent.
//   2. Re-registering with an email whose signup is still UNVERIFIED
//      resends the code instead of a dead-end "already registered".
//      (The stored password is deliberately NOT overwritten — that
//      would let anyone hijack someone's pending signup.)
//   3. emailNormalized: one account per real mailbox (Gmail dots /
//      "+tag" variants are the same person).
//   4. DOB age gate + Terms/Privacy acceptance record + parental
//      approval request for under-18s (services/consentService.js).
//   5. Passwordless login: POST /login-code and /login-code/verify.
//   6. OTPs are HMAC-hashed (services/otpService.js), 5 attempts,
//      60s resend cooldown. Cooldown responses are now generic 200s
//      (a 429 only existed for real accounts = account enumeration).
//   7. A successful password reset also proves mailbox ownership and
//      marks the email verified.
//   8. Cookie + JWT helpers live in utils/authCookie.js.
//  Unchanged: per-account lockout, timing-attack dummy hash,
//  disposable-email block, passwordChangedAt session invalidation.
// ============================================================

import bcrypt   from "bcryptjs";
import User     from "../models/User.js";
import { getTargetExamOption } from "../config/targetExams.js";
import {
  sendPasswordResetOtp,
  sendVerificationOtp,
  sendLoginOtp,
  isEmailConfigured,
} from "../services/emailService.js";
import {
  issueOtp,
  clearOtp,
  checkOtp,
  cooldownRemainingSec,
  OTP_FIELDS,
} from "../services/otpService.js";
import { requestParentConsent, parentEmailIsSelf } from "../services/consentService.js";
import { isDisposableEmail } from "../utils/disposableEmails.js";
import { normalizeEmail } from "../utils/email.js";
import { parseDob, calcAge, ADULT_AGE } from "../utils/age.js";
import { toStudent } from "../utils/studentPayload.js";
import { setSessionCookie, clearSessionCookie } from "../utils/authCookie.js";
import { TERMS_VERSION, PRIVACY_VERSION } from "../config/legal.js";

const LOGIN_LOCK_THRESHOLD = 5;
const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_SEC = 60;

// A valid-looking bcrypt hash used ONLY to burn comparable CPU time
// when no real user exists (timing-attack mitigation).
const DUMMY_HASH = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8jkeu6ldOTQfz5vjP1wtRqZ3.PsQ9K";

function sendAuthResponse(user, statusCode, res, message, extra = {}) {
  setSessionCookie(res, user);
  return res.status(statusCode).json({
    success: true,
    message,
    student: toStudent(user),
    ...extra,
  });
}

// Backfill emailNormalized for legacy accounts the first time they
// authenticate. Fire-and-forget; a duplicate (two legacy accounts that
// normalize to the same mailbox) is simply skipped.
function backfillNormalized(user) {
  if (user.emailNormalized) return;
  User.updateOne(
    { _id: user._id, emailNormalized: { $exists: false } },
    { $set: { emailNormalized: normalizeEmail(user.email) } }
  ).catch((err) => {
    if (err?.code !== 11000) console.warn("[Auth] emailNormalized backfill failed:", err.message);
  });
}

function logMailFailure(context, err) {
  console.error(`[Auth] ${context} email failed`, {
    status: err?.status ?? null,
    retryable: err?.retryable ?? null,
    message: err?.message,
  });
}

// ── Register ─────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, examMode, dateOfBirth, parentEmail } = req.body;

    if (isDisposableEmail(email)) {
      return res.status(400).json({
        success:     false,
        error:       "Please use a permanent email address — disposable/temporary email providers aren't supported.",
        fieldErrors: [{ field: "email", message: "Disposable email addresses aren't supported." }],
      });
    }

    const dob = parseDob(dateOfBirth);
    const age = calcAge(dateOfBirth);
    const minor = age < ADULT_AGE;

    if (minor) {
      if (!parentEmail) {
        return res.status(400).json({
          success: false,
          error: "A parent or guardian's email is required for students under 18.",
          fieldErrors: [{ field: "parentEmail", message: "A parent or guardian's email is required for students under 18." }],
        });
      }
      if (parentEmailIsSelf(email, parentEmail)) {
        return res.status(400).json({
          success: false,
          error: "The parent/guardian email must be different from your own.",
          fieldErrors: [{ field: "parentEmail", message: "This must be your parent or guardian's email, not yours." }],
        });
      }
    }

    const emailNormalized = normalizeEmail(email);

    const existing = await User.findOne({
      $or: [{ email }, { emailNormalized }],
    }).select("+emailOtpExpiresAt");

    if (existing) {
      // Signup started earlier but never verified → help them finish it.
      if (existing.isActive && !existing.isEmailVerified) {
        const wait = cooldownRemainingSec(existing.emailOtpExpiresAt);
        let emailSent = wait > 0; // a recent code is already on its way
        let resendAfter = wait;

        if (wait === 0) {
          const otp = await issueOtp(existing, "verify", OTP_FIELDS.verify);
          try {
            await sendVerificationOtp(existing.email, otp, existing.name);
            emailSent = true;
            resendAfter = RESEND_COOLDOWN_SEC;
          } catch (mailErr) {
            logMailFailure("Verification (re-register)", mailErr);
            clearOtp(existing, OTP_FIELDS.verify);
            await existing.save({ validateBeforeSave: false });
          }
        }

        return res.status(200).json({
          success: true,
          requiresVerification: true,
          email: existing.email,
          emailSent,
          resendAfter,
          message: emailSent
            ? "You already started signing up with this email. Enter the code we sent."
            : "You already started signing up with this email, but we couldn't send the code. Tap 'Resend code'.",
        });
      }

      return res.status(409).json({
        success:     false,
        error:       "This email is already registered. Please log in instead.",
        fieldErrors: [{ field: "email", message: "This email is already registered." }],
      });
    }

    const newUser = await User.create({
      name,
      email,
      emailNormalized,
      password,
      examMode,
      dateOfBirth: dob,
      isEmailVerified: false,
      consent: {
        termsVersion:   TERMS_VERSION,
        privacyVersion: PRIVACY_VERSION,
        acceptedAt:     new Date(),
        acceptedIp:     req.ip ?? null,
        ageGroup:       minor ? "minor" : "adult",
        parentEmail:    minor ? parentEmail : null,
        parentStatus:   minor ? "pending" : "not_required",
      },
    });

    const otp = await issueOtp(newUser, "verify", OTP_FIELDS.verify);

    let emailSent = true;
    try {
      await sendVerificationOtp(newUser.email, otp, newUser.name);
    } catch (mailErr) {
      emailSent = false;
      logMailFailure("Verification (register)", mailErr);
      clearOtp(newUser, OTP_FIELDS.verify);
      await newUser.save({ validateBeforeSave: false });
    }

    console.log(`[Auth] Registered (pending verification): ${newUser._id} (${newUser.examMode}${minor ? ", minor" : ""})`);

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: newUser.email,
      emailSent,
      resendAfter: emailSent ? RESEND_COOLDOWN_SEC : 0,
      message: emailSent
        ? "Account created! Check your email for a verification code."
        : "Account created, but we couldn't send the verification email. Tap 'Resend code'.",
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success:     false,
        error:       "This email is already registered.",
        fieldErrors: [{ field: "email", message: "This email is already registered." }],
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(". ") });
    }
    next(err);
  }
};

// ── Login (email + password) ─────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +failedLoginAttempts +accountLockedUntil +emailNormalized"
    );

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error:   "Your account has been deactivated. Please contact support.",
      });
    }

    if (user.accountLockedUntil && user.accountLockedUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        error:   `Too many failed attempts. This account is temporarily locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= LOGIN_LOCK_THRESHOLD) {
        user.accountLockedUntil = new Date(Date.now() + LOGIN_LOCK_DURATION_MS);
        user.failedLoginAttempts = 0;
        await user.save({ validateBeforeSave: false });
        return res.status(423).json({
          success: false,
          error:   "Too many failed attempts. This account is temporarily locked for 15 minutes.",
        });
      }

      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (user.failedLoginAttempts > 0 || user.accountLockedUntil) {
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = null;
    }

    if (!user.isEmailVerified) {
      await user.save({ validateBeforeSave: false });
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        error: "Please verify your email before logging in.",
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    backfillNormalized(user);

    sendAuthResponse(user, 200, res, `Welcome back, ${user.name}!`);

  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User account not found or deactivated." });
    }

    return res.status(200).json({ success: true, student: toStudent(user) });

  } catch (err) {
    next(err);
  }
};

export const updateTargetExam = async (req, res, next) => {
  try {
    const option = req.body.targetExam
      ? getTargetExamOption(req.body.targetExam)
      : null;

    if (req.body.targetExam && !option) {
      return res.status(400).json({ success: false, error: "Please select a valid target exam." });
    }

    const update = {
      targetExam: option?.key ?? null,
      targetExamPromptDismissed: !!req.body.targetExamPromptDismissed,
    };

    if (option) update.targetExamPromptDismissed = true;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User account not found or deactivated." });
    }

    return res.status(200).json({ success: true, student: toStudent(user) });

  } catch (err) {
    next(err);
  }
};

// ── Forgot Password flow ─────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!isEmailConfigured()) {
      console.error("[Auth] forgot-password requested but email service is not configured");
      return res.status(503).json({
        success: false,
        error: "Email service is temporarily unavailable. Please try again later.",
      });
    }

    const user = await User.findOne({ email }).select("+resetOtpExpiresAt");

    const genericResponse = {
      success: true,
      resendAfter: RESEND_COOLDOWN_SEC,
      message: "If an account exists with this email, a reset code has been sent.",
    };

    if (!user || !user.isActive) return res.status(200).json(genericResponse);

    if (cooldownRemainingSec(user.resetOtpExpiresAt) > 0) {
      return res.status(200).json(genericResponse); // a code was just sent
    }

    const otp = await issueOtp(user, "reset", OTP_FIELDS.reset);

    try {
      await sendPasswordResetOtp(user.email, otp, user.name);
    } catch (mailErr) {
      clearOtp(user, OTP_FIELDS.reset);
      await user.save({ validateBeforeSave: false });
      logMailFailure("Password reset", mailErr);
      return res.status(502).json({
        success: false,
        error:   "Could not send the reset email right now. Please try again in a few minutes.",
      });
    }

    return res.status(200).json(genericResponse);

  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +password"
    );

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        error:   "Invalid or expired reset code. Please request a new one.",
      });
    }

    const check = await checkOtp(user, "reset", otp);
    if (!check.ok) {
      if (check.clear) await user.save({ validateBeforeSave: false });
      return res.status(check.status).json({ success: false, error: check.error });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        success: false,
        error:   "That's your current password. Please choose a different one.",
      });
    }

    user.password = newPassword;
    clearOtp(user, OTP_FIELDS.reset);
    user.passwordChangedAt = new Date();
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    // Receiving the code proves the mailbox is theirs.
    user.isEmailVerified = true;

    await user.save();

    console.log(`[Auth] Password reset successful: ${user._id}`);
    sendAuthResponse(user, 200, res, "Password reset successful. You're now logged in.");

  } catch (err) {
    next(err);
  }
};

// ── Signup email verification ────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select(
      "+emailOtpHash +emailOtpExpiresAt +emailOtpAttempts +consent.parentTokenHash"
    );

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        error:   "Invalid or expired verification code. Please request a new one.",
      });
    }

    if (user.isEmailVerified) {
      clearOtp(user, OTP_FIELDS.verify);
      await user.save({ validateBeforeSave: false });
      return sendAuthResponse(user, 200, res, "Email already verified. You're now logged in.");
    }

    const check = await checkOtp(user, "verify", otp);
    if (!check.ok) {
      if (check.clear) await user.save({ validateBeforeSave: false });
      return res.status(check.status).json({ success: false, error: check.error });
    }

    user.isEmailVerified = true;
    clearOtp(user, OTP_FIELDS.verify);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Under-18: now that the student's mailbox is verified, ask the
    // parent for approval (so fake signups never spam a parent).
    let parentRequestSent = null;
    if (user.consent?.ageGroup === "minor" && user.consent.parentStatus === "pending") {
      const result = await requestParentConsent(user);
      parentRequestSent = result.sent;
    }

    console.log(`[Auth] Email verified: ${user._id}`);
    sendAuthResponse(user, 200, res, "Email verified! Welcome to JNEET+ AI.", { parentRequestSent });

  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!isEmailConfigured()) {
      console.error("[Auth] resend-verification requested but email service is not configured");
      return res.status(503).json({
        success: false,
        error: "Email service is temporarily unavailable. Please try again later.",
      });
    }

    const user = await User.findOne({ email }).select("+emailOtpExpiresAt");

    const genericResponse = {
      success: true,
      resendAfter: RESEND_COOLDOWN_SEC,
      message: "If an unverified account exists with this email, a new code has been sent.",
    };

    if (!user || !user.isActive || user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    const wait = cooldownRemainingSec(user.emailOtpExpiresAt);
    if (wait > 0) {
      return res.status(200).json({ ...genericResponse, resendAfter: wait });
    }

    const otp = await issueOtp(user, "verify", OTP_FIELDS.verify);

    try {
      await sendVerificationOtp(user.email, otp, user.name);
    } catch (mailErr) {
      clearOtp(user, OTP_FIELDS.verify);
      await user.save({ validateBeforeSave: false });
      logMailFailure("Verification (resend)", mailErr);
      return res.status(502).json({
        success: false,
        error:   "Could not send the verification email right now. Please try again in a few minutes.",
      });
    }

    return res.status(200).json(genericResponse);

  } catch (err) {
    next(err);
  }
};

// ── Passwordless login: "email me a code" ────────────────────────
export const requestLoginCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!isEmailConfigured()) {
      console.error("[Auth] login-code requested but email service is not configured");
      return res.status(503).json({
        success: false,
        error: "Email service is temporarily unavailable. Please use your password instead.",
      });
    }

    const user = await User.findOne({ email }).select("+loginOtpExpiresAt");

    const genericResponse = {
      success: true,
      resendAfter: RESEND_COOLDOWN_SEC,
      message: "If an account exists with this email, a login code has been sent.",
    };

    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    if (cooldownRemainingSec(user.loginOtpExpiresAt) > 0) {
      return res.status(200).json(genericResponse);
    }

    const otp = await issueOtp(user, "login", OTP_FIELDS.login);

    try {
      await sendLoginOtp(user.email, otp, user.name);
    } catch (mailErr) {
      clearOtp(user, OTP_FIELDS.login);
      await user.save({ validateBeforeSave: false });
      logMailFailure("Login code", mailErr);
      return res.status(502).json({
        success: false,
        error:   "Could not send the login code right now. Please try again in a few minutes.",
      });
    }

    return res.status(200).json(genericResponse);

  } catch (err) {
    next(err);
  }
};

export const verifyLoginCode = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select(
      "+loginOtpHash +loginOtpExpiresAt +loginOtpAttempts +emailNormalized"
    );

    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error:   "Invalid or expired code. Please request a new one.",
      });
    }

    const check = await checkOtp(user, "login", otp);
    if (!check.ok) {
      if (check.clear) await user.save({ validateBeforeSave: false });
      return res.status(check.status).json({ success: false, error: check.error });
    }

    clearOtp(user, OTP_FIELDS.login);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    backfillNormalized(user);

    sendAuthResponse(user, 200, res, `Welcome back, ${user.name}!`);

  } catch (err) {
    next(err);
  }
};
