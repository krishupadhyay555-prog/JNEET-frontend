import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot } from "lucide-react";
import { BouncingDots } from "./BouncingDots.jsx";

export function StreamingBubble({ text }) {
  return (
    <div className="flex items-end gap-2.5">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-[#1c1c30] border border-[#2a2a44]
        flex items-center justify-center shrink-0 mb-0.5">
        <Bot size={12} className="text-violet-400" />
      </div>

      {/* Bubble */}
      <div className="max-w-[76%]">
        <div
          className="bg-[#16162a] border border-[#22223a]
          rounded-t-2xl rounded-br-2xl rounded-bl-md
          px-4 py-2.5 text-[0.8375rem] leading-[1.65] tracking-[0.004em]
          shadow-[0_1px_2px_rgba(0,0,0,0.2)]
          min-w-[3rem]"
        >
          {text ? (
            <>
              {/* Stable markdown */}
              <div
                className="prose prose-invert prose-sm max-w-none
                prose-p:my-1 prose-p:leading-[1.65]
                prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
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