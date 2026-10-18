// ============================================================
//  JNEET+ AI — context/ChatContext.jsx  (v2.4 — fixed AI reply
//  leaking into a different chat)
//  FIXED (root cause of "answer shows in the wrong/new chat, then
//  disappears"): messages/isStreaming/streamingText are global
//  state, not scoped to a specific session. If a student switched
//  chats or hit "New Chat" WHILE the AI was still streaming a
//  reply, the in-flight stream's callbacks kept firing and:
//    - onToken kept overwriting streamingText, which now rendered
//      inside whichever chat the student had switched TO (wrong
//      chat showing someone else's answer mid-type)
//    - onDone then forcibly called setActiveSession() back to the
//      ORIGINAL chat — but never re-fetched that chat's messages,
//      so the reply appeared to "flash and vanish" on the next
//      render/navigation.
//  FIX: both selectSession() and newSession() now call
//  abortStream() first if a stream is in-flight — switching chats
//  or starting a new one always cleanly cancels the previous
//  stream instead of letting it run across a session boundary.
//  A toast tells the student their in-progress answer was
//  interrupted, so it's not a silent mystery. As defense-in-depth
//  (abort() may take a tick to actually stop the network stream),
//  sendMessage's callbacks now also capture the session ID the
//  stream belongs to and skip touching messages/streamingText if
//  the active session has since changed — the answer is still
//  saved to the CORRECT original session in the backend either
//  way, it just won't render into the wrong place on screen.
//  Everything else — session load/save/delete/rename/pin, saved-
//  toggle — UNCHANGED from v2.3.
// ============================================================

import {
  createContext, useContext, useState, useCallback, useRef, useEffect,
} from "react";
import { chatApi }  from "../api/chatApi.js";
import { streamAsk, aiApi } from "../api/aiApi.js";
import { useAuth }  from "./AuthContext.jsx";
import toast        from "react-hot-toast";

const ChatContext = createContext(null);

function normalizeSessionId(id) {
  if (!id) return null;
  return id.toString();
}

// Real (saved) message ids are 24-char Mongo ids; anything else is a local placeholder.
const isServerId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

function sortSessions(list) {
  const pinned = list
    .filter((s) => s.pinned)
    .sort((a, b) => new Date(b.pinnedAt || 0) - new Date(a.pinnedAt || 0));
  const unpinned = list.filter((s) => !s.pinned);
  return [...pinned, ...unpinned];
}

export function ChatProvider({ children }) {
  const { examMode }  = useAuth();

  const [sessions,         setSessions]         = useState([]);
  const [activeSessionId,  setActiveSessionId]  = useState(null);
  const [messages,         setMessages]         = useState([]);
  const [savedItems,       setSavedItems]        = useState([]);
  const [isSessionsLoaded, setIsSessionsLoaded] = useState(false);
  const [isMsgLoading,     setIsMsgLoading]     = useState(false);
  const [isStreaming,      setIsStreaming]       = useState(false);
  const [streamingText,    setStreamingText]     = useState("");
  const [backendError,     setBackendError]      = useState(null);
  // { remaining, limit, resetsAt } for today's AI doubts (null = unknown yet)
  const [usage,            setUsage]             = useState(null);
  // Why the AI can't answer right now: { code, message, resetsAt?, limit? }
  const [aiNotice,         setAiNotice]          = useState(null);
  // A prompt that failed to send, handed back so the student doesn't retype it
  const [failedPrompt,     setFailedPrompt]      = useState(null);

  const abortRef = useRef(null);
  const messagesRef = useRef([]);
  // Latest partial answer of the stream in flight (so "Stop" keeps what was written)
  const partialRef = useRef(null);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  const latestLoadRef = useRef(0);
  const activeSessionRef = useRef(null);
  // Which session the CURRENTLY in-flight stream belongs to — used
  // to detect "user navigated away mid-stream" in the callbacks below.
  const streamSessionRef = useRef(null);

  const setActiveSession = useCallback((sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
    activeSessionRef.current = normalizedId;
    setActiveSessionId(normalizedId);
  }, []);

  const loadInitialData = useCallback(async () => {
    if (!examMode) return;

    setBackendError(null);
    const requestId = ++latestLoadRef.current;

    try {
      const [sessResult, savedResult] = await Promise.allSettled([
        chatApi.getSessions(),
        chatApi.getSaved(),
      ]);

      if (requestId !== latestLoadRef.current) return;

      if (sessResult.status === "rejected") {
        throw sessResult.reason;
      }
      const sessRes = sessResult.value;

      const savedRes = savedResult.status === "fulfilled"
        ? savedResult.value
        : { data: { saved: [] } };

      if (savedResult.status === "rejected") {
        console.warn("[Chat] Failed to load saved items:", savedResult.reason?.message);
      }

      // Non-blocking: today's remaining AI doubts
      aiApi.usage()
        .then((r) => {
          const d = r.data?.daily;
          if (d) setUsage({ remaining: d.remaining, limit: d.limit, resetsAt: d.resetsAt });
          if (r.data?.aiLocked) setAiNotice((n) => n ?? { code: "PARENT_CONSENT_REQUIRED", message: "Your parent or guardian needs to approve your account before you can use the AI mentor." });
        })
        .catch(() => { /* usage is a nicety; the chat works without it */ });

      const loadedSessions = (sessRes.data.sessions ?? [])
        .map((session) => ({
          ...session,
          _id: normalizeSessionId(session._id),
        }))
        .filter((session) => session._id);

      setSessions(loadedSessions);
      setSavedItems(savedRes.data.saved    ?? []);
      setIsSessionsLoaded(true);

      const lastId = normalizeSessionId(sessRes.data.activeSessionId);
      const canRestore = lastId && loadedSessions.some((session) => session._id === lastId);

      if (canRestore && !activeSessionRef.current) {
        setActiveSession(lastId);
        setIsMsgLoading(true);
        const sessionRes = await chatApi.getSession(lastId);
        if (
          requestId === latestLoadRef.current &&
          activeSessionRef.current === lastId
        ) {
          setMessages(sessionRes.data.session?.messages ?? []);
          setIsMsgLoading(false);
        }
      } else if (!canRestore && !activeSessionRef.current) {
        setMessages([]);
      }
    } catch (err) {
      const msg = err.isNetworkError
        ? "Cannot reach the server. Is the backend running?"
        : err.response?.data?.error ?? "Failed to load chat history.";
      setBackendError(msg);
      setIsSessionsLoaded(true);
      setIsMsgLoading(false);
    }
  }, [examMode, setActiveSession]);

  const loadSession = useCallback(async (sessionId, existingRequestId = null) => {
    const normalizedId = normalizeSessionId(sessionId);
    if (!normalizedId) return;

    const requestId = existingRequestId ?? ++latestLoadRef.current;

    setIsMsgLoading(true);
    try {
      const res = await chatApi.getSession(normalizedId);
      if (
        requestId !== latestLoadRef.current ||
        activeSessionRef.current !== normalizedId
      ) {
        return;
      }

      setMessages(res.data.session?.messages ?? []);
    } catch {
      if (
        requestId === latestLoadRef.current &&
        activeSessionRef.current === normalizedId
      ) {
        setMessages([]);
      }
    } finally {
      if (
        requestId === latestLoadRef.current &&
        activeSessionRef.current === normalizedId
      ) {
        setIsMsgLoading(false);
      }
    }
  }, []);

  // ── NEW: cleanly cancel an in-flight stream before navigating
  // away from the chat it belongs to. Warns the student rather
  // than silently dropping their answer. ─────────────────────────
  const interruptStreamIfAny = useCallback(() => {
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
      setStreamingText("");
      streamSessionRef.current = null;
      toast("Switched chats — the previous answer was stopped.", { icon: "i" });
    }
  }, [isStreaming]);

  const selectSession = useCallback(async (sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
    if (!normalizedId || normalizedId === activeSessionRef.current) return;

    interruptStreamIfAny();

    setActiveSession(normalizedId);
    setMessages([]);
    await loadSession(normalizedId);

    chatApi.activateSession(normalizedId).catch(() => {});
  }, [loadSession, setActiveSession, interruptStreamIfAny]);

  const newSession = useCallback(async () => {
    interruptStreamIfAny();

    try {
      const res = await chatApi.newSession();
      const sessionId = normalizeSessionId(res.data.sessionId);

      if (!sessionId) {
        toast.error("Could not create a new chat");
        return null;
      }

      const sess = {
        _id:          sessionId,
        title:        res.data.title,
        messageCount: 0,
        lastMessage:  "",
        pinned:       false,
        pinnedAt:     null,
        createdAt:    new Date().toISOString(),
      };
      setSessions((prev) => sortSessions([sess, ...prev]));
      setActiveSession(sessionId);
      setMessages([]);
      return sessionId;
    } catch {
      toast.error("Could not create a new chat");
      return null;
    }
  }, [setActiveSession, interruptStreamIfAny]);

  const deleteSession = useCallback(async (sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);

    if (!normalizedId) {
      setSessions((prev) => prev.filter((s) => normalizeSessionId(s._id)));
      return;
    }

    // Deleting the session currently streaming into would leave a
    // dangling reference — cancel first, same as switching away.
    if (streamSessionRef.current === normalizedId) {
      interruptStreamIfAny();
    }

    try {
      await chatApi.deleteSession(normalizedId);
      const remaining = sessions.filter((s) => s._id !== normalizedId);
      setSessions(remaining);

      if (activeSessionRef.current === normalizedId) {
        const nextActiveId = remaining[0]?._id ?? null;
        setActiveSession(nextActiveId);

        if (nextActiveId) {
          await loadSession(nextActiveId);
        } else {
          setMessages([]);
        }
      }
    } catch {
      toast.error("Could not delete chat");
    }
  }, [loadSession, sessions, setActiveSession, interruptStreamIfAny]);

  const renameSession = useCallback(async (sessionId, newTitle) => {
    const normalizedId = normalizeSessionId(sessionId);
    const trimmed = newTitle?.trim();
    if (!normalizedId || !trimmed) return;

    const prevSessions = sessions;
    setSessions((prev) =>
      prev.map((s) => s._id === normalizedId ? { ...s, title: trimmed } : s)
    );

    try {
      await chatApi.renameSession(normalizedId, trimmed);
    } catch {
      setSessions(prevSessions);
      toast.error("Could not rename this chat");
    }
  }, [sessions]);

  const togglePin = useCallback(async (sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
    if (!normalizedId) return;

    const prevSessions = sessions;
    const optimistic = sessions.map((s) =>
      s._id === normalizedId
        ? { ...s, pinned: !s.pinned, pinnedAt: !s.pinned ? new Date().toISOString() : null }
        : s
    );
    setSessions(sortSessions(optimistic));

    try {
      await chatApi.togglePin(normalizedId);
    } catch {
      setSessions(prevSessions);
      toast.error("Could not update pin");
    }
  }, [sessions]);

  // ── Send message with SSE streaming ─────────────────────
  // opts.truncateFromId: regenerate / edit — the turn starting at this (saved)
  // user message is replaced by the new one. The old turn is only removed on
  // the server once the new answer has arrived, so a failure loses nothing.
  const sendMessage = useCallback(async (prompt, opts = {}) => {
    const text = prompt?.trim();
    if (!text || isStreaming) return;
    const truncateFromId = isServerId(opts.truncateFromId) ? opts.truncateFromId : null;

    const backup = messagesRef.current;
    const tempKey = `tmp-${Date.now()}`;
    const tempUserMsg = { _id: `tmp-user-${tempKey}`, key: `u-${tempKey}`, role: "user", content: text };
    const tempAiId = `tmp-ai-${tempKey}`;

    setMessages((prev) => {
      if (!truncateFromId) return [...prev, tempUserMsg];
      const at = prev.findIndex((m) => m._id === truncateFromId);
      return [...(at >= 0 ? prev.slice(0, at) : prev), tempUserMsg];
    });
    setIsStreaming(true);
    setStreamingText("");
    setAiNotice(null);
    setFailedPrompt(null);

    abortRef.current?.abort();

    let sessionIdToUse = activeSessionRef.current;
    // Snapshot which session THIS stream belongs to — every callback
    // below checks this against the (possibly-changed) active session
    // before touching any UI-visible state.
    const streamOwnerSessionId = sessionIdToUse;
    streamSessionRef.current = streamOwnerSessionId;

    const belongsToActiveSession = () =>
      streamSessionRef.current === streamOwnerSessionId &&
      activeSessionRef.current === streamOwnerSessionId;

    // Shared by a normal finish and by "Stop" (which keeps the partial answer).
    const finalize = async (fullText, newUsage) => {
      partialRef.current = null;
      const stillActive = belongsToActiveSession();
      if (newUsage) setUsage(newUsage);

      if (stillActive) {
        setIsStreaming(false);
        setStreamingText("");
        setMessages((prev) => [...prev, { _id: tempAiId, key: `a-${tempKey}`, role: "ai", content: fullText, saved: false, feedback: null }]);
      }

      try {
        if (truncateFromId && sessionIdToUse) {
          await chatApi.truncate(sessionIdToUse, truncateFromId);
        }
        const saveRes = await chatApi.saveMessage({
          sessionId:   sessionIdToUse,
          userMessage: { content: text },
          aiMessage:   { content: fullText },
        });

        const { sessionId: newSessId, title: newTitle, userMessageId, aiMessageId } = saveRes.data;

        // Swap placeholders for the real ids so save / feedback / regenerate / edit work.
        if (userMessageId || aiMessageId) {
          setMessages((prev) => prev.map((m) => {
            if (m._id === tempUserMsg._id && userMessageId) return { ...m, _id: userMessageId };
            if (m._id === tempAiId && aiMessageId) return { ...m, _id: aiMessageId };
            return m;
          }));
        }

        if (!sessionIdToUse && newSessId) {
          sessionIdToUse = normalizeSessionId(newSessId);
          if (stillActive) setActiveSession(sessionIdToUse);
          setSessions((prev) => {
            const exists = prev.find((s) => s._id === sessionIdToUse);
            if (exists) return prev;
            return sortSessions([{
              _id:          sessionIdToUse,
              title:        newTitle || text.slice(0, 50),
              messageCount: 2,
              lastMessage:  text.slice(0, 60),
              pinned:       false,
              pinnedAt:     null,
              createdAt:    new Date().toISOString(),
            }, ...prev]);
          });
        } else if (newTitle) {
          setSessions((prev) =>
            prev.map((s) => s._id === sessionIdToUse
              ? { ...s, title: newTitle, lastMessage: text.slice(0, 60), messageCount: truncateFromId ? s.messageCount : s.messageCount + 2 }
              : s
            )
          );
        }
      } catch (saveErr) {
        console.warn("[Chat] Save failed:", saveErr.message);
        if (stillActive) {
          toast.error(
            "This reply couldn't be saved — it may disappear on refresh.",
            { duration: 6000 }
          );
        }
      } finally {
        if (streamSessionRef.current === streamOwnerSessionId) {
          streamSessionRef.current = null;
        }
      }
    };

    partialRef.current = null;
    abortRef.current = streamAsk(
      text,
      sessionIdToUse,
      {
        onToken: (_token, accumulated) => {
          partialRef.current = { text: accumulated, finalize };
          if (!belongsToActiveSession()) return;
          setStreamingText(accumulated);
        },

        onDone: finalize,

        onError: (errMsg, info = {}) => {
          partialRef.current = null;
          if (streamSessionRef.current === streamOwnerSessionId) {
            streamSessionRef.current = null;
          }
          if (!belongsToActiveSession()) return;
          setIsStreaming(false);
          setStreamingText("");
          if (truncateFromId) {
            setMessages(backup);            // nothing was lost: put the old turn back
          } else {
            setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
            setFailedPrompt({ text, nonce: Date.now() });
          }

          if (info.code === "DAILY_LIMIT") {
            setUsage({ remaining: 0, limit: info.limit ?? null, resetsAt: info.resetsAt ?? null });
            setAiNotice({ code: info.code, message: errMsg, resetsAt: info.resetsAt ?? null, limit: info.limit ?? null });
          } else if (["PARENT_CONSENT_REQUIRED", "AI_BUSY", "AI_NOT_CONFIGURED"].includes(info.code)) {
            setAiNotice({ code: info.code, message: errMsg });
          } else {
            toast.error(errMsg || "The AI mentor couldn't respond. Please try again.");
          }
        },
      },
      { replaceFromMessageId: truncateFromId }
    );
  }, [isStreaming, setActiveSession]);

  // Stop: keep whatever was already written (like Claude / ChatGPT) and save it.
  const abortStream = useCallback(() => {
    const partial = partialRef.current;
    abortRef.current?.abort();
    if (partial?.text?.trim()) {
      partial.finalize(partial.text, null);
    } else {
      partialRef.current = null;
      setIsStreaming(false);
      setStreamingText("");
      streamSessionRef.current = null;
    }
  }, []);

  // Regenerate the answer to the user message before this AI message.
  const regenerate = useCallback((aiMsgId) => {
    const list = messagesRef.current;
    const i = list.findIndex((m) => m._id === aiMsgId);
    let j = i - 1;
    while (j >= 0 && list[j].role !== "user") j--;
    if (i < 0 || j < 0) return;
    if (!isServerId(list[j]._id)) { toast("Hold on — still saving this chat. Try again in a moment."); return; }
    sendMessage(list[j].content, { truncateFromId: list[j]._id });
  }, [sendMessage]);

  // Edit a sent question: the conversation continues from the edited version.
  const editMessage = useCallback((userMsgId, newText) => {
    const msg = messagesRef.current.find((m) => m._id === userMsgId);
    const text = newText?.trim();
    if (!msg || !text || text === msg.content) return;
    if (!isServerId(msg._id)) { toast("Hold on — still saving this chat. Try again in a moment."); return; }
    sendMessage(text, { truncateFromId: msg._id });
  }, [sendMessage]);

  // 👍 / 👎 on an AI answer (tap again to clear).
  const setFeedback = useCallback(async (msg, value) => {
    if (!isServerId(msg._id) || !activeSessionRef.current) { toast("Hold on — still saving this reply."); return; }
    const next = msg.feedback === value ? null : value;
    setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, feedback: next } : m));
    try {
      await chatApi.setFeedback({ sessionId: activeSessionRef.current, messageId: msg._id, value: next });
      if (next) toast.success(next === "up" ? "Thanks for the feedback" : "Thanks — we'll use it to improve", { duration: 1800 });
    } catch {
      setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, feedback: msg.feedback ?? null } : m));
      toast.error("Couldn't save feedback");
    }
  }, []);

  const toggleSaved = useCallback(async (msg) => {
    const nowSaved = !msg.saved;

    setMessages((prev) =>
      prev.map((m) => m._id === msg._id ? { ...m, saved: nowSaved } : m)
    );

    if (nowSaved) {
      setSavedItems((prev) => [{
        ...msg,
        saved:        true,
        sessionId:    activeSessionId,
        sessionTitle: sessions.find((s) => s._id === activeSessionId)?.title ?? "Chat",
      }, ...prev]);
      toast.success("Saved ⭐");
    } else {
      setSavedItems((prev) => prev.filter((b) => b._id !== msg._id));
      toast("Removed", { icon: "🗑️" });
    }

    try {
      await chatApi.toggleSaved({
        sessionId: activeSessionId,
        messageId: msg._id,
        saved:     nowSaved,
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) => m._id === msg._id ? { ...m, saved: !nowSaved } : m)
      );
      setSavedItems((prev) =>
        nowSaved
          ? prev.filter((b) => b._id !== msg._id)
          : [{ ...msg, saved: true }, ...prev]
      );
      toast.error("Could not save");
    }
  }, [activeSessionId, sessions]);

  const value = {
    sessions, setSessions,
    activeSessionId, setActiveSessionId: setActiveSession,
    messages, setMessages,
    savedItems,
    isSessionsLoaded,
    isMsgLoading,
    isStreaming,
    streamingText,
    backendError, setBackendError,
    usage, aiNotice, setAiNotice, failedPrompt, setFailedPrompt,
    loadInitialData,
    loadSession,
    selectSession,
    newSession,
    deleteSession,
    renameSession,
    togglePin,
    sendMessage,
    abortStream,
    regenerate,
    editMessage,
    setFeedback,
    toggleSaved,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}