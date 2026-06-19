// ============================================================
//  JNEET+ AI — schemas/authSchemas.js
//  Single source of truth for auth validation shapes.
//  Used by the validate() middleware — never inline in controllers.
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
    .min(6,   "Password must be at least 6 characters")
    .max(128, "Password is too long"),

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
