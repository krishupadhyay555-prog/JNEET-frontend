// ============================================================
//  JNEET+ AI — server.js  (Production v2.0)
//  Entry point ONLY. Sirf DB connect + server start karta hai.
//  Poora Express app + routes ab app.js mein hain (testing ke liye).
// ============================================================

import dotenv from "dotenv";
dotenv.config();

import { env } from "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = parseInt(env.PORT, 10) || 5000;

(async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    console.log("[Server] SIGTERM received — shutting down gracefully...");
    server.close(() => {
      console.log("[Server] HTTP server closed.");
    });
  });
})();