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