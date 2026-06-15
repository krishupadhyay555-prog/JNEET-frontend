// ============================================================
//  JNEET+ AI — pages/AskAI.jsx  (Production v2.0)
//  SSE streaming, sidebar, scroll-to-bottom, retry on error.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth }           from "../context/AuthContext.jsx";
import { useChat }           from "../context/ChatContext.jsx";
import { Sidebar }           from "../components/sidebar/Sidebar.jsx";
import { MessageBubble }     from "../components/chat/MessageBubble.jsx";
import { StreamingBubble }   from "../components/chat/StreamingBubble.jsx";
import { ChatInput }         from "../components/chat/ChatInput.jsx";
import { EmptyChat }         from "../components/chat/EmptyChat.jsx";
import { BackendErrorBanner } from "../components/ui/BackendErrorBanner.jsx";
import { ChatSkeletons }     from "../components/ui/SkeletonLoader.jsx";
import { Bot, Menu, ChevronDown } from "lucide-react";

export default function AskAI() {
  const { user, examMode }    = useAuth();
  const {
    messages,
    isMsgLoading,
    isStreaming,
    streamingText,
    backendError,
    setBackendError,
    loadInitialData,
    sendMessage,
    abortStream,
    toggleSaved,
  } = useChat();

  const [prompt,        setPrompt]        = useState("");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef   = useRef(null);
  const messagesRef = useRef(null);

  // ── Load data on mount ───────────────────────────────────
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ── Scroll-to-bottom on new messages / streaming ────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  // ── Show scroll button when scrolled up ─────────────────
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Send ─────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!prompt.trim() || isStreaming) return;
    const text = prompt;
    setPrompt("");
    sendMessage(text);
  }, [prompt, isStreaming, sendMessage]);

  // ── Retry after backend error ────────────────────────────
  const handleRetry = useCallback(() => {
    setBackendError(null);
    loadInitialData();
  }, [setBackendError, loadInitialData]);

  return (
    <div className="flex h-screen bg-bg-base text-white overflow-hidden">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main chat area ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3.5
          border-b border-bg-border bg-bg-surface shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 hover:text-white transition p-1 rounded-lg
              hover:bg-bg-hover"
          >
            <Menu size={17} />
          </button>

          <div className="w-7 h-7 rounded-lg bg-violet-600/15 border border-violet-600/20
            flex items-center justify-center shrink-0">
            <Bot size={14} className="text-violet-400" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm">AI Mentor</span>
            <span className="ml-2 text-[10px] bg-violet-900/40 border border-violet-800/30
              text-violet-300 px-2 py-0.5 rounded-full font-medium">
              {examMode}
            </span>
          </div>

          <span className="text-xs text-gray-700 hidden sm:block">
            {user?.name?.split(" ")[0]}
          </span>
        </div>

        {/* ── Messages area ──────────────────────────────── */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
        >
          {/* Backend error — with retry button */}
          {backendError && (
            <BackendErrorBanner message={backendError} onRetry={handleRetry} />
          )}

          {/* Initial message skeleton */}
          {!backendError && isMsgLoading && <ChatSkeletons />}

          {/* Empty state */}
          {!backendError && !isMsgLoading && messages.length === 0 && !isStreaming && (
            <EmptyChat
              examMode={examMode}
              onPromptSelect={(q) => {
                setPrompt(q);
                // Auto-send after a brief visual tick
                setTimeout(() => sendMessage(q), 50);
              }}
            />
          )}

          {/* Rendered messages */}
          {!isMsgLoading && messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              msg={msg}
              onToggleSaved={toggleSaved}
            />
          ))}

          {/* Live streaming bubble */}
          {isStreaming && (
            <StreamingBubble text={streamingText} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && !backendError && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-[90px] right-5 bg-bg-card border border-bg-border
              text-gray-400 hover:text-white p-2 rounded-full shadow-card
              hover:bg-bg-hover transition animate-fade-in z-10"
          >
            <ChevronDown size={15} />
          </button>
        )}

        {/* Input area */}
        {!backendError && (
          <ChatInput
            value={prompt}
            onChange={setPrompt}
            onSend={handleSend}
            onAbort={abortStream}
            isStreaming={isStreaming}
            examMode={examMode}
          />
        )}
      </div>
    </div>
  );
}