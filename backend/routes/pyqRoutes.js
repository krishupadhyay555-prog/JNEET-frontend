// Mounted in app.js behind protect + userLimiter.
import { Router } from "express";
import { list, chapters, byChapter, getOne } from "../controllers/pyqController.js";
import { blockDuringAllIndia } from "../middleware/allIndiaLock.js";

const router = Router();
router.get("/",         list);
router.get("/chapters", chapters);
router.get("/chapter",  blockDuringAllIndia, byChapter);   // answers inside: paused during an open All-India Mock
router.get("/:id",      blockDuringAllIndia, getOne);
export default router;
