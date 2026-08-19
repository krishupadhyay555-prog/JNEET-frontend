// ============================================================
//  JNEET+ AI — controllers/authController.js  (v4 — wmsData removed)
//  REMOVED: `wmsData` from getMe() and updateTargetExam()'s
//  response objects — the field no longer exists on User.js.
//  Everything else — register/login/logout logic, cookie config,
//  error handling — is UNCHANGED.
// ============================================================

import jwt   from "jsonwebtoken";
import User  from "../models/User.js";
import { env } from "../config/env.js";
import { getTargetExamOption } from "../config/targetExams.js";

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