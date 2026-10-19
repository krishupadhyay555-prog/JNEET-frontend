// ============================================================
//  JNEET+ AI — schemas/authSchemas.js  (v5 — DOB, consent, login code)
//  CHANGED:
//    - registerSchema: + dateOfBirth (YYYY-MM-DD, 13+), optional
//      parentEmail (the controller requires it for under-18s),
//      acceptTerms must be literally true.
//    - Password / OTP / email rules now come from schemas/common.js
//      so every endpoint enforces the same policy.
//    - New: loginCodeRequestSchema / loginCodeVerifySchema
//      (passwordless "email me a code" login).
//  loginSchema stays permissive on the password (any non-empty
//  string) on purpose — the policy applies when SETTING a password,
//  never when checking one.
// ============================================================

import { z } from "zod";
import { emailSchema, passwordSchema, otpSchema, dobSchema } from "./common.js";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: emailSchema,
  password: passwordSchema,

  examMode: z.enum(["NEET", "JEE"], {
    required_error:     "Please select your exam (NEET or JEE)",
    invalid_type_error: "examMode must be either NEET or JEE",
  }),

  dateOfBirth: dobSchema,

  parentEmail: emailSchema.optional().or(z.literal("").transform(() => undefined)),

  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Please accept the Terms and Privacy Policy to continue" }),
  }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const targetExamSchema = z.object({
  targetExam: z.string().trim().min(1).nullable().optional(),
  targetExamPromptDismissed: z.boolean().optional(),
});

// ── Forgot Password flow ──────────────────────────────────────
export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
});

// ── Signup email verification ─────────────────────────────────
export const verifyEmailSchema = z.object({ email: emailSchema, otp: otpSchema });
export const resendVerificationSchema = z.object({ email: emailSchema });

// ── Passwordless login ("email me a code") ────────────────────
export const loginCodeRequestSchema = z.object({ email: emailSchema });
export const loginCodeVerifySchema = z.object({ email: emailSchema, otp: otpSchema });
