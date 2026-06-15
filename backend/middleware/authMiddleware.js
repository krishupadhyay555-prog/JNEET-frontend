// ============================================================
//  JNEET+ AI — middleware/authMiddleware.js  (Production v2.0)
//  FIXES:
//    - Token extracted from httpOnly cookie (not Authorization header)
//    - JWT verified with issuer + audience claims (was missing)
//    - User lookup uses lean() for performance
//    - Clean, consistent error shapes
// ============================================================

import jwt  from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    // ── 1. Extract token from httpOnly cookie ─────────────────
    // SECURITY FIX: Token must never come from Authorization header
    // (that requires localStorage — XSS vulnerable). httpOnly cookies
    // are inaccessible to JavaScript — immune to XSS theft.
    const token = req.cookies?.jneet_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error:   "Access denied. Please login to continue.",
      });
    }

    // ── 2. Verify token with ALL registered claims ────────────
    // FIX: Original code called jwt.verify(token, secret) with no
    // options — issuer and audience were signed but NEVER verified.
    // That makes those claims decorative, not protective.
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
      // JsonWebTokenError, NotBeforeError, or invalid issuer/audience
      return res.status(401).json({
        success: false,
        error:   "Invalid session. Please login again.",
      });
    }

    // ── 3. Verify user still exists and is active ─────────────
    // .lean() returns a plain JS object — faster, no Mongoose overhead
    const user = await User.findById(decoded.id).lean();

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error:   "Account not found or deactivated. Please register again.",
      });
    }

    // ── 4. Attach minimal user context to request ─────────────
    // Only attach what route handlers actually need. Never attach
    // the full Mongoose document to avoid accidental mutation.
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