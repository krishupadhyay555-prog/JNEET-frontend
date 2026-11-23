import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireTier } from "../middleware/requireTier.js";
import { mistakeAnswerSchema } from "../schemas/mistakeSchemas.js";
import { summary, list, answer, master } from "../controllers/mistakeController.js";

const router = Router();
router.get("/summary", summary);
router.get("/", requireTier("pro"), list);
router.post("/:id/answer", requireTier("pro"), validate(mistakeAnswerSchema), answer);
router.post("/:id/master", requireTier("pro"), master);
export default router;
