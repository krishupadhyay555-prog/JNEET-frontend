// ============================================================
//  JNEET+ AI — config/env.js  (v4 — OpenAI router + email checks)
//  CHANGED:
//    - GEMINI_API_KEY is no longer required (the app moved to the
//      OpenAI Responses API). Kept optional so old .env files and CI
//      keep booting.
//    - OPENAI_API_KEY and the AI_* router variables are OPTIONAL at
//      boot (CI/dev must start without them). If the key is missing
//      the AI endpoint answers with a clear "AI not configured"
//      message instead of crashing the whole server.
//    - In production, missing Brevo settings are logged as an ERROR
//      (signup OTP emails cannot be delivered without them).
//    - APP_URL helper: first FRONTEND_URL entry, used to build links
//      in emails (parent-consent approval link).
//  Everything else is UNCHANGED.
// ============================================================

import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const intString = (def) =>
  z.string().regex(/^\d+$/, "must be a whole number").default(String(def));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").default("5000"),

  MONGO_URI: z
    .string({ required_error: "MONGO_URI is required in .env" })
    .min(1, "MONGO_URI cannot be empty"),

  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required in .env" })
    .min(10, "JWT_SECRET must be at least 10 characters"),

  JWT_EXPIRES_IN: z.string().optional(), // legacy: ignored — see SESSION_DAYS
  // How long a login lasts (rolling: renewed while the student keeps using the app)
  SESSION_DAYS: intString(15),

  // Legacy — no longer used by the app.
  GEMINI_API_KEY: z.string().optional(),

  FRONTEND_URL: z.string().optional(),

  RE_NEET_ACTIVE: z.enum(["true", "false"]).default("false"),
  RE_NEET_DATE: z.string().optional(),

  COOKIE_SECRET: z
    .string({ required_error: "COOKIE_SECRET is required in .env" })
    .min(10, "COOKIE_SECRET must be at least 10 characters"),

  // "none" in production unless you serve the API from a subdomain of
  // your site (e.g. api.jneetai.com) — then set COOKIE_SAMESITE=lax.
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).optional(),
  COOKIE_DOMAIN:   z.string().optional(),

  ENABLE_AI_CHAT_TITLES: z.enum(["true", "false"]).default("false"),

  // ── Transactional email (Brevo HTTPS API) ─────────────────────
  BREVO_API_KEY: z.string().optional(),
  EMAIL_FROM:    z.string().optional(),
  EMAIL_FROM_NAME: z.string().default("JNEET+ AI"),

  // ── Bot protection (Cloudflare Turnstile). Unset = captcha is off. ──
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // ── AI provider (OpenAI Responses API) ────────────────────────
  OPENAI_API_KEY:  z.string().optional(),
  OPENAI_BASE_URL: z.string().default("https://api.openai.com/v1"),

  // Model + reasoning effort per plan. Swap models with env vars only.
  AI_MODEL_FREE:      z.string().default("gpt-6-luna"),
  AI_MODEL_PRO:       z.string().default("gpt-6-luna"),
  AI_MODEL_ELITE:     z.string().default("gpt-6-luna"),
  AI_MODEL_DEEP:      z.string().default("gpt-6.1-sol"),
  AI_MODEL_FALLBACK:  z.string().default("gpt-6.1-sol"),
  AI_MODEL_TITLE:     z.string().default("gpt-6-luna"),
  AI_EFFORT_FREE:     z.string().default("low"),
  AI_EFFORT_PRO:      z.string().default("medium"),
  AI_EFFORT_ELITE:    z.string().default("medium"),
  AI_MAX_OUTPUT_TOKENS: intString(4096),
  AI_MODERATION_PROVIDER: z.enum(["true", "false"]).default("true"),

  // Daily doubts per plan (IST day) and deep-solves per month
  AI_DAILY_FREE:   intString(5),
  AI_DAILY_PRO:    intString(30),
  AI_DAILY_ELITE:  intString(50),
  AI_DEEP_MONTHLY_ELITE: intString(10),

  // Used only to convert USD token cost into rupees in the usage ledger
  AI_USD_INR: z.string().default("96"),

  // Guard: the AI is locked for under-18 users until a parent approves.
  // Set to "false" only for local testing.
  REQUIRE_PARENT_CONSENT_FOR_AI: z.enum(["true", "false"]).default("true"),
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

const data = parseResult.data;
const toInt = (v) => Number.parseInt(v, 10);

export const env = {
  ...data,
  RE_NEET_ACTIVE: data.RE_NEET_ACTIVE === "true",
  ENABLE_AI_CHAT_TITLES: data.ENABLE_AI_CHAT_TITLES === "true",
  REQUIRE_PARENT_CONSENT_FOR_AI: data.REQUIRE_PARENT_CONSENT_FOR_AI === "true",
  AI_MAX_OUTPUT_TOKENS: toInt(data.AI_MAX_OUTPUT_TOKENS),
  AI_MODERATION_PROVIDER: data.AI_MODERATION_PROVIDER === "true",
  SESSION_DAYS: toInt(data.SESSION_DAYS) || 15,
  AI_DAILY: {
    free:  toInt(data.AI_DAILY_FREE),
    pro:   toInt(data.AI_DAILY_PRO),
    elite: toInt(data.AI_DAILY_ELITE),
  },
  AI_DEEP_MONTHLY_ELITE: toInt(data.AI_DEEP_MONTHLY_ELITE),
  AI_USD_INR: Number(data.AI_USD_INR) || 96,
  // First FRONTEND_URL entry, no trailing slash — used for email links.
  APP_URL: (data.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, ""),
};

if (env.NODE_ENV !== "test") {
  if (!env.BREVO_API_KEY || !env.EMAIL_FROM) {
    const level = env.NODE_ENV === "production" ? "error" : "warn";
    console[level](
      "[env] BREVO_API_KEY / EMAIL_FROM not set — signup, forgot-password and login-code emails will NOT be delivered until configured."
    );
  }
  if (!env.OPENAI_API_KEY) {
    const level = env.NODE_ENV === "production" ? "error" : "warn";
    console[level]("[env] OPENAI_API_KEY not set — the AI mentor will answer 'not configured' until it is set.");
  }
}
