// ============================================================
//  JNEET+ AI — controllers/authController.js  (Production v2.0)
//  FIXES:
//    - JWT now sent as httpOnly cookie (not in response body)
//    - Added logout() — clears the httpOnly cookie server-side
//    - Removed inline Zod schemas (moved to schemas/authSchemas.js)
//    - wmsData no longer sent on every auth response (perf fix)
//    - Consistent error shape throughout
//    - issuer + audience set on token (validated in authMiddleware)
// ============================================================

import jwt   from "jsonwebtoken";
import User  from "../models/User.js";
import { env } from "../config/env.js";

// ── Cookie Configuration ──────────────────────────────────────
// Centralised here so register and login always use identical settings.
function getCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,   // JavaScript cannot access this cookie — XSS immune
    secure:   isProd, // HTTPS only in production
    sameSite: isProd ? "strict" : "lax",  // CSRF protection
    maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days in milliseconds
    path:     "/",
  };
}

// ── Helper: Generate JWT ──────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    {
      id:       user._id,
      email:    user.email,
      examMode: user.examMode,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN || "7d",
      issuer:    "jneet-ai",           // Verified in authMiddleware
      audience:  "jneet-ai-client",   // Verified in authMiddleware
    }
  );
}

// ── Helper: Set cookie and send auth response ─────────────────
// NOTE: wmsData intentionally excluded from login/register response.
// The frontend fetches it via /api/auth/me after login.
// This keeps the auth response fast and small.
function sendAuthResponse(user, statusCode, res, message) {
  const token = generateToken(user);

  // Set the token in a secure httpOnly cookie
  res.cookie("jneet_token", token, getCookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    student: {
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      examMode:  user.examMode,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
}

// ── REGISTER — POST /api/auth/register ───────────────────────
// Note: req.body is already validated and sanitized by the
// validate(registerSchema) middleware — no re-validation needed here.
export const register = async (req, res, next) => {
  try {
    const { name, email, password, examMode } = req.body;

    // Duplicate email check — give a field-specific error
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({
        success:     false,
        error:       "This email is already registered. Please login instead.",
        fieldErrors: [{ field: "email", message: "This email is already registered." }],
      });
    }

    // Create user — password is hashed by the pre('save') hook in User.js
    const newUser = await User.create({ name, email, password, examMode });

    console.log(`[Auth] ✅ Registered: ${newUser.email} (${newUser.examMode})`);
    sendAuthResponse(newUser, 201, res, "Account created! Welcome to JNEET+ AI.");

  } catch (err) {
    // Mongoose unique index violation (race condition safety net)
    if (err.code === 11000) {
      return res.status(409).json({
        success:     false,
        error:       "This email is already registered.",
        fieldErrors: [{ field: "email", message: "This email is already registered." }],
      });
    }
    // Mongoose schema validation failure (should be caught by Zod first, but belt-and-suspenders)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(". ") });
    }
    next(err);
  }
};

// ── LOGIN — POST /api/auth/login ─────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field (normally excluded by select: false)
    const user = await User.findOne({ email }).select("+password");

    // SECURITY: Use a single generic message for both
    // "user not found" AND "wrong password" — prevents user enumeration.
    if (!user) {
      return res.status(401).json({
        success: false,
        error:   "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error:   "Your account has been deactivated. Please contact support.",
      });
    }

    // comparePassword() is defined on the model instance (fixed in User.js)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error:   "Invalid email or password.",
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log(`[Auth] ✅ Login: ${user.email}`);
    sendAuthResponse(user, 200, res, `Welcome back, ${user.name}!`);

  } catch (err) {
    next(err);
  }
};

// ── LOGOUT — POST /api/auth/logout ───────────────────────────
// With httpOnly cookies, logout MUST be server-side.
// The client cannot clear an httpOnly cookie via JavaScript.
export const logout = (req, res) => {
  res.clearCookie("jneet_token", {
    httpOnly: true,
    secure:   env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path:     "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// ── GET ME — GET /api/auth/me ────────────────────────────────
// Returns full profile including wmsData — the authoritative
// source for the student's profile after login.
export const getMe = async (req, res, next) => {
  try {
    // req.user.id is set and guaranteed valid by authMiddleware
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error:   "User account not found or deactivated.",
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        examMode:  user.examMode,
        wmsData:   user.wmsData,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    next(err);
  }
};