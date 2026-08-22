// ============================================================
//  JNEET+ AI — components/chat/MessageBubble.jsx  (v5 — brand mark)
//  CHANGED: AI-avatar → the new two-circle wave-mark (blue+green,
//  overlapping), replacing the JN-logo-image avatar. This mark is
//  specifically the "AI response" signature — distinct from the
//  JN logo, which stays the app's overall brand mark everywhere
//  else (Sidebar, Dashboard, Login/Register — untouched).
//  Static here (no animation) — this bubble renders a COMPLETED
//  message, so nothing is "in progress." The animated version of
//  this same mark lives in StreamingBubble.jsx, where it plays
//  while the AI is actively generating.
//  Everything else — prose-invert removal, user-bubble gradient,
//  save-button logic — UNCHANGED from v4.
// ============================================================

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bookmark, BookmarkCheck } from "lucide-react";

export const MessageBubble = memo(function MessageBubble({ msg, onToggleSaved }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 group animate-message-in
        ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mb-0.5 shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110">
          <User size={12} className="text-white" />
        </div>
      ) : (
        <div className="w-7 h-7 relative shrink-0 mb-0.5 transition-transform duration-200 hover:scale-110" aria-hidden="true">
          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#4a8fe8]/90" />
          <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-[#34b76a]/90" />
        </div>
      )}

      {/* Bubble */}
      <div
          className={`flex flex-col gap-1 max-w-[86%] sm:max-w-[76%] lg:max-w-[620px]
          ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`
            px-4 py-2.5 text-[0.875rem] leading-[1.65]
            tracking-[0.002em] break-words
            transition duration-200 hover:translate-y-[-1px]
            ${isUser
              ? `bg-gradient-to-br from-violet-500 to-violet-700 text-white
                 rounded-t-2xl rounded-bl-2xl rounded-br-md
                 shadow-[0_10px_28px_rgba(74,161,230,0.16)]`
              : `bg-bg-card border border-bg-border text-fg-primary
                 rounded-t-2xl rounded-br-2xl rounded-bl-md
                 shadow-[0_10px_30px_rgba(0,0,0,0.10)]
                 ${msg.saved ? "ring-1 ring-amber-500/30" : ""}`
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div
              className="prose max-w-none
                prose-p:my-1.5 prose-p:leading-[1.7]
                prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                prose-headings:mt-3 prose-headings:mb-1.5
                prose-pre:my-2 prose-blockquote:my-2
                prose-table:my-2 prose-hr:my-3"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Save button — tactile click feedback + icon pop on save */}
        {!isUser && (
          <button
            onClick={() => onToggleSaved?.(msg)}
            className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded
              transition-all duration-150 select-none active:scale-90
              ${msg.saved
                ? "text-amber-400 opacity-100"
                : "text-gray-500 opacity-80 hover:text-amber-400"
              }`}
          >
            <span className={`transition-transform duration-200 ${msg.saved ? "scale-110" : "scale-100"}`}>
              {msg.saved
                ? <BookmarkCheck size={11} />
                : <Bookmark size={11} />
              }
            </span>
            <span>{msg.saved ? "Saved" : "Save"}</span>
          </button>
        )}
      </div>
    </div>
  );
});