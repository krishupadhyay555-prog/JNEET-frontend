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
  createContext, useContext, useState, useCallback, useRef,
} from "react";
import { chatApi }  from "../api/chatApi.js";
import { streamAsk } from "../api/aiApi.js";
import { useAuth }  from "./AuthContext.jsx";
import toast        from "react-hot-toast";

const ChatContext = createContext(null);

function normalizeSessionId(id) {
  if (!id) return null;
  return id.toString();
}

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

  const abortRef = useRef(null);
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
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt.trim() || isStreaming) return;

    const tempUserMsg = {
      _id:     `tmp-user-${Date.now()}`,
      role:    "user",
      content: prompt.trim(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamingText("");

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

    abortRef.current = streamAsk(
      prompt.trim(),
      sessionIdToUse,
      {
        onToken: (_token, accumulated) => {
          if (!belongsToActiveSession()) return;
          setStreamingText(accumulated);
        },

        onDone: async (fullText) => {
          const stillActive = belongsToActiveSession();

          if (stillActive) {
            setIsStreaming(false);
            setStreamingText("");

            const aiMsg = {
              _id:   `ai-${Date.now()}`,
              role:  "ai",
              content: fullText,
              saved: false,
            };
            setMessages((prev) => [...prev, aiMsg]);
          }

          try {
            const saveRes = await chatApi.saveMessage({
              sessionId:   sessionIdToUse,
              userMessage: { content: prompt.trim() },
              aiMessage:   { content: fullText },
            });

            const newSessId = saveRes.data.sessionId;
            const newTitle  = saveRes.data.title;

            if (!sessionIdToUse && newSessId) {
              sessionIdToUse = normalizeSessionId(newSessId);
              if (stillActive) setActiveSession(sessionIdToUse);
              setSessions((prev) => {
                const exists = prev.find((s) => s._id === sessionIdToUse);
                if (exists) return prev;
                return sortSessions([{
                  _id:          sessionIdToUse,
                  title:        newTitle || prompt.trim().slice(0, 50),
                  messageCount: 2,
                  lastMessage:  prompt.trim().slice(0, 60),
                  pinned:       false,
                  pinnedAt:     null,
                  createdAt:    new Date().toISOString(),
                }, ...prev]);
              });
            } else if (newTitle) {
              setSessions((prev) =>
                prev.map((s) => s._id === sessionIdToUse
                  ? { ...s, title: newTitle, messageCount: s.messageCount + 2 }
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
        },

        onError: (errMsg) => {
          if (streamSessionRef.current === streamOwnerSessionId) {
            streamSessionRef.current = null;
          }
          if (!belongsToActiveSession()) return;
          setIsStreaming(false);
          setStreamingText("");
          setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
          toast.error(errMsg || "AI could not respond");
        },
      }
    );
  }, [isStreaming, setActiveSession]);

  const abortStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText("");
    streamSessionRef.current = null;
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
    loadInitialData,
    loadSession,
    selectSession,
    newSession,
    deleteSession,
    renameSession,
    togglePin,
    sendMessage,
    abortStream,
    toggleSaved,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}