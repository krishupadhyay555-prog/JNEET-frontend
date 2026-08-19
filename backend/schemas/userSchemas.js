// ============================================================
//  JNEET+ AI — schemas/userSchemas.js
// ============================================================

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),

  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters")
    .max(128, "New password is too long"),
});

export const updateLanguageSchema = z.object({
  language: z.enum(["en", "hi"], {
    required_error: "Language is required",
  }),
});

export const deleteAccountSchema = z.object({
  password: z
    .string({ required_error: "Password is required to delete your account" })
    .min(1, "Password is required to delete your account"),
});