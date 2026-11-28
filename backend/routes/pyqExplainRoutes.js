import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireTier } from "../middleware/requireTier.js";
import { pyqExplainSchema } from "../schemas/mistakeSchemas.js";
import { explain } from "../controllers/pyqExplainController.js";
import { blockDuringAllIndia } from "../middleware/allIndiaLock.js";

const router = Router();
router.post("/", requireTier("pro"), blockDuringAllIndia, validate(pyqExplainSchema), explain);
export default router;
