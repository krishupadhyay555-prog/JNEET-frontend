// ============================================================
//  JNEET+ AI — routes/authRoutes.js  (v3 — Forgot Password routes)
//  ADDED: POST /forgot-password and POST /reset-password, both
//  public (no `protect` needed — the whole point is the user is
//  logged out) and both rate-limited with the SAME authLimiter
//  already used for /register and /login, since OTP endpoints are
//  exactly the kind of thing that needs brute-force protection.
//  Everything else UNCHANGED from v2.0.
// ============================================================

import { Router }  from "express";
import { authLimiter }    from "../limiters/authLimiter.js";
import { validate }       from "../middleware/validate.js";
import { protect }        from "../middleware/authMiddleware.js";
import {
  registerSchema,
  loginSchema,
  targetExamSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  getMe,
  updateTargetExam,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

// Public routes — rate limited + validated
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login",    authLimiter, validate(loginSchema),    login);

// Forgot Password flow — also public (user is logged out) and
// rate-limited for the same brute-force-protection reasons as
// register/login.
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password",  authLimiter, validate(resetPasswordSchema),  resetPassword);

// Protected routes
router.post("/logout", logout);
router.get( "/me",     protect, getMe);
router.patch("/me/target-exam", protect, validate(targetExamSchema), updateTargetExam);

export default router;