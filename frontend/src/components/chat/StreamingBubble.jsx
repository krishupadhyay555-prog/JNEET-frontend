// ============================================================
//  JNEET+ AI — components/chat/StreamingBubble.jsx  (v5 — brand
//  mark, animated)
//  CHANGED: avatar → the same two-circle wave-mark as
//  MessageBubble.jsx, but ANIMATED here — the blue and green
//  circles pulse in a wave (out-of-phase scale), signaling "AI is
//  actively responding." This is the one place in the app the
//  animation plays; once the reply completes and hands off to a
//  regular MessageBubble, the mark goes static.
//  Everything else — prose-invert removal, bubble shape, cursor,
//  bouncing-dots loading state — UNCHANGED from v4.
// ============================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BouncingDots } from "./BouncingDots.jsx";

export function StreamingBubble({ text }) {
  return (
    <div className="flex items-end gap-2.5 animate-message-in">
      {/* Avatar — animated wave mark, only while streaming */}
      <div className="w-7 h-7 relative shrink-0 mb-0.5" aria-hidden="true">
        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#4a8fe8]/90 animate-wave-blue" />
        <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-[#34b76a]/90 animate-wave-green" />
      </div>

      {/* Bubble */}
      <div className="max-w-[86%] sm:max-w-[76%] lg:max-w-[620px]">
        <div
          className="bg-bg-card border border-bg-border
          rounded-t-2xl rounded-br-2xl rounded-bl-md
          px-4 py-2.5 text-[0.875rem] leading-[1.65] tracking-[0.002em]
          shadow-[0_10px_30px_rgba(0,0,0,0.10)]
          min-w-[3rem]"
        >
          {text ? (
            <>
              {/* Stable markdown */}
              <div
                className="prose max-w-none
                prose-p:my-1.5 prose-p:leading-[1.7]
                prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                prose-headings:mt-3 prose-headings:mb-1.5
                prose-pre:my-2 prose-blockquote:my-2
                prose-table:my-2 prose-hr:my-3"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text}
                </ReactMarkdown>
              </div>

              {/* Softer cursor */}
              <span
                className="inline-block w-[2px] h-[0.8em] bg-violet-400/60
                ml-0.5 align-middle rounded-sm animate-pulse"
              />
            </>
          ) : (
            <BouncingDots />
          )}
        </div>
      </div>
    </div>
  );
}