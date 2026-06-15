// ============================================================
//  JNEET+ AI — config/env.js (FIXED)
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
    .min(10, "JWT_SECRET must be at least 10 characters"), // Thoda relax kar diya length ko

  JWT_EXPIRES_IN: z.string().default("7d"),

  GEMINI_API_KEY: z
    .string({ required_error: "GEMINI_API_KEY is required in .env" })
    .min(1, "GEMINI_API_KEY cannot be empty"),

  FRONTEND_URL: z.string().optional(),

  COOKIE_SECRET: z
    .string({ required_error: "COOKIE_SECRET is required in .env" })
    .min(10, "COOKIE_SECRET must be at least 10 characters"), // Relaxed for dev
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

export const env = parseResult.data;