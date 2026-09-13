// ============================================================
//  JNEET+ AI — config/env.js  (v3 — Brevo API key, optional vars)
//  CHANGED (critical fix): the 5 SMTP-based Brevo vars are replaced
//  with just 2: BREVO_API_KEY and EMAIL_FROM — and both are now
//  OPTIONAL (.optional() instead of required). Two real bugs this
//  fixes:
//    1. Render's FREE TIER blocks all outbound SMTP traffic on
//       ports 25/465/587 (a policy change Render made in Sept 2025).
//       Brevo's SMTP relay uses port 587, so it was silently
//       unreachable from Render — this is why forgot-password
//       requests were hanging/failing with "can't reach server".
//       Switching to Brevo's HTTPS REST API (services/emailService.js)
//       avoids this entirely, since port 443 is never blocked.
//    2. Making these vars REQUIRED broke GitHub Actions CI (and any
//       other environment without Brevo configured) — process.exit(1)
//       fired on every test run because CI has no .env file with
//       these values. Making them optional means the app (and CI)
//       can boot fine without them; the forgot-password FEATURE
//       simply returns a clear error if actually invoked without a
//       configured API key, instead of crashing the entire server.
//  Everything else UNCHANGED from the previous version.
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

  // ── Brevo transactional email API (Forgot Password OTP) ───────
  // OPTIONAL on purpose — see file header. If either is missing,
  // the app boots fine everywhere (including CI); only an actual
  // forgot-password request will surface a clear runtime error.
  BREVO_API_KEY: z.string().optional(),
  EMAIL_FROM:    z.string().optional(),
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

// Non-fatal warning (not process.exit) if email isn't configured —
// visible in logs but never crashes the app or CI.
if (!env.BREVO_API_KEY || !env.EMAIL_FROM) {
  console.warn("[env] ⚠️  BREVO_API_KEY / EMAIL_FROM not set — Forgot Password emails will not send until configured.");
}