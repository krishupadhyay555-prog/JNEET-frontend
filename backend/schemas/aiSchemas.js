// ============================================================
//  JNEET+ AI — schemas/aiSchemas.js
//  Validation shape for the /api/ai/ask route.
// ============================================================

import { z } from "zod";

export const askSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .trim()
    .min(1,    "Prompt cannot be empty")
    .max(5000, "Prompt exceeds the 5000-character limit"),

  // Optional: client can pass sessionId for context threading
  sessionId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid sessionId format")
    .optional(),
});

export const saveMessageSchema = z.object({
  sessionId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid sessionId format")
    .optional(),

  userMessage: z.object({
    content: z
      .string({ required_error: "User message content is required" })
      .min(1)
      .max(5000),
  }),

  aiMessage: z.object({
    content: z
      .string({ required_error: "AI message content is required" })
      .min(1)
      .max(20000),
  }),
});

export const toggleSavedSchema = z.object({
  sessionId: z
    .string({ required_error: "sessionId is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid sessionId format"),

  messageId: z
    .string({ required_error: "messageId is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid messageId format"),

  saved: z.boolean({ required_error: "saved (boolean) is required" }),
});