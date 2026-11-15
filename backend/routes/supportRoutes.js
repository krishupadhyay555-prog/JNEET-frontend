// ============================================================
//  JNEET+ AI — routes/supportRoutes.js   (public)
//    POST /api/support/contact   Contact form (captcha + 5/hour/IP)
// ============================================================

import { Router } from "express";
import rateLimit from "express-rate-limit";

const ipKey = (ip) => (!ip || !ip.includes(":") ? ip || "unknown" : ip.startsWith("::ffff:") ? ip.slice(7) : ip.split(":").slice(0, 4).join(":"));
import { requireCaptcha } from "../middleware/captcha.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../schemas/supportSchemas.js";
import { createMessage } from "../controllers/supportController.js";

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `contact:${ipKey(req.ip ?? "")}`,
  handler: (req, res) => res.status(429).json({ success: false, error: "Too many messages from this network. Please try again in an hour." }),
});

const router = Router();
router.post("/contact", contactLimiter, requireCaptcha, validate(contactSchema), createMessage);
export default router;
