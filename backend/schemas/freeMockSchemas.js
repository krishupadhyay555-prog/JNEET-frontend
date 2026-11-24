import { z } from "zod";

const tag = z.string().trim().max(60).regex(/^[\w.\-+ ]*$/).optional().catch(undefined);
export const sourceSchema = z.object({
  src: tag, utm_source: tag, utm_medium: tag, utm_campaign: tag, utm_content: tag, utm_term: tag,
}).optional().catch(undefined);

export const freeMockStartSchema = z.object({
  exam: z.enum(["JEE", "NEET"]),
  captchaToken: z.string().max(4096).optional(),
  source: sourceSchema,
});

export const freeMockSubmitSchema = z.object({
  answers: z.array(z.object({
    i: z.number().int().min(0).max(200),
    selectedIndex: z.number().int().min(0).max(9).nullable().optional(),
    textAnswer: z.string().max(20).nullable().optional(),
    timeSec: z.number().min(0).max(36000).optional(),
  })).max(200),
});
