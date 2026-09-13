// ============================================================
//  JNEET+ AI — schemas/authSchemas.js  (v3 — Forgot Password schemas)
//  ADDED: forgotPasswordSchema (just needs a valid email) and
//  resetPasswordSchema (email + the 6-digit OTP + a new password,
//  reusing the EXACT same strength rule as registerSchema so users
//  can't set a weaker password during reset than they could during
//  signup).
//  Everything else — registerSchema, loginSchema, targetExamSchema
//  — UNCHANGED from v2.
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

// ── NEW: Forgot Password flow ──────────────────────────────────

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

  // Same strength rule as registerSchema — a reset shouldn't allow
  // a weaker password than signup would have.
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8,   "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must include at least one letter")
    .regex(/[0-9]/,    "Password must include at least one number"),
});