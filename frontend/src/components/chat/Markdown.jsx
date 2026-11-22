// ============================================================
//  JNEET+ AI — components/chat/Markdown.jsx
//  One markdown renderer for finished AND streaming answers:
//   - code blocks get a language label + Copy button
//   - tables scroll sideways on small screens instead of breaking layout
//   - links open in a new tab safely
// ============================================================

import { memo, isValidElement, useState } from "react";
import ReactMarkdown from "react-markdown";
import { DiagramZoom } from "../learn/DiagramGallery.jsx";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { useCopy } from "../../hooks/useCopy.js";

function nodeText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) return nodeText(node.props.children);
  return "";
}

function CodeBlock({ children }) {
  const [copied, copy] = useCopy();
  const code = isValidElement(children) ? children : null;
  const lang = /language-([\w+-]+)/.exec(code?.props?.className || "")?.[1] || "";
  const text = nodeText(children).replace(/\n$/, "");
  return (
    <div className="not-prose my-2.5 rounded-xl overflow-hidden border border-bg-border bg-bg-base/60">
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg-hover/60 border-b border-bg-border text-[11px] text-gray-500">
        <span className="font-medium tracking-wide">{lang || "code"}</span>
        <button
          type="button"
          onClick={() => copy(text)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:text-fg-primary hover:bg-bg-hover transition-colors active:scale-95"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="m-0 px-3.5 py-3 overflow-x-auto text-[0.8rem] leading-relaxed bg-transparent text-fg-primary"><code>{text}</code></pre>
    </div>
  );
}

// Only our own diagram library images render in chat (never remote URLs).
function ChatImage({ src, alt }) {
  const [open, setOpen] = useState(false);
  if (typeof src !== "string" || !src.startsWith("/diagrams/")) return null;
  return (
    <span className="block my-2 not-prose">
      <button type="button" onClick={() => setOpen(true)} className="block w-full bg-white rounded-xl border border-bg-border overflow-hidden">
        <img src={src} alt={alt || "Diagram"} loading="lazy" className="w-full max-h-[420px] object-contain" />
      </button>
      <span className="block text-[11.5px] text-gray-600 mt-1">{alt} · tap to zoom</span>
      {open && <DiagramZoom d={{ f: src, t: alt || "Diagram" }} onClose={() => setOpen(false)} />}
    </span>
  );
}

const components = {
  pre: CodeBlock,
  // eslint-disable-next-line no-unused-vars
  img: ({ node, ...props }) => <ChatImage {...props} />,
  // react-markdown passes an AST `node` prop that must not reach the DOM
  // eslint-disable-next-line no-unused-vars
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
  // eslint-disable-next-line no-unused-vars
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-2 rounded-lg"><table {...props} /></div>
  ),
};

export const Markdown = memo(function Markdown({ children }) {
  return (
    <div
      className="prose max-w-none
        prose-p:my-1.5 prose-p:leading-[1.7]
        prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
        prose-headings:mt-3 prose-headings:mb-1.5
        prose-pre:my-2 prose-blockquote:my-2
        prose-table:my-2 prose-hr:my-3"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
});
