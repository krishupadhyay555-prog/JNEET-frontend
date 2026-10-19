// ============================================================
//  JNEET+ AI — schemas/common.js
//  Shared Zod building blocks so every endpoint enforces the SAME
//  rules (the old changePassword schema allowed 6-char passwords
//  while signup required 8 + a letter + a number).
// ============================================================

import { z } from "zod";
import { parseDob, calcAge, MIN_AGE } from "../utils/age.js";

// Short list of passwords that are technically "8 chars, letter +
// number" but are guessed first in every attack.
const COMMON_PASSWORDS = new Set([
  "password1", "password12", "password123", "password1234", "passw0rd",
  "qwerty123", "qwerty1234", "qwertyuiop1", "abc12345", "abcd1234",
  "iloveyou1", "welcome123", "admin1234", "letmein123", "monkey123",
  "dragon123", "football1", "cricket123", "india1234", "india@123",
  "neet2027", "neet2026", "jee2027", "jee2026", "neet12345", "jee12345",
  "12345678a", "a12345678", "1234567a", "123456789a", "test1234", "test12345",
]);

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Please provide a valid email address")
  .max(254, "Email is too long");

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .refine((p) => !COMMON_PASSWORDS.has(p.toLowerCase()), {
    message: "That password is too common. Please choose a less guessable one.",
  });

export const otpSchema = z
  .string({ required_error: "OTP is required" })
  .trim()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only numbers");

export const dobSchema = z
  .string({ required_error: "Date of birth is required" })
  .trim()
  .refine((v) => parseDob(v) !== null, {
    message: "Enter a valid date of birth",
  })
  .refine((v) => {
    const age = calcAge(v);
    return age !== null && age >= MIN_AGE;
  }, {
    message: `JNEET+ AI is for students aged ${MIN_AGE} and above`,
  });

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");
