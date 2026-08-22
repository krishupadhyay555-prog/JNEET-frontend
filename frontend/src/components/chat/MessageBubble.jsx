// ============================================================
//  JNEET+ AI — components/chat/MessageBubble.jsx  (v4 — real logo,
//  last remaining Sparkles instance removed)
//  CHANGED: AI-avatar Sparkles icon → app's own JN logo image
//  (frontend/public/icon-192.png). This was the actual last place
//  in the app still showing the Sparkles icon (the v3 header-
//  comment claiming LoadingScreen was "the last place" was wrong —
//  this file and StreamingBubble.jsx were both missed in that pass).
//  Everything else — prose-invert removal, avatar sizing, user-
//  bubble gradient, save-button logic — UNCHANGED from v3.
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
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5
          shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-transform duration-200
          hover:scale-110 overflow-hidden
          ${isUser
            ? "bg-violet-600"
            : "bg-bg-panel border border-bg-border"
          }`}
      >
        {isUser
          ? <User size={12} className="text-white" />
          : <img src="/icon-192.png" alt="JNEET+ AI" className="w-full h-full object-cover" />
        }
      </div>

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