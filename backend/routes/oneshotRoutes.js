// Mounted in app.js behind protect + userLimiter.
import { Router } from "express";
import { list, getOne } from "../controllers/oneshotController.js";

const router = Router();
router.get("/",      list);
router.get("/:slug", getOne);
export default router;
