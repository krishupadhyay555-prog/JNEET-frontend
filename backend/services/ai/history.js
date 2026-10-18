// ============================================================
//  JNEET+ AI — services/ai/history.js
//  Loads the recent turns of a chat session so the mentor remembers
//  what was just discussed ("explain step 3 again", "what about the
//  second case?"). The old single-turn implementation had no memory.
//
//  Bounded on purpose: last 10 messages and ~9,000 characters, each
//  message clipped — cost stays predictable and one huge message
//  can't blow the context.
// ============================================================

import Chat from "../../models/Chat.js";

const MAX_MESSAGES = 10;
const MAX_TOTAL_CHARS = 9000;
const MAX_MESSAGE_CHARS = 2500;

export function shapeHistory(messages, {
  maxMessages = MAX_MESSAGES,
  maxTotalChars = MAX_TOTAL_CHARS,
  maxMessageChars = MAX_MESSAGE_CHARS,
} = {}) {
  const recent = (messages ?? []).slice(-maxMessages);
  const picked = [];
  let total = 0;

  // Walk from newest to oldest so the most recent turns always survive.
  for (let i = recent.length - 1; i >= 0; i--) {
    const m = recent[i];
    if (!m?.content || (m.role !== "user" && m.role !== "ai")) continue;
    const content = m.content.length > maxMessageChars
      ? m.content.slice(0, maxMessageChars) + " …"
      : m.content;
    if (total + content.length > maxTotalChars && picked.length > 0) break;
    total += content.length;
    picked.unshift({ role: m.role === "ai" ? "assistant" : "user", content });
  }

  // A conversation must start with the student's turn.
  while (picked.length && picked[0].role !== "user") picked.shift();
  return picked;
}

export async function loadHistory({ userId, examMode, sessionId }) {
  if (!sessionId) return [];

  // Positional projection: reads only the one requested session.
  const chat = await Chat.findOne(
    { userId, examMode, "sessions._id": sessionId },
    { "sessions.$": 1 }
  ).lean();

  const session = chat?.sessions?.[0];
  return shapeHistory(session?.messages);
}
