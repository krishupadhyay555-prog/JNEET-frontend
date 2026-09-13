// ============================================================
//  JNEET+ AI — controllers/authController.js  (v6 — password reuse check)
//  ADDED: resetPassword now rejects setting the new password to the
//  same value as the current one (bcrypt.compare against the
//  existing hash before overwriting) — catches accidental
//  no-op resets and mildly improves password hygiene.
//  Everything else — forgotPassword, OTP verification, attempt
//  limiting, session invalidation via passwordChangedAt — UNCHANGED
//  from v5.
// ============================================================

import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import bcrypt   from "bcryptjs";
import User     from "../models/User.js";
import { env }  from "../config/env.js";
import { getTargetExamOption } from "../config/targetExams.js";
import { sendPasswordResetOtp } from "../services/emailService.js";

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

    const newUser = await User.create({ name, email, password, examMode });

    console.log(`[Auth] ✅ Registered: ${newUser.email} (${newUser.examMode})`);
    sendAuthResponse(newUser, 201, res, "Account created! Welcome to JNEET+ AI.");

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

// ── NEW: Forgot Password flow ──────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Deliberately generic response whether or not the user exists,
    // to prevent email enumeration. We only actually send an email
    // and touch the database if the user is real.
    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a reset code has been sent.",
    };

    if (!user || !user.isActive) {
      return res.status(200).json(genericResponse);
    }

    // Generate a cryptographically random 6-digit OTP (000000-999999,
    // zero-padded). crypto.randomInt is used instead of Math.random,
    // which is not suitable for anything security-sensitive.
    const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    const salt = await bcrypt.genSalt(10);
    user.resetOtpHash      = await bcrypt.hash(otp, salt);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.resetOtpAttempts  = 0;
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetOtp(user.email, otp, user.name);
    } catch (emailErr) {
      // If the email genuinely fails to send, don't leave a dangling
      // OTP the user can never receive — clear it and surface a real
      // error instead of the generic success message.
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

    // Prevent "resetting" to the exact same password the account
    // already has — this usually means the user didn't actually
    // mean to change anything, or forgot they already knew it.
    // bcrypt.compare against the CURRENT hash (selected above via
    // +password) catches this before we overwrite anything.
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        error:   "That's your current password. Please choose a different one.",
      });
    }

    // OTP correct — set the new password and clear all reset fields.
    // Setting `password` here triggers the pre-save bcrypt-hash hook
    // on the User model automatically, same as register/login.
    user.password = newPassword;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    user.resetOtpAttempts = 0;

    // This is the session-invalidation step: any JWT issued before
    // this moment will be rejected by authMiddleware.js on its next
    // use, logging the user out of every other device/tab.
    user.passwordChangedAt = new Date();

    await user.save();

    console.log(`[Auth] 🔒 Password reset successful: ${user.email}`);

    // Log the user in immediately on the device that just completed
    // the reset, so they don't have to separately log in again here.
    sendAuthResponse(user, 200, res, "Password reset successful. You're now logged in.");

  } catch (err) {
    next(err);
  }
};