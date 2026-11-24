// ============================================================
//  JNEET+ AI — routes/aiRoutes.js  (v3)
//  SSE streaming route. protect runs BEFORE aiLimiter so the limiter
//  can key by user ID. ADDED: GET /usage.
// ============================================================

import { z } from "zod";
import { requireTier } from "../middleware/requireTier.js";
import { tts } from "../controllers/ttsController.js";
import { Router }   from "express";
import { aiLimiter }     from "../limiters/aiLimiter.js";
import { unlockLimiter } from "../limiters/generalLimiter.js";
import { validate }      from "../middleware/validate.js";
import { protect }       from "../middleware/authMiddleware.js";
import { askSchema }     from "../schemas/aiSchemas.js";
import { askAI, pingAI, getUsage, getPolicy, unlockChat } from "../controllers/aiController.js";

const ttsSchema = z.object({ text: z.string().min(1).max(20000) }).strict();

const router = Router();

router.post("/ask",   protect, aiLimiter, validate(askSchema), askAI);
router.get( "/usage", protect, getUsage);
router.post("/tts",   protect, aiLimiter, requireTier("elite"), validate(ttsSchema), tts);
router.get( "/policy", protect, getPolicy);
router.post("/policy/unlock", protect, unlockLimiter, unlockChat);
router.get( "/ping",  pingAI); // public liveness check

export default router;
