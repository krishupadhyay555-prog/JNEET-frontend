// ============================================================
//  JNEET+ AI — components/tests/CbtPalette.jsx
//  NTA-style question palette for one section, with NTA's five states:
//  Not visited · Not answered · Answered · Marked for review ·
//  Answered & marked for review (counts as answered, like NTA).
// ============================================================

import { STATE_STYLE } from "./cbtState.js";

export function CbtLegend({ counts }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-gray-600">
      {Object.entries(STATE_STYLE).map(([k, v]) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className={`w-5 h-5 ${v.cls.includes("rounded-full") ? "" : "rounded-md"} text-[10px] font-semibold flex items-center justify-center ${v.cls}`}>{counts?.[k] ?? 0}</span>
          {v.label}
        </span>
      ))}
    </div>
  );
}

export function CbtPalette({ items, currentIndex, stateOf, onJump }) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-1.5">
      {items.map(({ q, index }) => {
        const st = STATE_STYLE[stateOf(q.questionId)];
        return (
          <button
            key={q.questionId}
            type="button"
            onClick={() => onJump(index)}
            aria-label={`Question ${index + 1}: ${st.label}`}
            aria-current={index === currentIndex ? "true" : undefined}
            className={`h-8 ${st.cls.includes("rounded-full") ? "" : "rounded-md"} text-xs font-semibold flex items-center justify-center transition
              ${st.cls} ${index === currentIndex ? "outline outline-2 outline-offset-2 outline-amber-500" : ""}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
