import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Bookmark, BookmarkCheck } from "lucide-react";

export const MessageBubble = memo(function MessageBubble({ msg, onToggleSaved }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 group animate-message-in
        ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 shadow-[0_6px_16px_rgba(0,0,0,0.2)]
          ${isUser
            ? "bg-violet-600"
            : "bg-white/[0.06] border border-white/10 backdrop-blur-md"
          }`}
      >
        {isUser
          ? <User size={12} className="text-white" />
          : <Bot size={12} className="text-violet-400" />
        }
      </div>

      {/* Bubble */}
      <div
          className={`flex flex-col gap-1 max-w-[86%] sm:max-w-[76%]
          ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`
            px-4 py-2.5 text-[0.8375rem] leading-[1.65]
            tracking-[0.004em] break-words
            transition duration-200 hover:translate-y-[-1px]
            ${isUser
              ? `bg-gradient-to-br from-violet-500 to-violet-700 text-white
                 rounded-t-2xl rounded-bl-2xl rounded-br-md
                 shadow-[0_10px_28px_rgba(74,161,230,0.16)]`
              : `bg-white/[0.055] border border-white/10 text-[#f1f1ff] backdrop-blur-xl
                 rounded-t-2xl rounded-br-2xl rounded-bl-md
                 shadow-[0_10px_30px_rgba(0,0,0,0.18)]`
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-p:my-1 prose-p:leading-[1.65]
                prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
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

        {/* Save button — FIXED for mobile */}
        {!isUser && (
          <button
            onClick={() => onToggleSaved?.(msg)}
            className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded
              transition-all duration-150 select-none
              ${msg.saved
                ? "text-amber-400 opacity-100"
                : "text-gray-500 opacity-80 hover:text-amber-400"
              }`}
          >
            {msg.saved
              ? <BookmarkCheck size={11} />
              : <Bookmark size={11} />
            }
            <span>{msg.saved ? "Saved" : "Save"}</span>
          </button>
        )}
      </div>
    </div>
  );
});
