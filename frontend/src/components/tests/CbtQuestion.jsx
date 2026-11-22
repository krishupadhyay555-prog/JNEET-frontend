// ============================================================
//  JNEET+ AI — components/tests/CbtQuestion.jsx
//  One question on the NTA-style exam screen. Two kinds:
//    - bank question: text + four text options;
//    - real PYQ: NTA's own image with its paper label on it ("JEE Main
//      2025 · 2 April · Shift 1"), options as NTA images, or (1)–(4)
//      buttons when NEET prints the options inside the question image.
//  Numericals (JEE Section B) take a typed number, like NTA's keypad box.
//  Shows NO answer — this is the exam, review comes after submit.
// ============================================================

import { useState } from "react";
import { createPortal } from "react-dom";
import { ZoomIn, X } from "lucide-react";
import { MathTex } from "../learn/MathTex.jsx";
import { fitW } from "../pyq/pyqImage.js";

const LETTERS = ["A", "B", "C", "D"];

export function PyqBadge({ label }) {
  return (
    <span title="Official NTA question paper. JNEET+ AI is not affiliated with NTA." className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-md bg-amber-500/15 text-amber-700 px-2 py-0.5">
      PYQ · {label}
    </span>
  );
}

// NTA image on a white card (the scans are black-on-white), tap to zoom.
export function PyqImage({ src, w, refW, alt, onZoom }) {
  return (
    <button type="button" onClick={() => onZoom?.(src)} className="block text-left group max-w-full" title="Tap to zoom">
      <span className="relative inline-block max-w-full bg-white rounded-lg border border-bg-border p-2">
        <img src={src} alt={alt} loading="lazy" className="block h-auto max-w-full"
          style={w && refW ? { width: fitW(w, refW) } : undefined} />
        <ZoomIn size={14} className="absolute top-1.5 right-1.5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
      </span>
    </button>
  );
}

export function ZoomView({ src, onClose }) {
  if (!src) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 overflow-auto p-4 flex" onClick={onClose} role="dialog" aria-label="Zoomed question">
      <button type="button" onClick={onClose} className="fixed top-3 right-3 text-white p-2 rounded-full bg-black/50" aria-label="Close">
        <X size={18} />
      </button>
      <img src={src} alt="Question, full size" className="m-auto max-w-none bg-white rounded-lg p-3" style={{ width: "min(1100px, 200vw)" }} />
    </div>,
    document.body
  );
}

export function CbtQuestion({ question: q, number, value, onChange }) {
  const [zoom, setZoom] = useState(null);
  const isPyq = q.source === "pyq";
  const refW = q.imageW || null;

  return (
    <article className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3" style={{ containerType: "inline-size" }}>
      <header className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-fg-primary">Question {number}</span>
        {isPyq && <PyqBadge label={q.pyqLabel} />}
        {q.type === "numeric" && (
          <span className="ml-auto text-[11px] font-medium rounded-md bg-violet-500/10 text-violet-600 px-2 py-0.5">
            Numerical · type the answer
          </span>
        )}
      </header>

      {isPyq && q.imageUrl ? (
        <PyqImage src={q.imageUrl} w={refW} refW={refW} alt={`Question ${number} (original NTA paper)`} onZoom={setZoom} />
      ) : q.imageUrl ? (
        <img src={q.imageUrl} alt="Question diagram" className="w-full max-h-64 object-contain rounded-xl border border-bg-border bg-bg-panel" />
      ) : null}
      {isPyq && q.figUrl && <PyqImage src={q.figUrl} alt={`Figure for question ${number}`} onZoom={setZoom} />}
      {q.questionText && (
        <div className="text-sm text-fg-primary leading-relaxed">{isPyq ? <MathTex>{q.questionText}</MathTex> : q.questionText}</div>
      )}

      {q.type === "numeric" ? (
        <label className="block max-w-xs">
          <span className="text-[11px] text-gray-600">Your answer (a number)</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value ?? ""}
            onChange={(e) => onChange(q.questionId, e.target.value.replace(/[^0-9.-]/g, "").slice(0, 12))}
            placeholder="e.g. 25"
            className="mt-1 w-full rounded-xl border border-bg-border bg-bg-panel px-3 py-2.5 text-base text-fg-primary
              focus:outline-none focus:border-violet-600/60 tabular-nums"
          />
        </label>
      ) : q.optionsInImage ? (
        <div>
          <p className="text-[11px] text-gray-600 mb-2">Options (1)–(4) are printed in the question above. Pick one:</p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} type="button" onClick={() => onChange(q.questionId, i)} aria-pressed={value === i}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition
                  ${value === i ? "bg-violet-600/15 border-violet-600/60 text-fg-primary" : "bg-bg-panel border-bg-border text-gray-600 hover:border-violet-600/40"}`}>
                ({i + 1})
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {(q.options ?? []).map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(q.questionId, i)}
              aria-pressed={value === i}
              className={`w-full text-left text-sm px-3.5 py-2.5 rounded-xl border transition flex gap-3 items-start
                ${value === i
                  ? "bg-violet-600/15 border-violet-600/60 text-fg-primary"
                  : "bg-bg-panel border-bg-border text-gray-600 hover:border-violet-600/30 hover:text-fg-primary"}`}
            >
              <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-semibold
                ${value === i ? "bg-violet-600 border-violet-600 text-white" : "border-bg-border"}`}>
                {isPyq ? i + 1 : LETTERS[i]}
              </span>
              <span className="flex-1 min-w-0">
                {isPyq && q.optionImages?.[i] ? (
                  <span className="inline-block max-w-full bg-white rounded p-1">
                    <img src={q.optionImages[i]} alt={`Option ${i + 1}`} loading="lazy" className="block h-auto max-w-full"
                      style={refW && q.optionImageW?.[i] ? { width: fitW(q.optionImageW[i], refW) } : undefined} />
                  </span>
                ) : isPyq ? <MathTex>{opt}</MathTex> : opt}
              </span>
            </button>
          ))}
        </div>
      )}
      <ZoomView src={zoom} onClose={() => setZoom(null)} />
    </article>
  );
}
