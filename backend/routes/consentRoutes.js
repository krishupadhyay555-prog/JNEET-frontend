// ============================================================
//  JNEET+ AI — routes/consentRoutes.js
//  Mounted at /api/consent. The "revoke" routes are declared BEFORE
//  the generic ":token" routes so "revoke" is never read as a token.
// ============================================================

import { Router } from "express";
import { z } from "zod";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { consentLimiter, otpIpLimiter } from "../limiters/otpLimiter.js";
import { emailSchema } from "../schemas/common.js";
import {
  getApproveLink, approve, getRevokeLink, revoke,
  getStatus, resendToParent, updateParentEmail,
  getUnlockLink, approveUnlock,
} from "../controllers/consentController.js";

const router = Router();

const approveSchema = z.object({
  isAdult: z.literal(true, { errorMap: () => ({ message: "Please confirm you are a parent or legal guardian aged 18 or above" }) }),
  agree:   z.literal(true, { errorMap: () => ({ message: "Please confirm your approval" }) }),
});
const revokeSchema = z.object({
  confirm: z.literal(true, { errorMap: () => ({ message: "Please confirm" }) }),
});
const parentEmailSchema = z.object({ parentEmail: emailSchema });
const unlockSchema = z.object({
  isAdult: z.literal(true, { errorMap: () => ({ message: "Please confirm you are a parent or legal guardian aged 18 or above" }) }),
  agree:   z.literal(true, { errorMap: () => ({ message: "Please confirm you want to unlock the AI chat" }) }),
});

// Public (parent)
router.get( "/parent/revoke/:token", consentLimiter, getRevokeLink);
router.post("/parent/revoke/:token", consentLimiter, validate(revokeSchema), revoke);
router.get( "/parent/:token",         consentLimiter, getApproveLink);
router.post("/parent/:token/approve", consentLimiter, validate(approveSchema), approve);
router.get( "/unlock/:token",         consentLimiter, getUnlockLink);
router.post("/unlock/:token",         consentLimiter, validate(unlockSchema), approveUnlock);

// Student
router.get(  "/status",       protect, getStatus);
router.post( "/resend",       protect, otpIpLimiter, resendToParent);
router.patch("/parent-email", protect, otpIpLimiter, validate(parentEmailSchema), updateParentEmail);

export default router;
