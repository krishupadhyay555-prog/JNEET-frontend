// ============================================================
//  JNEET+ AI — routes/userRoutes.js
// ============================================================

import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  updateLanguageSchema,
  deleteAccountSchema,
} from "../schemas/userSchemas.js";
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = Router();

router.use(protect);

router.patch("/profile",  validate(updateProfileSchema),  updateProfile);
router.patch("/password", validate(changePasswordSchema), changePassword);
router.delete("/account", validate(deleteAccountSchema),  deleteAccount);

export default router;