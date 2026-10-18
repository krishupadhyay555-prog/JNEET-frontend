// ============================================================
//  JNEET+ AI — app.js  (v4 — security hardening)
//  - trust proxy is set FIRST so req.ip (rate limits) is the real client
//  - JSON only, 256kb body cap (urlencoded parsing removed: no form posts)
//  - request id + path-only access log
//  - trusted-Origin check on state-changing requests (CSRF layer 2)
//  - baseline per-IP limiter on every /api route, per-user on data routes
//  - /health reveals nothing but ok/degraded
//  - 5xx errors never leak err.message; they carry a request id instead
//  - /api/upload is intentionally NOT mounted (nothing in the product uses
//    it, and an open authenticated upload endpoint is a free-storage and
//    abuse hole). Re-enable only with an admin check + size/type limits.
// ============================================================

import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";
import mongoose     from "mongoose";

import { env } from "./config/env.js";
import { helmetMiddleware, sanitizeMiddleware } from "./middleware/security.js";
import { requestId, accessLog, requireTrustedOrigin } from "./middleware/requestContext.js";
import { apiLimiter, userLimiter, heavyLimiter } from "./limiters/generalLimiter.js";
import { protect } from "./middleware/authMiddleware.js";

import authRoutes    from "./routes/authRoutes.js";
import aiRoutes      from "./routes/aiRoutes.js";
import chatRoutes    from "./routes/chatRoutes.js";
import userRoutes    from "./routes/userRoutes.js";
import wmsRoutes     from "./routes/wmsRoutes.js";
import testRoutes    from "./routes/testRoutes.js";
import notesRoutes   from "./routes/notesRoutes.js";
import consentRoutes from "./routes/consentRoutes.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(env.FRONTEND_URL ? env.FRONTEND_URL.split(",") : []),
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(requestId);
app.use(accessLog);
app.use(helmetMiddleware);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin is not allowed."));
      }
    },
    credentials: true,
    methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    exposedHeaders: ["X-Request-Id", "Retry-After"],
    maxAge: 600,
  })
);

app.use(express.json({ limit: "256kb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(sanitizeMiddleware);

// ── Health (public, reveals nothing) ───────────────────────────
app.get("/health", (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "degraded" });
});

// ── API ────────────────────────────────────────────────────────
app.use("/api", apiLimiter);
app.use("/api", requireTrustedOrigin(allowedOrigins));

app.use("/api/auth",    authRoutes);     // own OTP/login limiters inside
app.use("/api/consent", consentRoutes);  // own limiters inside
app.use("/api/ai",      aiRoutes);       // own AI limiter inside
app.use("/api/chat",    protect, userLimiter, chatRoutes);
app.use("/api/user",    userRoutes);
app.use("/api/wms",     protect, userLimiter, wmsRoutes);
app.use("/api/test/start-full", protect, heavyLimiter); // expensive: generating a full paper
app.use("/api/test",    protect, userLimiter, testRoutes);
app.use("/api/notes",   protect, userLimiter, notesRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found." });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isProd = env.NODE_ENV === "production";

  console.error(`[Error] ${req.id} ${req.method} ${req.path}`, {
    message: err.message,
    stack:   isProd ? undefined : err.stack,
    user:    req.user?.id ?? "unauthenticated",
  });

  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, error: "Request origin is not allowed." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Request is too large." });
  }
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ success: false, error: "Malformed request body." });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid ID format in request." });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: "A record with these details already exists." });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(". ") });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, error: "Invalid or expired session. Please login again." });
  }

  const status = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode
    : 500;

  if (status >= 500) {
    return res.status(status).json({
      success: false,
      error: "Something went wrong on our side. Please try again.",
      requestId: req.id,
    });
  }
  return res.status(status).json({ success: false, error: err.message || "Request failed." });
});

export default app;
