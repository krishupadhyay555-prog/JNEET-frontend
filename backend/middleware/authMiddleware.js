// ============================================================
//  JNEET+ AI — middleware/authMiddleware.js  (v3 — session invalidation)
//  ADDED: after verifying the JWT is structurally valid, we now
//  also check the token's issued-at time (`decoded.iat`, in
//  seconds) against the user's `passwordChangedAt` timestamp. If
//  the password was changed AFTER this token was issued, the token
//  is rejected — this is what makes resetPassword() in
//  authController.js log a user out of every other device the
//  moment they complete a password reset, without needing to
//  change how tokens are generated or store a token blocklist.
//  Everything else — cookie extraction, JWT verification, user
//  lookup — UNCHANGED from v2.0.
// ============================================================

import jwt  from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jneet_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error:   "Access denied. Please login to continue.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET, {
        issuer:   "jneet-ai",
        audience: "jneet-ai-client",
      });
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error:   "Your session has expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        error:   "Invalid session. Please login again.",
      });
    }

    const user = await User.findById(decoded.id).lean();

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error:   "Account not found or deactivated. Please register again.",
      });
    }

    // ── NEW: Session invalidation after password reset ─────────
    // decoded.iat is in seconds (standard JWT claim); passwordChangedAt
    // is a JS Date (milliseconds). Convert iat to ms before comparing.
    // If the password was changed after this specific token was
    // issued, the token is stale — reject it even though its
    // signature and expiry are otherwise still valid.
    if (user.passwordChangedAt) {
      const tokenIssuedAtMs = decoded.iat * 1000;
      const passwordChangedAtMs = new Date(user.passwordChangedAt).getTime();

      if (passwordChangedAtMs > tokenIssuedAtMs) {
        return res.status(401).json({
          success: false,
          error:   "Your password was recently changed. Please login again.",
        });
      }
    }

    req.user = {
      id:       user._id,
      name:     user.name,
      email:    user.email,
      examMode: user.examMode,
    };

    next();

  } catch (err) {
    next(err);
  }
};