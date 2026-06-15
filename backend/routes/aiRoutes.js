// ============================================================
//  JNEET+ AI — routes/aiRoutes.js  (Production v2.0)
//  SSE streaming route. Protect + aiLimiter applied inline.
// ============================================================

import { Router }   from "express";
import { aiLimiter }     from "../limiters/aiLimiter.js";
import { validate }      from "../middleware/validate.js";
import { protect }       from "../middleware/authMiddleware.js";
import { askSchema }     from "../schemas/aiSchemas.js";
import { askAI, pingAI } from "../controllers/aiController.js";

const router = Router();

// All AI routes require authentication
// Note: protect runs BEFORE aiLimiter so the limiter can key by user ID
router.post("/ask",  protect, aiLimiter, validate(askSchema), askAI);
router.get( "/ping", pingAI); // Public health check — no auth needed

export default router;