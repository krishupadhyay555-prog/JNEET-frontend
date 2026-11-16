// ============================================================
//  JNEET+ AI — components/learn/MathTex.jsx
//  Renders text with $…$ math (PYQs). Plain text stays React text; only
//  the math pieces go through KaTeX (trust: false, our own checked content —
//  tools/pyq/build.py renders every piece once with throwOnError before
//  a paper is published, so a broken formula can't reach students).
// ============================================================

import { memo, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function render(tex) {
  try {
    return katex.renderToString(tex, { throwOnError: false, strict: "ignore", trust: false, output: "html" });
  } catch {
    return null;
  }
}

export const MathTex = memo(function MathTex({ children, className = "" }) {
  const parts = useMemo(() => {
    const text = typeof children === "string" ? children : String(children ?? "");
    return text.split(/(\$[^$]+\$)/g).filter(Boolean).map((p) => {
      if (p.length > 2 && p.startsWith("$") && p.endsWith("$")) {
        const html = render(p.slice(1, -1));
        return html ? { html } : { text: p };
      }
      return { text: p };
    });
  }, [children]);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.html ? <span key={i} dangerouslySetInnerHTML={{ __html: p.html }} /> : <span key={i}>{p.text}</span>
      )}
    </span>
  );
});
