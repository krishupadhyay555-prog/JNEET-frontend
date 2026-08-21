// ============================================================
//  JNEET+ AI — routes/testRoutes.js  (v3 — /answer route added)
// ============================================================
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { startTestSchema, submitTestSchema, answerQuestionSchema } from "../schemas/testSchemas.js";
import {
  startTest,
  startFullTest,
  answerQuestion,
  submitTest,
  getAttempt,
  getHistory,
  getAvailableChapters,
} from "../controllers/testController.js";

const router = Router();

router.use(protect);

router.get( "/chapters",          getAvailableChapters); // before /:attemptId
router.post("/start",             validate(startTestSchema), startTest);
router.post("/start-full",        startFullTest);
router.post("/:attemptId/answer", validate(answerQuestionSchema), answerQuestion);
router.post("/:attemptId/submit", validate(submitTestSchema), submitTest);
router.get( "/history",           getHistory); // must come before /:attemptId
router.get( "/:attemptId",        getAttempt);

export default router;