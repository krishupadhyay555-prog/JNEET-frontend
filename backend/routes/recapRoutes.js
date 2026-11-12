// Mounted in app.js behind protect + userLimiter.
import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { getRecap, start } from "../controllers/recapController.js";

const startSchema = z.object({
  sessionId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid chat"),
  count: z.number().int().min(5).max(10).default(5),
});

const router = Router();
router.get("/",       getRecap);
router.post("/start", validate(startSchema), start);
export default router;
