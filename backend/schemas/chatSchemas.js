// ============================================================
//  JNEET+ AI — schemas/chatSchemas.js  (NEW)
// ============================================================

import { z } from "zod";

export const renameSessionSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty.")
    .max(100, "Title is too long (max 100 characters)."),
});

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format");

// Remove one message and everything after it (used by Edit and Regenerate)
export const truncateSchema = z.object({
  fromMessageId: objectId,
});

export const feedbackSchema = z.object({
  sessionId: objectId,
  messageId: objectId,
  value: z.enum(["up", "down"]).nullable(),
});
