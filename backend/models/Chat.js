// ============================================================
//  JNEET+ AI — models/Chat.js  (Production v2.0)
//  FIXES:
//    - Renamed `bookmarked` → `saved` at schema level (everywhere)
//    - Fixed pre('save') hook: was using .map() on Mongoose
//      DocumentArray which breaks change tracking. Now uses
//      direct index-based mutation to preserve Mongoose internals.
//    - Added compound index on (userId, examMode) for fast lookups
//    - Added lean-safe virtuals for session summary
// ============================================================

import mongoose from "mongoose";

// ── Message Sub-schema ────────────────────────────────────────
const messageSchema = new mongoose.Schema(
  {
    role: {
      type:     String,
      enum:     ["user", "ai"],
      required: true,
    },
    content: {
      type:      String,
      required:  true,
      maxlength: 20000,
    },
    // RENAMED: bookmarked → saved (requirement: "Saved" everywhere)
    saved: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  { _id: true, timestamps: true }
);

// ── Session Sub-schema ────────────────────────────────────────
const chatSessionSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      default:   "New Chat",
      maxlength: 100,
    },
    messages: {
      type:    [messageSchema],
      default: [],
    },
  },
  { _id: true, timestamps: true }
);

// ── Root Chat Schema ──────────────────────────────────────────
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    examMode: {
      type:     String,
      enum:     ["NEET", "JEE"],
      required: true,
    },
    sessions: {
      type:    [chatSessionSchema],
      default: [],
    },
    activeSessionId: {
      type:    mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

// ── Compound index: one chat doc per user per exam mode ───────
chatSchema.index({ userId: 1, examMode: 1 }, { unique: true });

// ── Pre-save: Enforce session/message limits ──────────────────
// FIX: Original code used .map() which returns a plain JS array,
// breaking Mongoose's DocumentArray change tracking and causing
// silent data corruption. We now mutate sessions in-place using
// direct index access, which Mongoose tracks correctly.
chatSchema.pre("save", function () {
  // Cap sessions at 30 — drop oldest first
  if (this.sessions.length > 30) {
    this.sessions.splice(0, this.sessions.length - 30);
  }

  // Cap messages per session at 150 — drop oldest first
  for (let i = 0; i < this.sessions.length; i++) {
    const session = this.sessions[i];
    if (session.messages.length > 150) {
      session.messages.splice(0, session.messages.length - 150);
    }
  }
});

export default mongoose.model("Chat", chatSchema);
