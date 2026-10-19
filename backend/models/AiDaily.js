// ============================================================
//  JNEET+ AI — models/AiDaily.js
//  Atomic per-user counters used to enforce the daily doubt limit
//  (and the monthly deep-solve limit). `key` is either an IST day
//  ("2026-10-18") or an IST month ("2026-10" with kind "deep").
// ============================================================

import mongoose from "mongoose";

const aiDailySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind:   { type: String, enum: ["day", "deep_month"], required: true },
    key:    { type: String, required: true },
    count:  { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

aiDailySchema.index({ userId: 1, kind: 1, key: 1 }, { unique: true });
// Counters are only meaningful for the current day/month.
aiDailySchema.index({ createdAt: 1 }, { expireAfterSeconds: 70 * 24 * 60 * 60 });

export default mongoose.model("AiDaily", aiDailySchema);
