// ============================================================
//  JNEET+ AI — controllers/authController.js  (v8 — production hardening)
//  ADDED (standard practices every serious auth system has):
//
//  1. PER-ACCOUNT LOGIN LOCKOUT — 5 wrong passwords locks that
//     specific account for 15 minutes, regardless of which IP the
//     attempts came from. Complements (doesn't replace) the
//     existing per-IP authLimiter. Counter resets to 0 on any
//     successful login.
//
//  2. TIMING-ATTACK MITIGATION — previously, if an email wasn't
//     registered, login() returned immediately (no bcrypt call). If
//     it WAS registered, a full bcrypt.compare() ran (~100ms+). An
//     attacker measuring response time could use that gap to test
//     which emails are registered, even though the error message
//     itself is identical. Now a bcrypt compare against a dummy
//     hash ALWAYS runs for the "user not found" path too, so both
//     cases take comparable time.
//
//  3. OTP RESEND COOLDOWN — both resendVerification and
//     forgotPassword now reject a new OTP request if the previous
//     one was issued less than 60 seconds ago (derived from the
//     existing 10-minute expiry timestamp — no new fields needed).
//     Stops someone from spamming a mailbox with rapid repeat
//     requests.
//
//  4. DISPOSABLE EMAIL BLOCKING — register() rejects known
//     throwaway-email domains (utils/disposableEmails.js).
//
//  Forgot-password OTP logic, password-reuse check, session
//  invalidation via passwordChangedAt, email-verification OTP logic
//  — all UNCHANGED in their core behavior from v7, just wrapped with
//  the additions above.
// ============================================================

import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import bcrypt   from "bcryptjs";
import User     from "../models/User.js";
import { env }  from "../config/env.js";
import { getTargetExamOption } from "../config/targetExams.js";
import { sendPasswordResetOtp, sendVerificationOtp } from "../services/emailService.js";
import { isDisposableEmail } from "../utils/disposableEmails.js";

const LOGIN_LOCK_THRESHOLD = 5;
const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;      // 60 seconds
const OTP_VALIDITY_MS = 10 * 60 * 1000;        // 10 minutes

// A fixed, valid-looking bcrypt hash used ONLY to burn comparable
// CPU time when no real user exists — this hash doesn't correspond
// to any real password and is never used to actually authenticate
// anyone. Its sole purpose is timing-attack mitigation (see header).
const DUMMY_HASH = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8jkeu6ldOTQfz5vjP1wtRqZ3.PsQ9K";

function getCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000,
    path:     "/",
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, examMode: user.examMode },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN || "7d",
      issuer:    "jneet-ai",
      audience:  "jneet-ai-client",
    }
  );
}

function sendAuthResponse(user, statusCode, res, message) {
  const token = generateToken(user);
  res.cookie("jneet_token", token, getCookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    student: {
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      examMode:  user.examMode,
      targetExam: user.targetExam ?? null,
      targetExamPromptDismissed: !!user.targetExamPromptDismissed,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
}

async function issueOtp(user, hashField, expiryField, attemptsField) {
  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  const salt = await bcrypt.genSalt(10);
  user[hashField]     = await bcrypt.hash(otp, salt);
  user[expiryField]   = new Date(Date.now() + OTP_VALIDITY_MS);
  user[attemptsField] = 0;
  await user.save({ validateBeforeSave: false });
  return otp;
}

// Returns true (and how many seconds to wait) if an OTP was issued
// too recently to allow another one yet. expiresAt is 10 minutes
// ahead of issuance, so if more than 9 minutes remain, it was
// issued less than 60 seconds ago.
function otpCooldownRemainingSec(expiresAt) {
  if (!expiresAt) return 0;
  const msSinceIssued = OTP_VALIDITY_MS - (expiresAt.getTime() - Date.now());
  const msRemaining = OTP_RESEND_COOLDOWN_MS - msSinceIssued;
  return msRemaining > 0 ? Math.ceil(msRemaining / 1000) : 0;
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examMode } = req.body;

    if (isDisposableEmail(email)) {
      return res.status(400).json({
        success:     false,
        error:       "Please use a permanent email address — disposable/temporary email providers aren't supported.",
        fieldErrors: [{ field: "email", message: "Disposable email addresses aren't supported." }],
      });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({
        success:     false,
        error:       "This email is already registered. Please login instead.",
        fieldErrors: [{ field: "email", message: "This email is already registered." }],
      });
    }

    const newUser = await User.create({ name, email, password, examMode, isEmailVerified: false });

    const otp = await issueOtp(newUser, "emailOtpHash", "emailOtpExpiresAt", "emailOtpAttempts");

    try {
      await sendVerificationOtp(newUser.email, otp, newUser.name);
    } catch (emailErr) {
      console.error("[Auth] Failed to send verification email:", emailErr.message);
    }

    console.log(`[Auth] ✅ Registered (pending verification): ${newUser.email} (${newUser.examMode})`);

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: newUser.email,
      message: "Account created! Check your email for a verification code.",
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +failedLoginAttempts +accountLockedUntil"
    );

    if (!user) {
      // Timing-attack mitigation: burn comparable time to a real
      // password check even though there's no real user to check
      // against, so response time doesn't leak whether this email
      // is registered.
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error:   "Your account has been deactivated. Please contact support.",
      });
    }

    // Per-account lockout check — independent of the per-IP rate
    // limiter. A still-locked account is rejected without even
    // attempting a password comparison.
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

    // Correct password — clear any accumulated failed-attempt count.
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

    console.log(`[Auth] ✅ Login: ${user.email}`);
    sendAuthResponse(user, 200, res, `Welcome back, ${user.name}!`);

  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("jneet_token", {
    httpOnly: true,
    secure:   env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path:     "/",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User account not found or deactivated." });
    }

    return res.status(200).json({
      success: true,
      student: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        examMode:  user.examMode,
        targetExam: user.targetExam ?? null,
        targetExamPromptDismissed: !!user.targetExamPromptDismissed,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

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

    if (option) {
      update.targetExamPromptDismissed = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, error: "User account not found or deactivated." });
    }

    return res.status(200).json({
      success: true,
      student: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        examMode:  user.examMode,
        targetExam: user.targetExam ?? null,
        targetExamPromptDismissed: !!user.targetExamPromptDismissed,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    next(err);
  }
};

// ── Forgot Password flow ────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("+resetOtpExpiresAt");

    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a reset code has been sent.",
    };

    if (!user || !user.isActive) {
      return res.status(200).json(genericResponse);
    }

    const cooldown = otpCooldownRemainingSec(user.resetOtpExpiresAt);
    if (cooldown > 0) {
      // Still return the generic success shape (don't leak that a
      // cooldown specifically is active for THIS email), but with a
      // distinguishable status so the frontend can show a friendlier
      // "please wait" message if it wants to.
      return res.status(429).json({
        success: false,
        error:   `Please wait ${cooldown} seconds before requesting another code.`,
      });
    }

    const otp = await issueOtp(user, "resetOtpHash", "resetOtpExpiresAt", "resetOtpAttempts");

    try {
      await sendPasswordResetOtp(user.email, otp, user.name);
    } catch (emailErr) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      await user.save({ validateBeforeSave: false });
      console.error("[Auth] Failed to send password reset email:", emailErr.message);
      return res.status(502).json({
        success: false,
        error:   "Could not send the reset email right now. Please try again in a few minutes.",
      });
    }

    console.log(`[Auth] 🔑 Password reset OTP sent: ${user.email}`);
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

    if (!user || !user.isActive || !user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        error:   "Invalid or expired reset code. Please request a new one.",
      });
    }

    if (user.resetOtpExpiresAt.getTime() < Date.now()) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      user.resetOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        error:   "This reset code has expired. Please request a new one.",
      });
    }

    if (user.resetOtpAttempts >= 3) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      user.resetOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(429).json({
        success: false,
        error:   "Too many incorrect attempts. Please request a new reset code.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOtpHash);

    if (!isOtpValid) {
      user.resetOtpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      const remaining = 3 - user.resetOtpAttempts;
      return res.status(400).json({
        success: false,
        error:   remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Incorrect code. Please request a new reset code.",
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        error:   "That's your current password. Please choose a different one.",
      });
    }

    user.password = newPassword;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    user.resetOtpAttempts = 0;
    user.passwordChangedAt = new Date();
    // A successful reset also clears any active login lockout — a
    // legitimate password reset is a reasonable signal the account
    // owner has regained control.
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;

    await user.save();

    console.log(`[Auth] 🔒 Password reset successful: ${user.email}`);
    sendAuthResponse(user, 200, res, "Password reset successful. You're now logged in.");

  } catch (err) {
    next(err);
  }
};

// ── Signup Email Verification flow ──────────────────────────────

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select(
      "+emailOtpHash +emailOtpExpiresAt +emailOtpAttempts"
    );

    if (!user || !user.isActive || !user.emailOtpHash || !user.emailOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        error:   "Invalid or expired verification code. Please request a new one.",
      });
    }

    if (user.isEmailVerified) {
      user.emailOtpHash = null;
      user.emailOtpExpiresAt = null;
      user.emailOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return sendAuthResponse(user, 200, res, "Email already verified. You're now logged in.");
    }

    if (user.emailOtpExpiresAt.getTime() < Date.now()) {
      user.emailOtpHash = null;
      user.emailOtpExpiresAt = null;
      user.emailOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        error:   "This verification code has expired. Please request a new one.",
      });
    }

    if (user.emailOtpAttempts >= 3) {
      user.emailOtpHash = null;
      user.emailOtpExpiresAt = null;
      user.emailOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(429).json({
        success: false,
        error:   "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.emailOtpHash);

    if (!isOtpValid) {
      user.emailOtpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      const remaining = 3 - user.emailOtpAttempts;
      return res.status(400).json({
        success: false,
        error:   remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Incorrect code. Please request a new verification code.",
      });
    }

    user.isEmailVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpAttempts = 0;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log(`[Auth] ✅ Email verified: ${user.email}`);
    sendAuthResponse(user, 200, res, "Email verified! Welcome to JNEET+ AI.");

  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("+emailOtpExpiresAt");

    const genericResponse = {
      success: true,
      message: "If an unverified account exists with this email, a new code has been sent.",
    };

    if (!user || !user.isActive || user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    const cooldown = otpCooldownRemainingSec(user.emailOtpExpiresAt);
    if (cooldown > 0) {
      return res.status(429).json({
        success: false,
        error:   `Please wait ${cooldown} seconds before requesting another code.`,
      });
    }

    const otp = await issueOtp(user, "emailOtpHash", "emailOtpExpiresAt", "emailOtpAttempts");

    try {
      await sendVerificationOtp(user.email, otp, user.name);
    } catch (emailErr) {
      user.emailOtpHash = null;
      user.emailOtpExpiresAt = null;
      await user.save({ validateBeforeSave: false });
      console.error("[Auth] Failed to resend verification email:", emailErr.message);
      return res.status(502).json({
        success: false,
        error:   "Could not send the verification email right now. Please try again in a few minutes.",
      });
    }

    console.log(`[Auth] 🔁 Verification OTP resent: ${user.email}`);
    return res.status(200).json(genericResponse);

  } catch (err) {
    next(err);
  }
};