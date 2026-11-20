// ============================================================
//  JNEET+ AI — routes/allIndiaRoutes.js  (weekly All-India Mock)
// ============================================================
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllIndia, startAllIndia, getLeaderboard } from "../controllers/allIndiaController.js";

const router = Router();
router.use(protect);
router.get("/", getAllIndia);
router.post("/:mockId/start", startAllIndia);
router.get("/:mockId/leaderboard", getLeaderboard);
export default router;
