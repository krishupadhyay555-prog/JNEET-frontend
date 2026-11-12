// ============================================================
//  JNEET+ AI — schemas/testSchemas.js  (v2 — answerQuestionSchema added)
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
    // Fill-in-the-blank questions added to a Revision (0 = none).
    blanks:   z.number().int().min(0).max(20).default(0),
  })
  .refine((d) => d.easy + d.moderate + d.tough + d.blanks > 0, {
    message: "Select at least one question.",
  });

export const submitTestSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId:    z.string().min(1).max(64),
        // Fill-in-the-blank answers are recorded by /answer on the server;
        // whatever arrives here for them is ignored.
        selectedIndex: z.number().int().min(0).max(3).nullable().optional().default(null),
        textAnswer:    z.string().max(200).nullable().optional(),
      })
    )
    .min(1, "No answers submitted.")
    .max(300, "Too many answers."),
});

// Single-question instant answer (revision mode only).
// MCQ: selectedIndex (null = skipped). Fill-in-the-blank: textAnswer
// (empty / null = skipped).
export const answerQuestionSchema = z.object({
  questionId:    z.string({ required_error: "Question ID is required" }).min(1),
  selectedIndex: z.number().int().min(0).max(3).nullable().optional().default(null),
  textAnswer:    z.string().max(200, "Answer is too long.").nullable().optional(),
});