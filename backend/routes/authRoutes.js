// ============================================================
//  JNEET+ AI — routes/authRoutes.js  (Production v2.0)
//  Clean route definitions only.
//  Middleware applied inline at the route level — not in server.js.
// ============================================================

import { Router }  from "express";
import { authLimiter }    from "../limiters/authLimiter.js";
import { validate }       from "../middleware/validate.js";
import { protect }        from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

const router = Router();

// Public routes — rate limited + validated
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login",    authLimiter, validate(loginSchema),    login);

// Protected routes
router.post("/logout", protect, logout);
router.get( "/me",     protect, getMe);

export default router;