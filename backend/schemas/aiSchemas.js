// ============================================================
//  JNEET+ AI — schemas/aiSchemas.js  (Fixed v2.1)
//  FIX (root cause of "chat never saves" bug):
//    - saveMessageSchema's sessionId was only `.optional()`, which
//      in Zod means "the field can be MISSING (undefined)" — it
//      does NOT mean "the field can be null". The frontend sends
//      `sessionId: null` for a brand-new chat's first message,
//      which Zod was rejecting with a 400 Bad Request. That 400
//      meant EVERY new chat's first exchange silently failed to
//      save — nothing ever reached the database in the first place.
//    - Added `.nullable()` so both `undefined` (key omitted) and
//      explicit `null` are accepted, matching what the frontend
//      actually sends.
// ============================================================

import { z } from "zod";

export const askSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .trim()
    .min(1,    "Prompt cannot be empty")
    .max(5000, "Prompt exceeds the 5000-character limit"),

  sessionId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid sessionId format")
    .nullable()
    .optional(),
});

export const saveMessageSchema = z.object({
  // FIX: was `.optional()` only — now `.nullable().optional()` so
  // an explicit `null` (sent for a brand-new chat) is accepted,
  // not just a missing key.
  sessionId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid sessionId format")
    .nullable()
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