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
    // Student's thumbs up/down on an AI answer (quality signal; null = none)
    feedback: {
      type:    String,
      enum:    ["up", "down", null],
      default: null,
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

// ── Retention limits ─────────────────────────────────────────
// A student's chats live in ONE document (MongoDB's hard cap is 16 MB), so the
// document is kept comfortably below that, and trimming never touches pinned
// chats or the chat currently being written (the last one).
export const CHAT_LIMITS = {
  MAX_SESSIONS: 30,
  MAX_MESSAGES: 150,
  MAX_BYTES: 8 * 1024 * 1024,
};

const sessionBytes = (s) =>
  (s.messages ?? []).reduce((n, m) => n + Buffer.byteLength(m?.content ?? "", "utf8") + 120, 200);

export function pruneChat(chat, limits = CHAT_LIMITS) {
  const sessions = chat.sessions;
  if (!sessions?.length) return;

  for (const session of sessions) {
    if (session.messages.length > limits.MAX_MESSAGES) {
      session.messages.splice(0, session.messages.length - limits.MAX_MESSAGES);
    }
  }

  // Oldest UNPINNED chat that is not the one being written (the last).
  const oldestRemovable = () => sessions.findIndex((s, i) => i < sessions.length - 1 && !s.pinned);

  while (sessions.length > limits.MAX_SESSIONS) {
    const i = oldestRemovable();
    if (i === -1) break;
    sessions.splice(i, 1);
  }

  const total = () => sessions.reduce((n, s) => n + sessionBytes(s), 0);
  while (total() > limits.MAX_BYTES) {
    const i = oldestRemovable();
    if (i !== -1) { sessions.splice(i, 1); continue; }
    // Only pinned / current chats remain: trim the oldest messages of the largest one.
    const biggest = sessions.reduce((a, b) => (sessionBytes(b) > sessionBytes(a) ? b : a));
    if (biggest.messages.length <= 2) break;
    biggest.messages.splice(0, Math.min(10, biggest.messages.length - 2));
  }
}

chatSchema.pre("save", function () {
  pruneChat(this);
});

export default mongoose.model("Chat", chatSchema);