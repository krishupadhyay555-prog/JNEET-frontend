// ============================================================
//  JNEET+ AI — pages/AskAI.jsx  (v4 — hover-rail sidebar, message actions)
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
import { useMediaQuery }     from "../hooks/useMediaQuery.js";
import { useChat }           from "../context/ChatContext.jsx";
import { useTheme }          from "../context/ThemeContext.jsx";
import { Sidebar }           from "../components/sidebar/Sidebar.jsx";
import { MessageBubble }     from "../components/chat/MessageBubble.jsx";
import { StreamingBubble }   from "../components/chat/StreamingBubble.jsx";
import { ChatInput }         from "../components/chat/ChatInput.jsx";
import { EmptyChat }         from "../components/chat/EmptyChat.jsx";
import { AiNotice }          from "../components/chat/AiNotice.jsx";
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
    usage,
    aiNotice,
    setAiNotice,
    failedPrompt,
    loadInitialData,
    sendMessage,
    abortStream,
    toggleSaved,
    regenerate,
    editMessage,
    setFeedback,
  } = useChat();

  const [prompt,        setPrompt]        = useState("");
  // Desktop starts open (old default), mobile starts closed (old
  // default) — checked once on mount, matches previous visual
  // behavior exactly while adding the new toggle capability.
  // Desktop: a slim rail that opens when the cursor touches it; "pinned" keeps it
  // open (remembered on this device). Mobile: a slide-over drawer.
  const [pinned, setPinned] = useState(() => {
    try { return localStorage.getItem("jneet.sidebar.pinned") === "1"; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const togglePinned = useCallback(() => {
    setPinned((v) => {
      try { localStorage.setItem("jneet.sidebar.pinned", v ? "0" : "1"); } catch { /* storage blocked */ }
      return !v;
    });
  }, []);
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

  // A prompt that couldn't be sent comes back into the box (nothing to retype).
  // Derived during render (not in an effect) keyed on the failure's nonce.
  const [seenFailNonce, setSeenFailNonce] = useState(null);
  if (failedPrompt && failedPrompt.nonce !== seenFailNonce) {
    setSeenFailNonce(failedPrompt.nonce);
    if (!prompt.trim()) setPrompt(failedPrompt.text);
  }

  // When the last free doubt is used, say so right away (not only on the next failed send).
  const limitReached = usage?.limit != null && usage.remaining === 0;
  const notice = aiNotice ?? (limitReached ? { code: "DAILY_LIMIT", limit: usage.limit, resetsAt: usage.resetsAt } : null);

  const blocked = aiNotice?.code === "PARENT_CONSENT_REQUIRED" || (usage?.limit != null && usage.remaining === 0);

  const handleSend = useCallback(() => {
    if (!prompt.trim() || isStreaming || blocked) return;
    const text = prompt;
    setPrompt("");
    sendMessage(text);
  }, [prompt, isStreaming, blocked, sendMessage]);

  const handleRetry = useCallback(() => {
    setBackendError(null);
    loadInitialData();
  }, [setBackendError, loadInitialData]);

  return (
    <div className="flex h-screen bg-bg-base text-fg-primary overflow-hidden chat-shell">

      <Sidebar pinned={pinned} onTogglePin={togglePinned} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-bg-border bg-bg-surface/80 backdrop-blur-xl shrink-0">
          <button
            onClick={() => (isDesktop ? togglePinned() : setMobileOpen(true))}
            className="text-gray-600 hover:text-fg-primary transition p-1.5 rounded-lg
              hover:bg-bg-hover active:scale-90 md:hidden"
            title="Open sidebar"
            aria-label="Open sidebar"
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
              onPromptSelect={(q) => { if (!blocked) sendMessage(q); }}
            />
          )}

          {!isMsgLoading && messages.map((msg, i) => (
            <MessageBubble
              key={msg.key || msg._id}
              msg={msg}
              isLastAi={msg.role === "ai" && i === messages.length - 1}
              busy={isStreaming}
              onToggleSaved={toggleSaved}
              onRegenerate={regenerate}
              onEdit={editMessage}
              onFeedback={setFeedback}
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

        {!backendError && notice && (
          <div className="px-3 sm:px-4 shrink-0">
            <AiNotice notice={notice} onDismiss={aiNotice ? () => setAiNotice(null) : undefined} />
          </div>
        )}

        {!backendError && (
          <ChatInput
            usage={usage}
            blocked={blocked}
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