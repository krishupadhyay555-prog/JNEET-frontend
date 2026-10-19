// ============================================================
//  JNEET+ AI — routes/aiRoutes.js  (v3)
//  SSE streaming route. protect runs BEFORE aiLimiter so the limiter
//  can key by user ID. ADDED: GET /usage.
// ============================================================

import { Router }   from "express";
import { aiLimiter }     from "../limiters/aiLimiter.js";
import { validate }      from "../middleware/validate.js";
import { protect }       from "../middleware/authMiddleware.js";
import { askSchema }     from "../schemas/aiSchemas.js";
import { askAI, pingAI, getUsage, getPolicy } from "../controllers/aiController.js";

const router = Router();

router.post("/ask",   protect, aiLimiter, validate(askSchema), askAI);
router.get( "/usage", protect, getUsage);
router.get( "/policy", protect, getPolicy);
router.get( "/ping",  pingAI); // public liveness check

export default router;
