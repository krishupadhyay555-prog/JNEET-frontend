// ============================================================
//  JNEET+ AI — schemas/testSchemas.js
// ============================================================

import { z } from "zod";

export const startTestSchema = z
  .object({
    subject: z.enum(["Physics", "Chemistry", "Biology", "Mathematics"], {
      required_error: "Subject is required",
    }),
    chapter: z
      .string({ required_error: "Chapter is required" })
      .trim()
      .min(1, "Chapter is required"),
    easy:     z.number().int().min(0).max(50).default(0),
    moderate: z.number().int().min(0).max(50).default(0),
    tough:    z.number().int().min(0).max(50).default(0),
  })
  .refine((d) => d.easy + d.moderate + d.tough > 0, {
    message: "Select at least one question.",
  });

export const submitTestSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId:    z.string().min(1),
        selectedIndex: z.number().int().min(0).max(3).nullable(),
      })
    )
    .min(1, "No answers submitted."),
});