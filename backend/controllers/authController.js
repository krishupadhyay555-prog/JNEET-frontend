// ============================================================
//  JNEET+ AI — controllers/authController.js  (v7 — Email Verification)
//  ADDED: register() no longer logs the user in immediately. It
//  creates the account (isEmailVerified: false), sends a
//  verification OTP, and returns a "check your email" response
//  instead of a cookie. Two new endpoints:
//    - verifyEmail(email, otp): same OTP-checking pattern as
//      resetPassword (hash compare, 10-min expiry, 3-attempt cap).
//      On success, sets isEmailVerified true and THEN logs the user
//      in (this is the only place a fresh signup gets its cookie).
//    - resendVerification(email): generic-response pattern (never
//      reveals whether an email exists or is already verified) that
//      issues a fresh OTP if the account exists and isn't verified
//      yet.
//  login() now also blocks unverified accounts with a 403 and a
//  `requiresVerification: true` flag so the frontend can route the
//  user back to the verification step instead of a generic error.
//  Everything else — logout/getMe/updateTargetExam, forgotPassword/
//  resetPassword (including password-reuse check and session
//  invalidation) — UNCHANGED from v6.
// ============================================================

import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import bcrypt   from "bcryptjs";
import User     from "../models/User.js";
import { env }  from "../config/env.js";
import { getTargetExamOption } from "../config/targetExams.js";
import { sendPasswordResetOtp, sendVerificationOtp } from "../services/emailService.js";

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

// Generates a 6-digit OTP, hashes it, and saves it onto whichever
// pair of fields is passed in (reset* or email*) — shared by
// forgotPassword and register/resendVerification so the exact same
// crypto/hash/expiry logic isn't duplicated three times.
async function issueOtp(user, hashField, expiryField, attemptsField) {
  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  const salt = await bcrypt.genSalt(10);
  user[hashField]     = await bcrypt.hash(otp, salt);
  user[expiryField]   = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user[attemptsField] = 0;
  await user.save({ validateBeforeSave: false });
  return otp;
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examMode } = req.body;

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
      // The account still exists even if this specific email attempt
      // failed — the user can use "resend code" on the verification
      // screen, which will try again. We don't roll back account
      // creation here; failing to send once shouldn't force them to
      // re-fill the entire signup form.
      console.error("[Auth] Failed to send verification email:", emailErr.message);
    }

    console.log(`[Auth] ✅ Registered (pending verification): ${newUser.email} (${newUser.examMode})`);

    // Deliberately NOT calling sendAuthResponse here — no cookie is
    // set until the email is verified. The frontend uses this
    // response to move to the "enter your code" step.
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

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error:   "Your account has been deactivated. Please contact support.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    // Block login until the signup verification OTP has been
    // confirmed. requiresVerification lets the frontend route the
    // user straight back to the "enter your code" screen instead of
    // showing a generic error.
    if (!user.isEmailVerified) {
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

    const user = await User.findOne({ email });

    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a reset code has been sent.",
    };

    if (!user || !user.isActive) {
      return res.status(200).json(genericResponse);
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

    await user.save();

    console.log(`[Auth] 🔒 Password reset successful: ${user.email}`);
    sendAuthResponse(user, 200, res, "Password reset successful. You're now logged in.");

  } catch (err) {
    next(err);
  }
};

// ── NEW: Signup Email Verification flow ─────────────────────────

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
      // Already verified (e.g. user double-submitted) — just log
      // them in cleanly instead of erroring.
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

    // Correct OTP — activate the account and clear all OTP fields.
    user.isEmailVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpAttempts = 0;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log(`[Auth] ✅ Email verified: ${user.email}`);

    // This is the moment a freshly registered user actually gets
    // logged in for the first time.
    sendAuthResponse(user, 200, res, "Email verified! Welcome to JNEET+ AI.");

  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Same generic-response pattern as forgotPassword — never reveal
    // whether the email exists or is already verified.
    const genericResponse = {
      success: true,
      message: "If an unverified account exists with this email, a new code has been sent.",
    };

    if (!user || !user.isActive || user.isEmailVerified) {
      return res.status(200).json(genericResponse);
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