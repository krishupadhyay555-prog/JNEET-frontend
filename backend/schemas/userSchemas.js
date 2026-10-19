// ============================================================
//  JNEET+ AI — schemas/userSchemas.js  (v2)
//  FIXED: changePasswordSchema accepted 6-character passwords while
//  signup required 8 + a letter + a number. Both now share
//  passwordSchema (schemas/common.js).
//  REMOVED: updateLanguageSchema (the route was deleted long ago).
//  ADDED: dateOfBirthSchema (legacy accounts that signed up before
//  the DOB gate existed), preferencesSchema (AI persona).
// ============================================================

import { z } from "zod";
import { passwordSchema, dobSchema, emailSchema } from "./common.js";

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
    .min(1, "Current password is required")
    .max(128),
  newPassword: passwordSchema,
});

export const deleteAccountSchema = z.object({
  password: z
    .string({ required_error: "Password is required to delete your account" })
    .min(1, "Password is required to delete your account")
    .max(128),
});

export const dateOfBirthSchema = z.object({
  dateOfBirth: dobSchema,
  parentEmail: emailSchema.optional(),
});

export const preferencesSchema = z.object({
  persona: z.enum(["mentor", "fun"], {
    required_error: "Choose a teaching style",
    invalid_type_error: "Invalid teaching style",
  }),
});

export const examModeSchema = z.object({
  examMode: z.enum(["NEET", "JEE"], {
    required_error: "Choose NEET or JEE",
    invalid_type_error: "examMode must be either NEET or JEE",
  }),
});
