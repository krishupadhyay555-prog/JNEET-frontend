// ============================================================
//  JNEET+ AI — routes/uploadRoutes.js  (NEW file)
//  Needs to be imported + mounted in app.js at "/api/upload" —
//  this route file didn't exist before, so nothing was auto-
//  wiring it (unlike wmsRoutes/testRoutes, which already had
//  placeholder files app.js was importing).
// ============================================================

import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { uploadImageSchema } from "../schemas/uploadSchemas.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = Router();

router.use(protect);

router.post("/image", validate(uploadImageSchema), uploadImage);

export default router;