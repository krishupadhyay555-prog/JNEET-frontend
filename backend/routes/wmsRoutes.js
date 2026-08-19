// ============================================================
//  JNEET+ AI — routes/wmsRoutes.js  (v3 — auto-calculated, read-only)
//  REPLACED entirely — was POST/PATCH/DELETE for manual entries,
//  now a single GET. Nothing to create/update/delete anymore —
//  this is a live aggregation over TestAttempt data.
// ============================================================

import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSummary } from "../controllers/wmsController.js";

const router = Router();

router.use(protect);

router.get("/summary", getSummary);

export default router;