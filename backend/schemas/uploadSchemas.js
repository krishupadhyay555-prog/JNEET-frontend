// ============================================================
//  JNEET+ AI — schemas/uploadSchemas.js
// ============================================================

import { z } from "zod";

export const uploadImageSchema = z.object({
  imageBase64: z
    .string({ required_error: "Image data is required" })
    .min(1, "Image data is required"),
});