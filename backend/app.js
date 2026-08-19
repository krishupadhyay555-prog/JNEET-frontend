// ============================================================
//  JNEET+ AI — app.js  (v2 — wmsRoutes mounted)
//  FIXED: wmsRoutes was never imported or mounted here at all —
//  that's the entire root cause of "Route 'POST /api/wms' not
//  found" and the failed GET requests. Added the import and the
//  app.use("/api/wms", wmsRoutes) line, following the exact same
//  pattern as the other three route mounts.
//  Everything else — CORS config, security middleware, error
//  handler, health check — is UNCHANGED.
// ============================================================

import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";
import mongoose     from "mongoose";

import { env } from "./config/env.js";
import { helmetMiddleware, sanitizeMiddleware } from "./middleware/security.js";

import authRoutes   from "./routes/authRoutes.js";
import aiRoutes     from "./routes/aiRoutes.js";
import chatRoutes   from "./routes/chatRoutes.js";
import userRoutes   from "./routes/userRoutes.js";
import wmsRoutes     from "./routes/wmsRoutes.js";
import testRoutes    from "./routes/testRoutes.js";
import uploadRoutes  from "./routes/uploadRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(env.FRONTEND_URL ? env.FRONTEND_URL.split(",") : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
    methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

app.use(helmetMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(sanitizeMiddleware);
app.set("trust proxy", 1);

app.use("/api/auth", authRoutes);
app.use("/api/ai",   aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wms",  wmsRoutes);
app.use("/api/test",   testRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" :
    dbState === 2 ? "connecting" :
    dbState === 3 ? "disconnecting" :
    "disconnected";

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status:    isHealthy ? "ok" : "degraded",
    database:  dbStatus,
    uptime:    `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    env:       env.NODE_ENV,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route '${req.method} ${req.originalUrl}' not found.`,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isProd = env.NODE_ENV === "production";

  console.error(`[Error] ${req.method} ${req.originalUrl}`, {
    message: err.message,
    stack:   err.stack,
    user:    req.user?.id ?? "unauthenticated",
  });

  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, error: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid ID format in request." });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ success: false, error: `A record with this ${field} already exists.` });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(". ") });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, error: "Invalid or expired session. Please login again." });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  return res.status(statusCode).json({
    success: false,
    error:   isProd && statusCode === 500
      ? "An internal server error occurred. Please try again later."
      : err.message || "Internal Server Error",
  });
});

export default app;