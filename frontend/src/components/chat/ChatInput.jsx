// ============================================================
//  JNEET+ AI — components/chat/ChatInput.jsx  (v3 — theme-aware colors)
//  FIXED (leftover hardcoded dark-only colors):
//    - Input wrapper used `bg-white/[0.035]` — a near-invisible
//      white overlay, designed assuming a dark page behind it. On
//      a light-mode page (white-on-white) this produced almost no
//      visible input-box distinction at all. Changed to bg-bg-panel
//      (a real theme token — solid, correct contrast in every mode).
//    - Send button's disabled state used hardcoded
//      `disabled:bg-[#1a1a2e] disabled:text-[#3a3a5a]` — these are
//      literally the dark-mode background/border hex values, so a
//      disabled button in light mode would render as a near-black
//      box. Now uses bg-bg-hover / text-gray-400 (theme tokens).
//    - The focus/streaming glow used a hardcoded terracotta rgba —
//      now uses var(--violet-glow), so it correctly tints
//      green/blue/gray depending on the active accent skin instead
//      of always glowing orange.
//  Everything else — auto-resize logic, send/abort behavior — is
//  UNCHANGED.
// ============================================================

import { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

export function ChatInput({ value, onChange, onSend, onAbort, isStreaming, examMode }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 160);
    el.style.height = newHeight + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) onSend();
    }
  };

  const subjects = examMode === "NEET"
    ? "Physics · Chemistry · Biology"
    : "Physics · Chemistry · Maths";

  return (
    <div className="shrink-0 px-3 sm:px-4 py-4 border-t border-bg-border bg-bg-surface/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <div
          className={`flex gap-2 items-end rounded-2xl px-4 py-3 bg-bg-panel backdrop-blur-xl
            border transition-all duration-200 shadow-[0_12px_40px_rgba(0,0,0,0.16)]
            ${isStreaming
              ? "border-violet-500/50 shadow-[0_0_0_2px_var(--violet-glow)] animate-pulse-soft"
              : "border-bg-border focus-within:border-violet-500/50 focus-within:shadow-[0_0_0_2px_var(--violet-glow)]"
            }`}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-fg-primary placeholder-gray-500
              resize-none focus:outline-none text-[0.875rem] leading-[1.6]
              min-h-[22px] max-h-40 font-sans tracking-[0.002em]"
            placeholder={`Ask a ${examMode} question... (Enter = Send, Shift+Enter = New line)`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          {isStreaming ? (
            <button
              onClick={onAbort}
              className="bg-red-500/10 hover:bg-red-500/20
                border border-red-500/30 text-red-400
                p-2 rounded-xl transition-all duration-150 shrink-0 active:scale-95"
            >
              <Square size={14} />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim()}
              className="bg-violet-600 hover:bg-violet-500 active:scale-95
                disabled:bg-bg-hover disabled:text-gray-400 disabled:cursor-not-allowed
                text-white p-2 rounded-xl transition-all duration-150 shrink-0
                hover:shadow-[0_0_14px_var(--violet-glow)]"
            >
              <Send size={14} />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-1.5 select-none">
          {examMode} syllabus only — {subjects}
        </p>
      </div>
    </div>
  );
}