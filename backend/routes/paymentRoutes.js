// ============================================================
//  JNEET+ AI — routes/paymentRoutes.js  (mounted at /api/payments)
//  The webhook gets the RAW body (app.js skips the JSON parser for
//  it) because Razorpay signs the exact bytes it sent.
// ============================================================

import express, { Router } from "express";
import { z } from "zod";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { userLimiter } from "../limiters/generalLimiter.js";
import { consentLimiter } from "../limiters/otpLimiter.js";
import {
  getPlans, getMine, createOrder, verify, parentLink,
  describeParent, parentOrder, parentVerify, webhook,
} from "../controllers/paymentController.js";

const router = Router();

const planIdSchema = z.enum(["pro_1m", "pro_4m", "elite_1m", "elite_4m"], {
  errorMap: () => ({ message: "Please choose a plan" }),
});
const orderSchema = z.object({ planId: planIdSchema }).strict();
const parentOrderSchema = z.object({
  planId: planIdSchema,
  isParent: z.literal(true, { errorMap: () => ({ message: "Please confirm you are the parent or guardian (18+)" }) }),
}).strict();
const verifySchema = z.object({
  orderId:   z.string().regex(/^order_[A-Za-z0-9]{6,40}$/, "Invalid order"),
  paymentId: z.string().regex(/^pay_[A-Za-z0-9]{6,40}$/, "Invalid payment"),
  signature: z.string().regex(/^[0-9a-fA-F]{64}$/, "Invalid signature"),
}).strict();

// Public
router.get( "/plans", getPlans);
router.post("/webhook", express.raw({ type: "*/*", limit: "100kb" }), webhook);
router.get( "/parent/:token",        consentLimiter, describeParent);
router.post("/parent/:token/order",  consentLimiter, validate(parentOrderSchema), parentOrder);
router.post("/parent/:token/verify", consentLimiter, validate(verifySchema), parentVerify);

// Student
router.get( "/me",          protect, userLimiter, getMine);
router.post("/order",       protect, userLimiter, validate(orderSchema), createOrder);
router.post("/verify",      protect, userLimiter, validate(verifySchema), verify);
router.post("/parent-link", protect, userLimiter, parentLink);

export default router;
