import { z } from "zod";

export const mistakeAnswerSchema = z.object({
  selectedIndex: z.number().int().min(0).max(3).nullable().optional().default(null),
  textAnswer: z.string().max(200).nullable().optional().default(null),
});

export const pyqExplainSchema = z.object({
  ref: z.string().min(3).max(120).regex(/^[a-z0-9-]+#\d+$/).optional(),
  questionId: z.string().regex(/^[a-f0-9]{24}$/).optional(),
  lang: z.enum(["english", "hinglish"]).optional(),
}).refine((d) => d.ref || d.questionId, { message: "Question is required." });
