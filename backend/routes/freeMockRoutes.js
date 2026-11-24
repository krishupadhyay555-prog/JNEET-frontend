// ============================================================
//  JNEET+ AI — routes/freeMockRoutes.js   (public, no signup)
//  Anti-bot only (no daily limit for humans): Turnstile before start,
//  ~60 starts per IP per hour, a global per-minute safety cap
//  (FREE_MOCK_STARTS_PER_MIN, default 300). No AI calls anywhere here.
// ============================================================
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import { requireCaptcha } from "../middleware/captcha.js";
import { protect } from "../middleware/authMiddleware.js";
import { freeMockStartSchema, freeMockSubmitSchema } from "../schemas/freeMockSchemas.js";
import { startFreeMock, getFreeMock, submitFreeMock, freeMockResult, claimFreeMock } from "../controllers/freeMockController.js";

const ipKey = (ip = "") => (!ip.includes(":") ? ip || "unknown" : ip.startsWith("::ffff:") ? ip.slice(7) : ip.split(":").slice(0, 4).join(":"));
const busy = (message) => (req, res) => res.status(429).json({ success: false, code: "FREE_MOCK_BUSY", error: message });

const startsPerIp = rateLimit({
  windowMs: 60 * 60 * 1000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false,
  keyGenerator: (req) => `fm-ip:${ipKey(req.ip)}`,
  handler: busy("Too many tests started from this network in the last hour. Please try again a bit later."),
});
const globalStarts = rateLimit({
  windowMs: 60 * 1000, standardHeaders: false, legacyHeaders: false,
  limit: () => Number(process.env.FREE_MOCK_STARTS_PER_MIN) || 300,
  keyGenerator: () => "fm-global",
  handler: busy("Lots of students are starting tests right now. Please try again in a minute."),
});
const perIpLight = rateLimit({
  windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false,
  keyGenerator: (req) => `fm-read:${ipKey(req.ip)}`,
  handler: busy("Too many requests. Please wait a moment."),
});

const router = Router();
router.post("/start", startsPerIp, globalStarts, validate(freeMockStartSchema), requireCaptcha, startFreeMock);
router.post("/claim", protect, perIpLight, claimFreeMock);
router.get("/:id", perIpLight, getFreeMock);
router.post("/:id/submit", perIpLight, validate(freeMockSubmitSchema), submitFreeMock);
router.get("/:id/result", perIpLight, freeMockResult);

export default router;
