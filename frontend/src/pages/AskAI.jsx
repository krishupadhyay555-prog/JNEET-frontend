// ============================================================
//  JNEET+ AI — pages/AskAI.jsx  (v3 — sidebar toggle everywhere)
//  CHANGED:
//    - The header's Menu button was `md:hidden` (mobile-only) and
//      only ever OPENED the sidebar (`setSidebarOpen(true)`) — on
//      desktop there was no way to close/reopen it at all. Now the
//      button shows on every screen size and TOGGLES
//      (`setSidebarOpen(v => !v)`), working together with
//      Sidebar.jsx's new desktop-width-collapse support.
//    - sidebarOpen's initial state now checks window width once on
//      mount: desktop (≥768px) starts OPEN (matches the old
//      always-visible desktop behavior), mobile starts CLOSED
//      (matches the old mobile-overlay default) — so nothing about
//      the default look changes on either device, only the new
//      ability to toggle on desktop is added.
//  Nothing else in this file changed — same message loading, same
//  scroll-button logic, same send/abort flow.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth }           from "../context/AuthContext.jsx";
import { useChat }           from "../context/ChatContext.jsx";
import { useTheme }          from "../context/ThemeContext.jsx";
import { Sidebar }           from "../components/sidebar/Sidebar.jsx";
import { MessageBubble }     from "../components/chat/MessageBubble.jsx";
import { StreamingBubble }   from "../components/chat/StreamingBubble.jsx";
import { ChatInput }         from "../components/chat/ChatInput.jsx";
import { EmptyChat }         from "../components/chat/EmptyChat.jsx";
import { BackendErrorBanner } from "../components/ui/BackendErrorBanner.jsx";
import { ChatSkeletons }     from "../components/ui/SkeletonLoader.jsx";
import { ProfileMenu }       from "../components/ProfileMenu.jsx";
import { Menu, ChevronDown, Sun, Moon } from "lucide-react";

export default function AskAI() {
  const { examMode }    = useAuth();
  const { mode, toggleMode } = useTheme();
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
  // Desktop starts open (old default), mobile starts closed (old
  // default) — checked once on mount, matches previous visual
  // behavior exactly while adding the new toggle capability.
  const [sidebarOpen,   setSidebarOpen]   = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef   = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

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

  const handleSend = useCallback(() => {
    if (!prompt.trim() || isStreaming) return;
    const text = prompt;
    setPrompt("");
    sendMessage(text);
  }, [prompt, isStreaming, sendMessage]);

  const handleRetry = useCallback(() => {
    setBackendError(null);
    loadInitialData();
  }, [setBackendError, loadInitialData]);

  return (
    <div className="flex h-screen bg-bg-base text-fg-primary overflow-hidden chat-shell">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-bg-border bg-bg-surface/80 backdrop-blur-xl shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-gray-600 hover:text-fg-primary transition p-1 rounded-lg
              hover:bg-bg-hover"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={17} />
          </button>

          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm">AI Mentor</span>
            <span className="ml-2 text-[10px] bg-violet-600/15 border border-violet-600/25
              text-fg-primary px-2 py-0.5 rounded-full font-medium">
              {examMode}
            </span>
          </div>

          {/* Dark/Light toggle — right here in chat, so switching
              theme never requires leaving the page (previously the
              only way was Settings, which used to force-navigate
              back to Dashboard instead of wherever the student
              actually came from). */}
          <button
            onClick={toggleMode}
            className="text-gray-600 hover:text-fg-primary transition p-1.5 rounded-lg
              hover:bg-bg-hover shrink-0"
            title={mode === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <ProfileMenu />
        </div>

        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 py-6 space-y-5 chat-scroll"
        >
          {backendError && (
            <BackendErrorBanner message={backendError} onRetry={handleRetry} />
          )}

          {!backendError && isMsgLoading && <ChatSkeletons />}

          {!backendError && !isMsgLoading && messages.length === 0 && !isStreaming && (
            <EmptyChat
              examMode={examMode}
              onPromptSelect={(q) => {
                setPrompt(q);
                setTimeout(() => sendMessage(q), 50);
              }}
            />
          )}

          {!isMsgLoading && messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              msg={msg}
              onToggleSaved={toggleSaved}
            />
          ))}

          {isStreaming && (
            <StreamingBubble text={streamingText} />
          )}

          <div ref={bottomRef} />
        </div>

        {showScrollBtn && !backendError && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-[90px] right-5 bg-bg-card/80 border border-bg-border backdrop-blur-xl text-gray-400 hover:text-fg-primary p-2 rounded-full shadow-card hover:bg-bg-hover transition animate-fade-in z-10"
          >
            <ChevronDown size={15} />
          </button>
        )}

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