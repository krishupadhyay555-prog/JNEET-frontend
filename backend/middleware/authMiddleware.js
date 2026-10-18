// ============================================================
//  JNEET+ AI — middleware/authMiddleware.js  (v4)
//  FIXED: the passwordChangedAt check compared a millisecond
//  timestamp against the JWT `iat`, which only has SECOND
//  precision. A token issued in the same second as a password
//  reset (i.e. the one the reset itself hands back) therefore looked
//  "older than the password change" and the user was logged out
//  immediately after resetting. The comparison now happens at
//  second precision.
//  ADDED: req.user carries plan / persona / aiLocked so controllers
//  don't each re-query the user.
// ============================================================

import jwt  from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { isAiLocked } from "../utils/studentPayload.js";
import { setSessionCookie } from "../utils/authCookie.js";

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

    // Session invalidation after a password change/reset: the token must
    // carry the account's current tokenVersion.
    if ((decoded.tv || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({
        success: false,
        error:   "Your password was recently changed. Please login again.",
      });
    }

    // Rolling session: a student who keeps using the app is never logged out;
    // the cookie is renewed at most once a day.
    if (decoded.iat && Date.now() / 1000 - decoded.iat > 24 * 60 * 60) {
      setSessionCookie(res, user);
    }

    req.user = {
      id:       user._id,
      name:     user.name,
      email:    user.email,
      examMode: user.examMode,
      plan:     user.plan ?? "free",
      persona:  user.persona ?? "mentor",
      aiLocked: isAiLocked(user),
    };

    next();

  } catch (err) {
    next(err);
  }
};
