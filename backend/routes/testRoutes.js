// ============================================================
//  JNEET+ AI — routes/testRoutes.js  (v2 — start-full added)
// ============================================================
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { startTestSchema, submitTestSchema } from "../schemas/testSchemas.js";
import {
  startTest,
  startFullTest,
  submitTest,
  getAttempt,
  getHistory,
  getAvailableChapters,
} from "../controllers/testController.js";

const router = Router();

router.use(protect);

router.get( "/chapters",          getAvailableChapters); // before /:attemptId
router.post("/start",             validate(startTestSchema), startTest);
router.post("/start-full",        startFullTest); // no body needed — driven by req.user.examMode
router.post("/:attemptId/submit", validate(submitTestSchema), submitTest);
router.get( "/history",           getHistory); // must come before /:attemptId
router.get( "/:attemptId",        getAttempt);

export default router;