// ============================================================
//  JNEET+ AI — controllers/chatController.js  (v3 — pin + rename)
//  ADDED:
//    - renameSession() — PATCH /session/:sessionId/rename
//    - toggleSessionPin() — PATCH /session/:sessionId/pin
//    - getSessions() now returns `pinned`/`pinnedAt` per session,
//      and re-orders the list: pinned sessions first (most-
//      recently-pinned first among themselves), then the rest in
//      the existing most-recent-first order — unchanged logic,
//      just re-sliced after the existing .reverse().
//    - searchChats() now also includes `pinned` on each result,
//      so the pin indicator/menu stays correct even while a
//      search is active (ordering during search is unaffected —
//      only the default sidebar list gets pinned-to-top sorting).
//  Everything else — session CRUD, message save/toggle-saved,
//  saved-list — UNCHANGED from v2.2.
// ============================================================

import Chat from "../models/Chat.js";
import { env } from "../config/env.js";
import { generateChatTitle } from "../services/geminiService.js";

function generateTitle(content, maxLen = 48) {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;

  const truncated = clean.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  const safe = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
  return safe + "…";
}

async function getOrCreateChat(userId, examMode) {
  return Chat.findOneAndUpdate(
    { userId, examMode },
    {
      $setOnInsert: {
        userId,
        examMode,
        sessions: [],
        activeSessionId: null,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );
}

// ── GET /sessions — pinned-first, then most-recent-first ─────
export const getSessions = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    })
      .select("sessions._id sessions.title sessions.createdAt sessions.messages sessions.pinned sessions.pinnedAt activeSessionId")
      .lean();

    if (!chat) {
      return res.json({ success: true, sessions: [], activeSessionId: null });
    }

    const mapped = chat.sessions.map((s) => ({
      _id:          s._id,
      title:        s.title,
      messageCount: s.messages.length,
      createdAt:    s.createdAt,
      lastMessage:  s.messages[s.messages.length - 1]?.content?.slice(0, 80) || "",
      pinned:       !!s.pinned,
      pinnedAt:     s.pinnedAt || null,
    }));

    const recentFirst = mapped.reverse();
    const pinned = recentFirst
      .filter((s) => s.pinned)
      .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt));
    const unpinned = recentFirst.filter((s) => !s.pinned);

    return res.json({
      success: true,
      sessions: [...pinned, ...unpinned],
      activeSessionId: chat.activeSessionId,
    });

  } catch (err) {
    next(err);
  }
};

export const searchChats = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.json({ success: true, results: [] });
    }

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    })
      .select("sessions._id sessions.title sessions.createdAt sessions.messages sessions.pinned")
      .lean();

    if (!chat) {
      return res.json({ success: true, results: [] });
    }

    const query = q.toLowerCase();
    const results = [];

    for (const session of chat.sessions) {
      const titleMatch = session.title?.toLowerCase().includes(query);
      const matchedMessage = session.messages.find(
        (m) => m.content?.toLowerCase().includes(query)
      );

      if (titleMatch || matchedMessage) {
        const snippetSource = matchedMessage
          ?? session.messages[session.messages.length - 1];

        results.push({
          _id:          session._id,
          title:        session.title,
          createdAt:    session.createdAt,
          messageCount: session.messages.length,
          pinned:       !!session.pinned,
          snippet:      snippetSource?.content?.slice(0, 120) || "",
        });
      }
    }

    results.reverse();

    return res.json({ success: true, results });

  } catch (err) {
    next(err);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    }).lean();

    if (!chat) {
      return res.status(404).json({ success: false, error: "No chat history found." });
    }

    const session = chat.sessions.find(
      (s) => s._id.toString() === sessionId
    );

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    return res.json({ success: true, session });

  } catch (err) {
    next(err);
  }
};

export const newSession = async (req, res, next) => {
  try {
    const chat = await getOrCreateChat(req.user.id, req.user.examMode);

    chat.sessions.push({ title: "New Chat", messages: [] });
    const created = chat.sessions[chat.sessions.length - 1];

    if (!created || !created._id) {
      return res.status(500).json({ success: false, error: "Failed to create session." });
    }

    chat.activeSessionId = created._id;
    await chat.save();

    return res.json({
      success:   true,
      sessionId: created._id,
      title:     created.title,
    });

  } catch (err) {
    next(err);
  }
};

export const setActiveSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    const exists = chat.sessions.some((s) => s._id.toString() === sessionId);
    if (!exists) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    chat.activeSessionId = sessionId;
    await chat.save();

    return res.json({ success: true, activeSessionId: sessionId });

  } catch (err) {
    next(err);
  }
};

// ── NEW: PATCH /session/:sessionId/rename ────────────────────
export const renameSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    const session = chat.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    session.title = title;
    await chat.save();

    return res.json({ success: true, title: session.title });

  } catch (err) {
    next(err);
  }
};

// ── NEW: PATCH /session/:sessionId/pin — toggle pinned state ─
export const toggleSessionPin = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    const session = chat.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    session.pinned = !session.pinned;
    session.pinnedAt = session.pinned ? new Date() : null;
    await chat.save();

    return res.json({ success: true, pinned: session.pinned });

  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    const index = chat.sessions.findIndex(
      (s) => s._id.toString() === sessionId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    chat.sessions.splice(index, 1);

    if (chat.activeSessionId?.toString() === sessionId) {
      chat.activeSessionId = chat.sessions.length > 0
        ? chat.sessions[chat.sessions.length - 1]._id
        : null;
    }

    await chat.save();
    return res.json({ success: true, message: "Session deleted." });

  } catch (err) {
    next(err);
  }
};

export const saveMessage = async (req, res, next) => {
  try {
    const { sessionId, userMessage, aiMessage } = req.body;

    const chat = await getOrCreateChat(req.user.id, req.user.examMode);

    let session = null;

    if (sessionId) {
      session = chat.sessions.find((s) => s._id.toString() === sessionId);

      if (!session) {
        return res.status(404).json({ success: false, error: "Session not found." });
      }
    } else {
      chat.sessions.push({
        title:    generateTitle(userMessage.content),
        messages: [],
      });
      session = chat.sessions[chat.sessions.length - 1];
    }

    chat.activeSessionId = session._id;

    if (session.messages.length === 0) {
      const aiTitle = env.ENABLE_AI_CHAT_TITLES
        ? await generateChatTitle(userMessage.content)
        : null;
      session.title = aiTitle || generateTitle(userMessage.content);
    }

    session.messages.push(
      { role: "user", content: userMessage.content },
      { role: "ai",   content: aiMessage.content   }
    );

    await chat.save();

    return res.json({
      success:   true,
      sessionId: session._id,
      title:     session.title,
    });

  } catch (err) {
    next(err);
  }
};

export const toggleSaved = async (req, res, next) => {
  try {
    const { sessionId, messageId, saved } = req.body;

    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    const session = chat.sessions.find(
      (s) => s._id.toString() === sessionId
    );
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    const msg = session.messages.find(
      (m) => m._id.toString() === messageId
    );
    if (!msg) {
      return res.status(404).json({ success: false, error: "Message not found." });
    }

    msg.saved = saved;
    await chat.save();

    return res.json({ success: true, saved: msg.saved });

  } catch (err) {
    next(err);
  }
};

export const getSaved = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    }).lean();

    if (!chat) {
      return res.json({ success: true, saved: [] });
    }

    const saved = [];
    for (const session of chat.sessions) {
      for (const msg of session.messages) {
        if (msg.saved) {
          saved.push({
            ...msg,
            sessionId:    session._id,
            sessionTitle: session.title,
          });
        }
      }
    }

    saved.reverse();

    return res.json({ success: true, saved });

  } catch (err) {
    next(err);
  }
};