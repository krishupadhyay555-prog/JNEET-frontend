// ============================================================
//  JNEET+ AI — components/chat/StreamingBubble.jsx  (v3 — theme-aware prose)
//  Same fix as MessageBubble.jsx — removed `prose-invert`, which
//  always forced dark-theme markdown colors regardless of the
//  actual active theme. index.css's .prose block is now fully
//  theme-variable-driven, so this modifier was actively wrong to
//  keep, not just redundant.
//  Everything else — avatar, bubble shape, cursor, bouncing-dots
//  loading state — is UNCHANGED.
// ============================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import { BouncingDots } from "./BouncingDots.jsx";

export function StreamingBubble({ text }) {
  return (
    <div className="flex items-end gap-2.5 animate-message-in">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-bg-panel border border-bg-border flex items-center justify-center shrink-0 mb-0.5 shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
        <Sparkles size={12} className="text-violet-400" />
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