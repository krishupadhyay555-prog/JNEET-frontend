// ============================================================
//  JNEET+ AI — routes/authRoutes.js  (v4 — Email Verification)
//  ADDED: POST /verify-email and POST /resend-verification, both
//  public and rate-limited with the same authLimiter as every other
//  auth endpoint.
//  Everything else UNCHANGED from v3.
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
  verifyEmailSchema,
  resendVerificationSchema,
} from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  getMe,
  updateTargetExam,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";

const router = Router();

// Public routes — rate limited + validated
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login",    authLimiter, validate(loginSchema),    login);

// Forgot Password flow
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password",  authLimiter, validate(resetPasswordSchema),  resetPassword);

// Signup Email Verification flow
router.post("/verify-email",        authLimiter, validate(verifyEmailSchema),        verifyEmail);
router.post("/resend-verification", authLimiter, validate(resendVerificationSchema), resendVerification);

// Protected routes
router.post("/logout", logout);
router.get( "/me",     protect, getMe);
router.patch("/me/target-exam", protect, validate(targetExamSchema), updateTargetExam);

export default router;