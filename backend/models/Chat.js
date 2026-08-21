// ============================================================
//  JNEET+ AI — models/Chat.js  (v2.1 — pin support added)
//  ADDED: `pinned` (Boolean) + `pinnedAt` (Date) on the session
//  sub-schema. pinnedAt is used purely for sort-stability — when
//  multiple sessions are pinned, they're ordered by "most-recently
//  pinned first" rather than an arbitrary/unstable order.
//  Everything else (saved-rename, pre-save session/message caps,
//  compound index) is UNCHANGED from v2.0.
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
    pinned: {
      type:    Boolean,
      default: false,
    },
    pinnedAt: {
      type:    Date,
      default: null,
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

chatSchema.index({ userId: 1, examMode: 1 }, { unique: true });

chatSchema.pre("save", function () {
  if (this.sessions.length > 30) {
    this.sessions.splice(0, this.sessions.length - 30);
  }
  for (let i = 0; i < this.sessions.length; i++) {
    const session = this.sessions[i];
    if (session.messages.length > 150) {
      session.messages.splice(0, session.messages.length - 150);
    }
  }
});

export default mongoose.model("Chat", chatSchema);