// ============================================================
//  JNEET+ AI — controllers/chatController.js  (Production v2.0)
//  All chat business logic extracted from chatRoutes.js.
//  FIXES:
//    - "bookmarks" renamed to "saved" everywhere
//    - getOrCreateChat moved here as a private helper
//    - activeSessionId validated before assignment
//    - All routes use consistent response shapes
//    - No unbounded .find() calls — lean projections used
// ============================================================

import Chat from "../models/Chat.js";

// ── Private Helper: Get or create the user's Chat document ───
// Each user has ONE Chat document per examMode.
// Sessions and messages are embedded within it.
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
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

// ── GET /sessions — List all sessions (sidebar history) ──────
export const getSessions = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    })
      .select("sessions.title sessions.createdAt sessions.messages activeSessionId")
      .lean();

    if (!chat) {
      return res.json({ success: true, sessions: [], activeSessionId: null });
    }

    // Map to a lightweight session summary — do NOT send full message content
    const sessions = chat.sessions
      .map((s) => ({
        _id:          s._id,
        title:        s.title,
        messageCount: s.messages.length,
        createdAt:    s.createdAt,
        lastMessage:  s.messages[s.messages.length - 1]?.content?.slice(0, 80) || "",
      }))
      .reverse(); // Most recent first

    return res.json({
      success: true,
      sessions,
      activeSessionId: chat.activeSessionId,
    });

  } catch (err) {
    next(err);
  }
};

// ── GET /session/:sessionId — Get full messages for a session ─
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

// ── POST /session/new — Create a new chat session ────────────
export const newSession = async (req, res, next) => {
  try {
    const chat = await getOrCreateChat(req.user.id, req.user.examMode);

    // Push new session
    chat.sessions.push({ title: "New Chat", messages: [] });
    const created = chat.sessions[chat.sessions.length - 1];

    // Validate the new session was actually created before assigning
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

// ── DELETE /session/:sessionId — Delete a session ────────────
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

    // If active session was deleted, clear the pointer
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

// ── POST /message/save — Persist a user+AI message pair ──────
// Called after a successful AI response to persist the exchange.
export const saveMessage = async (req, res, next) => {
  try {
    // req.body validated by validate(saveMessageSchema)
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
        title:    userMessage.content.slice(0, 50),
        messages: [],
      });
      session = chat.sessions[chat.sessions.length - 1];
      chat.activeSessionId = session._id;
    }

    // Set session title from first user message
    if (session.messages.length === 0) {
      session.title = userMessage.content.slice(0, 50) + (
        userMessage.content.length > 50 ? "…" : ""
      );
    }

    // Push both messages atomically in a single push
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

// ── PATCH /message/save-toggle — Toggle saved on a message ───
// RENAMED: was "bookmark" — now "saved" at schema + API level.
export const toggleSaved = async (req, res, next) => {
  try {
    // req.body validated by validate(toggleSavedSchema)
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

// ── GET /saved — Get all saved messages ──────────────────────
// RENAMED: was "/bookmarks" — now "/saved" at route + controller level.
export const getSaved = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      userId:   req.user.id,
      examMode: req.user.examMode,
    }).lean();

    if (!chat) {
      return res.json({ success: true, saved: [] });
    }

    // Collect all saved messages across all sessions
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

    // Most recent first
    saved.reverse();

    return res.json({ success: true, saved });

  } catch (err) {
    next(err);
  }
};
