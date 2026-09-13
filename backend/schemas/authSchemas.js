// ============================================================
//  JNEET+ AI — schemas/authSchemas.js  (v4 — Email Verification)
//  ADDED: verifyEmailSchema (email + 6-digit OTP) and
//  resendVerificationSchema (just email) — for the new signup
//  email-verification flow.
//  Everything else — registerSchema, loginSchema, targetExamSchema,
//  forgotPasswordSchema, resetPasswordSchema — UNCHANGED from v3.
// ============================================================

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8,   "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must include at least one letter")
    .regex(/[0-9]/,    "Password must include at least one number"),

  examMode: z.enum(["NEET", "JEE"], {
    required_error:     "Please select your exam (NEET or JEE)",
    invalid_type_error: "examMode must be either NEET or JEE",
  }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const targetExamSchema = z.object({
  targetExam: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional(),

  targetExamPromptDismissed: z
    .boolean()
    .optional(),
});

// ── Forgot Password flow ──────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  otp: z
    .string({ required_error: "OTP is required" })
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8,   "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must include at least one letter")
    .regex(/[0-9]/,    "Password must include at least one number"),
});

// ── NEW: Signup Email Verification flow ────────────────────────

export const verifyEmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  otp: z
    .string({ required_error: "OTP is required" })
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
});