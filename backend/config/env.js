// ============================================================
//  JNEET+ AI — config/env.js  (Updated — Brevo SMTP vars added)
//  ADDED: BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER,
//  BREVO_SMTP_PASS, EMAIL_FROM — needed for the Forgot Password
//  OTP email feature (services/emailService.js). Get the SMTP
//  credentials from your Brevo dashboard: Settings → SMTP & API →
//  SMTP tab. EMAIL_FROM is the address emails will appear to come
//  from (e.g. noreply@jneetai.com) — this only works once you've
//  verified jneetai.com as a sender domain in Brevo (adds a couple
//  of DNS TXT records, free, no real inbox needed for this).
//  Following the same fail-fast pattern as every other required
//  env var already in this file — everything else UNCHANGED.
// ============================================================

import { z } from "zod";
import dotenv from "dotenv";

// Ye line sabse important hai, iske bina .env load nahi hogi
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a number")
    .default("5000"),

  MONGO_URI: z
    .string({ required_error: "MONGO_URI is required in .env" })
    .min(1, "MONGO_URI cannot be empty"),

  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required in .env" })
    .min(10, "JWT_SECRET must be at least 10 characters"),

  JWT_EXPIRES_IN: z.string().default("7d"),

  GEMINI_API_KEY: z
    .string({ required_error: "GEMINI_API_KEY is required in .env" })
    .min(1, "GEMINI_API_KEY cannot be empty"),

  FRONTEND_URL: z.string().optional(),

  RE_NEET_ACTIVE: z
    .enum(["true", "false"])
    .default("false"),

  RE_NEET_DATE: z.string().optional(),

  COOKIE_SECRET: z
    .string({ required_error: "COOKIE_SECRET is required in .env" })
    .min(10, "COOKIE_SECRET must be at least 10 characters"),

  ENABLE_AI_CHAT_TITLES: z
    .enum(["true", "false"])
    .default("false"),

  // ── NEW: Brevo SMTP (for Forgot Password OTP emails) ─────────
  BREVO_SMTP_HOST: z
    .string({ required_error: "BREVO_SMTP_HOST is required in .env" })
    .min(1, "BREVO_SMTP_HOST cannot be empty"),

  BREVO_SMTP_PORT: z
    .string()
    .regex(/^\d+$/, "BREVO_SMTP_PORT must be a number")
    .default("587"),

  BREVO_SMTP_USER: z
    .string({ required_error: "BREVO_SMTP_USER is required in .env" })
    .min(1, "BREVO_SMTP_USER cannot be empty"),

  BREVO_SMTP_PASS: z
    .string({ required_error: "BREVO_SMTP_PASS is required in .env" })
    .min(1, "BREVO_SMTP_PASS cannot be empty"),

  EMAIL_FROM: z
    .string({ required_error: "EMAIL_FROM is required in .env" })
    .min(1, "EMAIL_FROM cannot be empty"),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const errors = parseResult.error.flatten().fieldErrors;
  console.error("\n❌ FATAL: Invalid environment configuration.");
  console.error("   Fix the following issues in your .env file:\n");

  Object.entries(errors).forEach(([key, messages]) => {
    messages.forEach((msg) => console.error(`   → ${key}: ${msg}`));
  });

  console.error("\n   Server will not start until these are resolved.\n");
  process.exit(1);
}

export const env = {
  ...parseResult.data,
  RE_NEET_ACTIVE: parseResult.data.RE_NEET_ACTIVE === "true",
  ENABLE_AI_CHAT_TITLES: parseResult.data.ENABLE_AI_CHAT_TITLES === "true",
};