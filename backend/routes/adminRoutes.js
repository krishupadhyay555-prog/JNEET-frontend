// ============================================================
//  JNEET+ AI — routes/adminRoutes.js  (mounted at /api/admin)
//  Founder-only. protect + requireAdmin are applied in app.js, so a
//  non-admin (or a logged-out visitor) only ever sees 401/404.
//    GET /api/admin/stats   live dashboard numbers (read-only)
// ============================================================

import { Router } from "express";
import { buildAdminStats } from "../services/adminStats.js";

const router = Router();

router.get("/stats", async (req, res, next) => {
  try {
    return res.json({ success: true, stats: await buildAdminStats() });
  } catch (err) { return next(err); }
});

export default router;
