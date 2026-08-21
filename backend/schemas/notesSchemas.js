// ============================================================
//  JNEET+ AI — schemas/notesSchemas.js  (NEW)
//  Same Zod pattern as testSchemas.js — the validate() middleware
//  handles all the field-checking here now, so notesController.js
//  no longer needs its own manual 400-checks (removed in this pass
//  for consistency with the rest of the app).
// ============================================================

import { z } from "zod";

export const createNoteSchema = z.object({
  content: z
    .string({ required_error: "Note content is required" })
    .trim()
    .min(1, "Note content cannot be empty.")
    .max(10000, "Note is too long (max 10,000 characters)."),
  tag: z
    .string()
    .trim()
    .max(40, "Tag is too long (max 40 characters).")
    .optional()
    .default(""),
});

export const updateNoteSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Note content cannot be empty.")
      .max(10000, "Note is too long (max 10,000 characters).")
      .optional(),
    tag: z
      .string()
      .trim()
      .max(40, "Tag is too long (max 40 characters).")
      .optional(),
  })
  .refine((d) => d.content !== undefined || d.tag !== undefined, {
    message: "Nothing to update.",
  });