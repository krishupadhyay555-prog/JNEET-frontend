// ============================================================
//  JNEET+ AI — routes/testRoutes.js  (v3 — /answer route added)
// ============================================================
import { Router } from "express";
import { requireAnalysisAccess } from "../middleware/requireTier.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { startTestSchema, submitTestSchema, answerQuestionSchema, reportQuestionSchema } from "../schemas/testSchemas.js";
import { reportQuestion } from "../controllers/reportController.js";
import {
  startTest,
  startFullTest,
  answerQuestion,
  submitTest,
  getAttempt, getAnalysis,
  getHistory,
  getAvailableChapters,
} from "../controllers/testController.js";

const router = Router();

router.use(protect);

router.get( "/chapters",          getAvailableChapters); // before /:attemptId
router.post("/start",             validate(startTestSchema), startTest);
router.post("/start-full",        startFullTest);
router.post("/report",            validate(reportQuestionSchema), reportQuestion); // flag a question
router.post("/:attemptId/answer", validate(answerQuestionSchema), answerQuestion);
router.post("/:attemptId/submit", validate(submitTestSchema), submitTest);
router.get( "/history",           getHistory); // must come before /:attemptId
router.get( "/:attemptId/analysis", requireAnalysisAccess, getAnalysis);
router.get( "/:attemptId",        getAttempt);

export default router;