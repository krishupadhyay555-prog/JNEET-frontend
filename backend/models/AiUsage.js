// ============================================================
//  JNEET+ AI — models/AiUsage.js
//  Usage ledger: one row per AI call, so cost per user / per day /
//  per plan is always answerable (and abuse is visible). Contains NO
//  prompt or answer text — only counts and cost.
// ============================================================

import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    day:      { type: String, required: true, index: true }, // IST day, YYYY-MM-DD
    kind:     { type: String, enum: ["chat", "title", "deep"], default: "chat" },
    plan:     { type: String, default: "free" },
    model:    { type: String, required: true },
    effort:   { type: String, default: null },
    status:   { type: String, enum: ["ok", "error", "aborted", "incomplete"], default: "ok" },
    errorCode:{ type: String, default: null },
    usedFallback: { type: Boolean, default: false },

    inputTokens:     { type: Number, default: null },
    cachedTokens:    { type: Number, default: null },
    outputTokens:    { type: Number, default: null },
    reasoningTokens: { type: Number, default: null },

    costUsd: { type: Number, default: null },
    costInr: { type: Number, default: null },
    latencyMs: { type: Number, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

aiUsageSchema.index({ userId: 1, createdAt: -1 });
// Keep the ledger for a year, then let MongoDB drop it.
aiUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.model("AiUsage", aiUsageSchema);
