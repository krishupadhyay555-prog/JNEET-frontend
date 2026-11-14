// ============================================================
//  JNEET+ AI — routes/adminRoutes.js  (mounted at /api/admin)
//  Founder-only. protect + requireAdmin are applied in app.js, so a
//  non-admin (or a logged-out visitor) only ever sees 401/404.
//    GET   /api/admin/stats                    live dashboard numbers (read-only)
//    GET   /api/admin/reports?status=open      questions reported by students
//    PATCH /api/admin/reports/:questionId      mark them fixed / dismissed / open
// ============================================================

import { Router } from "express";
import { buildAdminStats } from "../services/adminStats.js";
import { validate } from "../middleware/validate.js";
import { updateReportSchema } from "../schemas/testSchemas.js";
import { listReports, updateReports } from "../controllers/reportController.js";

const router = Router();

router.get("/stats", async (req, res, next) => {
  try {
    return res.json({ success: true, stats: await buildAdminStats() });
  } catch (err) { return next(err); }
});

router.get("/reports", listReports);
router.patch("/reports/:questionId", validate(updateReportSchema), updateReports);

export default router;
