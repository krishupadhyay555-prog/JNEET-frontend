// ============================================================
//  JNEET+ AI — routes/authRoutes.js  (v5 — OTP limiters + login code)
//  ADDED: POST /login-code and /login-code/verify (passwordless
//  login), and per-IP + per-mailbox limiters on every endpoint that
//  SENDS a code (authLimiter only counts failures, so successful
//  sends were previously unlimited).
// ============================================================

import { Router }  from "express";
import { authLimiter }  from "../limiters/authLimiter.js";
import { otpIpLimiter, otpEmailLimiter } from "../limiters/otpLimiter.js";
import { validate }     from "../middleware/validate.js";
import { requireCaptcha } from "../middleware/captcha.js";
import { protect }      from "../middleware/authMiddleware.js";
import {
  registerSchema,
  loginSchema,
  targetExamSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  loginCodeRequestSchema,
  loginCodeVerifySchema,
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
  requestLoginCode,
  verifyLoginCode,
} from "../controllers/authController.js";

const router = Router();

// Endpoints that send an email: validate -> IP limit -> mailbox limit
const sendsCode = [otpIpLimiter, otpEmailLimiter];

router.post("/register", requireCaptcha, validate(registerSchema), ...sendsCode, authLimiter, register);
router.post("/login",    requireCaptcha, authLimiter, validate(loginSchema), login);

// Passwordless login
router.post("/login-code",        requireCaptcha, validate(loginCodeRequestSchema), ...sendsCode, requestLoginCode);
router.post("/login-code/verify", authLimiter, validate(loginCodeVerifySchema), verifyLoginCode);

// Forgot password
router.post("/forgot-password", requireCaptcha, validate(forgotPasswordSchema), ...sendsCode, forgotPassword);
router.post("/reset-password",  authLimiter, validate(resetPasswordSchema), resetPassword);

// Signup email verification
router.post("/verify-email",        authLimiter, validate(verifyEmailSchema), verifyEmail);
router.post("/resend-verification", requireCaptcha, validate(resendVerificationSchema), ...sendsCode, resendVerification);

// Protected
router.post("/logout", logout);
router.get( "/me",     protect, getMe);
router.patch("/me/target-exam", protect, validate(targetExamSchema), updateTargetExam);

export default router;
