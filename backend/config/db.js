// ============================================================
//  JNEET+ AI — config/db.js
//  Mongoose connection with retry logic and clean lifecycle
//  management. Owns the connection — server.js only calls this.
// ============================================================

import mongoose from "mongoose";
import { env } from "./env.js";

const RETRY_LIMIT = 5;
const RETRY_DELAY_MS = 3000;

const connectOptions = {
  // Let Mongoose manage connection pooling
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Keeps connection alive on long-idle processes
  heartbeatFrequencyMS: 10000,
};

async function connectDB(attempt = 1) {
  try {
    await mongoose.connect(env.MONGO_URI, connectOptions);

    const host = mongoose.connection.host;
    const name = mongoose.connection.name;
    console.log(`✅ MongoDB Connected: ${host}/${name}`);

    // Graceful shutdown — close connection on process termination
    process.on("SIGINT",  () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (err) {
    console.error(
      `❌ MongoDB connection attempt ${attempt}/${RETRY_LIMIT} failed: ${err.message}`
    );

    if (attempt < RETRY_LIMIT) {
      console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }

    console.error("❌ FATAL: Could not connect to MongoDB after max retries. Exiting.");
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\n[DB] ${signal} received — closing MongoDB connection gracefully...`);
  await mongoose.connection.close();
  console.log("[DB] Connection closed. Goodbye.");
  process.exit(0);
}

export default connectDB;