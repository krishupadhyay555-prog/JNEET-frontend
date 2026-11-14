// ============================================================
//  JNEET+ AI — components/learn/MathText.jsx
//  Tiny, safe formatter for OneShot text: turns  x^{1/3} / [C]^c  into a real
//  superscript and  v_d / E_{n₂}  into a subscript. No HTML is ever
//  injected — only React <sup>/<sub> elements around plain text.
// ============================================================

// ^{…} / ^x → superscript;  _{…} / _word → subscript
const TOKEN = /\^\{([^}]*)\}|\^([A-Za-z0-9α-ωΑ-Ω])|_\{([^}]*)\}|_([A-Za-z0-9α-ωΑ-Ω]+)/g;

export function MathText({ children }) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const out = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {          // matchAll works on a copy — TOKEN is never mutated
    if (m.index > last) out.push(text.slice(last, m.index));
    const sup = m[1] ?? m[2];
    if (sup !== undefined) out.push(<sup key={m.index} className="text-[0.75em]">{sup}</sup>);
    else out.push(<sub key={m.index} className="text-[0.75em]">{m[3] ?? m[4]}</sub>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
