// ============================================================
//  JNEET+ AI — server.js  (Production v2.0)
//  Entry point ONLY. Responsibilities:
//    1. Load and validate environment variables (fail-fast)
//    2. Mount global middleware in correct order
//    3. Mount route modules
//    4. Register 404 + global error handlers
//    5. Connect to DB and start listening
//
//  STRICT RULES ENFORCED:
//    - Zero business logic here
//    - Zero middleware exported from this file
//    - Zero circular dependency risk (all imports are leaf modules)
//    - dotenv loaded FIRST before any other import that reads env vars
// ============================================================

// ── Step 1: Load .env BEFORE everything else ─────────────────
// dotenv must run before config/env.js reads process.env
import dotenv from "dotenv";
dotenv.config();

// ── Step 2: Validate env vars — fail-fast if anything missing ─
// This import will call process.exit(1) if any required var is absent.
import { env } from "./config/env.js";

// ── Step 3: All other imports ─────────────────────────────────
import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";
import mongoose     from "mongoose";

import connectDB    from "./config/db.js";

import { helmetMiddleware, sanitizeMiddleware } from "./middleware/security.js";

import authRoutes   from "./routes/authRoutes.js";
import aiRoutes     from "./routes/aiRoutes.js";
import chatRoutes   from "./routes/chatRoutes.js";

// ── App Initialisation ────────────────────────────────────────
const app = express();

// ── CORS ──────────────────────────────────────────────────────
// Must be before helmet so preflight OPTIONS requests are handled first.
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
      // Allow server-to-server requests (no origin) and whitelisted origins
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,   // Required for httpOnly cookies to be sent cross-origin
    methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

// ── Security Headers (Helmet) ─────────────────────────────────
app.use(helmetMiddleware);

// ── Body Parsing ──────────────────────────────────────────────
// Must be before sanitizeMiddleware so the body is parsed first,
// then sanitized for NoSQL injection characters.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ── Cookie Parser ─────────────────────────────────────────────
// Required to read req.cookies.jneet_token in authMiddleware.
app.use(cookieParser(env.COOKIE_SECRET));

// ── NoSQL Injection Sanitiser ─────────────────────────────────
// Runs after body parsing, before any route handler.
// Strips '$' and '.' from req.body, req.params, req.query.
app.use(sanitizeMiddleware);

// ── Trust Proxy ───────────────────────────────────────────────
// Required for express-rate-limit to read the real client IP
// when the app is behind a reverse proxy (Nginx, Railway, Render, etc.)
// Set to 1 for a single proxy layer. Adjust for your infrastructure.
app.set("trust proxy", 1);

// ────────────────────────────────────────────────────────────
//  ROUTES
// ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/ai",   aiRoutes);
app.use("/api/chat", chatRoutes);

// ── Health Check ──────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
//  ERROR HANDLERS — must be last
// ────────────────────────────────────────────────────────────

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route '${req.method} ${req.originalUrl}' not found.`,
  });
});

// ── Global Error Handler ──────────────────────────────────────
// Receives errors forwarded via next(err) from any route or middleware.
// SECURITY: Internal error details are NEVER exposed in production.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isProd = env.NODE_ENV === "production";

  // Log full error internally — always
  console.error(`[Error] ${req.method} ${req.originalUrl}`, {
    message: err.message,
    stack:   err.stack,
    user:    req.user?.id ?? "unauthenticated",
  });

  // CORS policy violations from the CORS middleware itself
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, error: err.message });
  }

  // Mongoose CastError — usually from invalid ObjectId in params
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error:   "Invalid ID format in request.",
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      error:   `A record with this ${field} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error:   messages.join(". "),
    });
  }

  // JWT errors that slipped past authMiddleware (belt-and-suspenders)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error:   "Invalid or expired session. Please login again.",
    });
  }

  // Use statusCode if the error carries one (e.g. from geminiService)
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  return res.status(statusCode).json({
    success: false,
    // In production, never leak internal error messages to clients
    error:   isProd && statusCode === 500
      ? "An internal server error occurred. Please try again later."
      : err.message || "Internal Server Error",
  });
});

// ────────────────────────────────────────────────────────────
//  BOOTSTRAP — Connect DB then start server
// ────────────────────────────────────────────────────────────
const PORT = parseInt(env.PORT, 10) || 5000;

(async () => {
  await connectDB();  // Will process.exit(1) if all retries fail

  const server = app.listen(PORT, () => {
    console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });

  // Graceful HTTP server shutdown on SIGTERM (Docker, Railway, etc.)
  process.on("SIGTERM", () => {
    console.log("[Server] SIGTERM received — shutting down gracefully...");
    server.close(() => {
      console.log("[Server] HTTP server closed.");
      // DB connection is closed by config/db.js SIGTERM handler
    });
  });
})();
