// ============================================================
//  JNEET+ AI — routes/userRoutes.js  (v2)
//  ADDED: PATCH /date-of-birth, PATCH /preferences.
//  The destructive / credential routes get the same brute-force
//  protection as login (a stolen session could otherwise guess the
//  current password here without limit).
// ============================================================

import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../limiters/authLimiter.js";
import { otpIpLimiter } from "../limiters/otpLimiter.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  dateOfBirthSchema,
  preferencesSchema,
} from "../schemas/userSchemas.js";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  setDateOfBirth,
  updatePreferences,
} from "../controllers/userController.js";

const router = Router();

router.use(protect);

router.patch( "/profile",       validate(updateProfileSchema),  updateProfile);
router.patch( "/password",      authLimiter, validate(changePasswordSchema), changePassword);
router.delete("/account",       authLimiter, validate(deleteAccountSchema),  deleteAccount);
router.patch( "/date-of-birth", otpIpLimiter, validate(dateOfBirthSchema),   setDateOfBirth);
router.patch( "/preferences",   validate(preferencesSchema),    updatePreferences);

export default router;
