import { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

export function ChatInput({ value, onChange, onSend, onAbort, isStreaming, examMode }) {
  const textareaRef = useRef(null);

  // Smooth auto-resize (no jump)
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
    <div className="shrink-0 px-4 py-4 border-t border-bg-border bg-bg-surface">
      <div className="max-w-3xl mx-auto">
        <div
          className={`flex gap-2 items-end rounded-2xl px-4 py-3
            border transition-all duration-200
            ${isStreaming
              ? "border-violet-600/40 shadow-[0_0_0_2px_rgba(130,72,254,0.08)]"
              : "border-[#1e1e35] focus-within:border-violet-600/50 focus-within:shadow-[0_0_0_2px_rgba(130,72,254,0.06)]"
            }`}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-[#f0f0ff] placeholder-[#4a4a6a]
              resize-none focus:outline-none text-[0.85rem] leading-[1.6]
              min-h-[22px] max-h-40 font-sans tracking-[0.003em]"
            placeholder={`${examMode} sawaal puchho... (Enter = Send, Shift+Enter = New line)`}
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
                p-2 rounded-xl transition-all duration-150 shrink-0"
            >
              <Square size={14} />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim()}
              className="bg-violet-600 hover:bg-violet-500 active:scale-95
                disabled:bg-[#1a1a2e] disabled:text-[#3a3a5a] disabled:cursor-not-allowed
                text-white p-2 rounded-xl transition-all duration-150 shrink-0
                hover:shadow-[0_0_10px_rgba(130,72,254,0.35)]"
            >
              <Send size={14} />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-[#2a2a42] mt-1.5 select-none">
          Sirf {examMode} syllabus — {subjects}
        </p>
      </div>
    </div>
  );
}