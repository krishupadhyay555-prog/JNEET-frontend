// Mounted in app.js behind protect + userLimiter.
import { Router } from "express";
import { list, chapters, byChapter, getOne } from "../controllers/pyqController.js";

const router = Router();
router.get("/",         list);
router.get("/chapters", chapters);
router.get("/chapter",  byChapter);
router.get("/:id",      getOne);
export default router;
