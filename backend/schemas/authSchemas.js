// ============================================================
//  JNEET+ AI — schemas/authSchemas.js  (v2 — stronger password rule)
//  CHANGED: password rule only.
//    - min length 6 → 8
//    - added: must contain at least one letter AND one number
//  Email validation UNCHANGED — z.string().email() already
//  correctly rejects malformed input (missing @, no domain, etc).
//  What it can't do — and nothing purely format-based can — is
//  confirm the email address actually belongs to a real, reachable
//  inbox. That needs an email-verification-link flow (separate
//  feature: needs a User model change + an email-sending service,
//  neither of which exist yet — next step, not guessed here).
//  Everything else in this file is UNCHANGED.
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

  // Login intentionally does NOT re-check the strength rule here —
  // an existing user's password was valid under whatever rule was
  // active when they registered. Login only confirms "non-empty";
  // the actual correctness check is the bcrypt compare in
  // authController.js, not this schema.
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