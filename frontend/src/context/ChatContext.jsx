// ============================================================
//  JNEET+ AI — context/ChatContext.jsx
//  Centralised chat state: sessions, messages, saved items.
//  Error-resilient: backend failures don't crash the UI.
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

export function ChatProvider({ children }) {
  const { examMode }  = useAuth();

  const [sessions,         setSessions]         = useState([]);
  const [activeSessionId,  setActiveSessionId]  = useState(null);
  const [messages,         setMessages]         = useState([]);
  const [savedItems,       setSavedItems]        = useState([]);
  const [isSessionsLoaded, setIsSessionsLoaded] = useState(false);
  const [isMsgLoading,     setIsMsgLoading]     = useState(false);  // initial msg load
  const [isStreaming,      setIsStreaming]       = useState(false);  // AI streaming
  const [streamingText,    setStreamingText]     = useState("");
  const [backendError,     setBackendError]      = useState(null);   // null = healthy

  const abortRef = useRef(null);
  const latestLoadRef = useRef(0);
  const activeSessionRef = useRef(null);

  const setActiveSession = useCallback((sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
    activeSessionRef.current = normalizedId;
    setActiveSessionId(normalizedId);
  }, []);

  // ── Load sessions + saved from backend ──────────────────
  const loadInitialData = useCallback(async () => {
    if (!examMode) return;

    setBackendError(null);
    const requestId = ++latestLoadRef.current;

    try {
      const [sessRes, savedRes] = await Promise.all([
        chatApi.getSessions(),
        chatApi.getSaved(),
      ]);

      if (requestId !== latestLoadRef.current) return;

      const loadedSessions = (sessRes.data.sessions ?? []).map((session) => ({
        ...session,
        _id: normalizeSessionId(session._id),
      }));

      setSessions(loadedSessions);
      setSavedItems(savedRes.data.saved    ?? []);
      setIsSessionsLoaded(true);

      // Restore last active session
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
      setIsSessionsLoaded(true);  // unblock skeleton even on error
      setIsMsgLoading(false);
    }
  }, [examMode, setActiveSession]);

  // ── Load a session's messages ────────────────────────────
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

  // ── Select a session ─────────────────────────────────────
  const selectSession = useCallback(async (sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
    if (!normalizedId || normalizedId === activeSessionRef.current) return;

    setActiveSession(normalizedId);
    setMessages([]);
    await loadSession(normalizedId);
  }, [loadSession, setActiveSession]);

  // ── New session ──────────────────────────────────────────
  const newSession = useCallback(async () => {
    try {
      const res = await chatApi.newSession();
      const sessionId = normalizeSessionId(res.data.sessionId);
      const sess = {
        _id:          sessionId,
        title:        res.data.title,
        messageCount: 0,
        lastMessage:  "",
        createdAt:    new Date().toISOString(),
      };
      setSessions((prev) => [sess, ...prev]);
      setActiveSession(sessionId);
      setMessages([]);
      return sessionId;
    } catch {
      toast.error("Naya chat nahi ban paya");
      return null;
    }
  }, [setActiveSession]);

  // ── Delete session ───────────────────────────────────────
  const deleteSession = useCallback(async (sessionId) => {
    const normalizedId = normalizeSessionId(sessionId);
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
      toast.error("Delete nahi ho paya");
    }
  }, [loadSession, sessions, setActiveSession]);

  // ── Send message with SSE streaming ─────────────────────
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt.trim() || isStreaming) return;

    // Optimistic user bubble
    const tempUserMsg = {
      _id:     `tmp-user-${Date.now()}`,
      role:    "user",
      content: prompt.trim(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamingText("");

    // Cancel any previous stream
    abortRef.current?.abort();

    let sessionIdToUse = activeSessionRef.current;

    abortRef.current = streamAsk(
      prompt.trim(),
      sessionIdToUse,
      {
        onToken: (_token, accumulated) => {
          setStreamingText(accumulated);
        },

        onDone: async (fullText) => {
          setIsStreaming(false);
          setStreamingText("");

          // Add final AI message
          const aiMsg = {
            _id:   `ai-${Date.now()}`,
            role:  "ai",
            content: fullText,
            saved: false,
          };
          setMessages((prev) => [...prev, aiMsg]);

          // Persist in background
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
              setActiveSession(sessionIdToUse);
              setSessions((prev) => {
                const exists = prev.find((s) => s._id === sessionIdToUse);
                if (exists) return prev;
                return [{
                  _id:          sessionIdToUse,
                  title:        newTitle || prompt.trim().slice(0, 50),
                  messageCount: 2,
                  lastMessage:  prompt.trim().slice(0, 60),
                  createdAt:    new Date().toISOString(),
                }, ...prev];
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
          }
        },

        onError: (errMsg) => {
          setIsStreaming(false);
          setStreamingText("");
          // Remove optimistic user bubble on error
          setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
          toast.error(errMsg || "AI se jawab nahi aaya");
        },
      }
    );
  }, [isStreaming, setActiveSession]);

  // ── Abort streaming ──────────────────────────────────────
  const abortStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText("");
  }, []);

  // ── Toggle saved on a message ────────────────────────────
  const toggleSaved = useCallback(async (msg) => {
    const nowSaved = !msg.saved;

    // Optimistic update
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
      toast.success("Concept save ho gaya ⭐");
    } else {
      setSavedItems((prev) => prev.filter((b) => b._id !== msg._id));
      toast("Remove ho gaya", { icon: "🗑️" });
    }

    try {
      await chatApi.toggleSaved({
        sessionId: activeSessionId,
        messageId: msg._id,
        saved:     nowSaved,
      });
    } catch {
      // Revert
      setMessages((prev) =>
        prev.map((m) => m._id === msg._id ? { ...m, saved: !nowSaved } : m)
      );
      setSavedItems((prev) =>
        nowSaved
          ? prev.filter((b) => b._id !== msg._id)
          : [{ ...msg, saved: true }, ...prev]
      );
      toast.error("Save nahi ho paya");
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
