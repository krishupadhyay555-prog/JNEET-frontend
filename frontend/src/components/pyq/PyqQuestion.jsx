// ============================================================
//  JNEET+ AI — components/pyq/PyqQuestion.jsx
//  One previous-year question: try it first (tap an option / type the
//  number), then see NTA's answer and our short explanation.
//  NTA's own rulings are shown as they are: Dropped, Bonus (marks to all),
//  More than one correct option.
// ============================================================

import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Eye, ZoomIn, X } from "lucide-react";
import { MathTex } from "../learn/MathTex.jsx";
import { fitW } from "./pyqImage.js";
import { useOverlayClose } from "../../hooks/useOverlayClose.js";

const LETTERS = ["1", "2", "3", "4"];

// Image sizing (one scale for question + options): see ./pyqImage.js

const STATUS = {
  dropped: { label: "Dropped by NTA", cls: "bg-gray-500/10 text-gray-600" },
  bonus:   { label: "Bonus — NTA gave marks to all", cls: "bg-amber-500/10 text-amber-700" },
  multi:   { label: "NTA accepted more than one option", cls: "bg-blue-500/10 text-blue-600" },
};

function sameNumber(a, b) {
  const x = Number(String(a).trim());
  const y = Number(String(b).trim());
  return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) < 1e-9;
}

export function PyqQuestion({ q, paperId, paperTitle }) {
  const [picked, setPicked] = useState(null);     // option index
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);  // numeric: answered
  const [revealed, setRevealed] = useState(false);
  const [zoom, setZoom] = useState(null);           // image shown full size
  useOverlayClose(Boolean(zoom), () => setZoom(null));

  const img = (f) => `/pyq/${paperId ?? q.paper?.id}/${f}`;
  const isMcq = q.type === "mcq";
  const done = revealed || (isMcq ? picked !== null : checked);
  const correct = q.correct ?? [];
  const accepted = q.answers ?? (q.answer != null ? [q.answer] : []);   // NTA may accept several values
  const numericRight = !isMcq && checked && accepted.some((a) => sameNumber(typed, a));
  const status = STATUS[q.status];

  return (
    <article className="glass-panel rounded-2xl p-4 space-y-3" style={{ containerType: "inline-size" }} aria-label={`Question ${q.n}`}>
      <header className="space-y-1.5">
        <span className="inline-block text-[11px] font-medium rounded-md bg-amber-500/10 text-amber-700 px-2 py-0.5">
          {q.paper?.title ?? paperTitle}
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-600">
          <span className="font-semibold text-fg-primary">Q{q.n}</span>
          <span>·</span>
          {q.oldSyllabus
            ? <span className="rounded-md bg-gray-500/10 text-gray-600 px-1.5 py-0.5">Not in the current JEE Main syllabus · {q.oldSyllabus}</span>
            : <span>{q.chapter}</span>}
          {!isMcq && <span className="ml-auto rounded-md bg-violet-500/10 text-violet-600 px-1.5 py-0.5">Numerical</span>}
        </div>
      </header>

      {q.qimg ? (
        <button type="button" onClick={() => setZoom(img(q.qimg))} className="block text-left group max-w-full"
          aria-label={`Question ${q.n}: tap to zoom`}>
          <span className="inline-block rounded-lg bg-white p-2 border border-bg-border">
            <img src={img(q.qimg)} alt={`Question ${q.n} (original NTA paper)`} loading="lazy"
              style={q.qimgW ? { width: fitW(q.qimgW, q.qimgW) } : undefined} className="block h-auto max-w-full" />
          </span>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-600 group-hover:text-violet-600">
            <ZoomIn size={12} /> Tap to zoom
          </span>
        </button>
      ) : (
        <div className="text-sm leading-relaxed"><MathTex>{q.text}</MathTex></div>
      )}

      {q.fig && (
        <div className="overflow-x-auto">
          <img src={img(q.fig)} alt={`Figure for question ${q.n}`} loading="lazy"
            className="max-w-none h-auto rounded-lg bg-white p-2 border border-bg-border" />
        </div>
      )}

      {isMcq && q.optionsInImage && (
        <p className="text-[11px] text-gray-600">Options (1)–(4) are printed in the question above. Pick one:</p>
      )}
      {isMcq ? (
        <ol className={q.optionsInImage ? "grid grid-cols-4 gap-2" : "space-y-2"}>
          {q.options.map((o, i) => {
            const isRight = done && correct.includes(i);
            const isWrongPick = done && picked === i && !correct.includes(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => setPicked(i)}
                  aria-label={q.optionsInImage ? `Option ${LETTERS[i]}` : undefined}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm flex gap-3 items-start transition
                    ${q.optionsInImage ? "justify-center items-center" : ""}
                    ${isRight ? "border-emerald-500/60 bg-emerald-500/10"
                      : isWrongPick ? "border-red-500/60 bg-red-500/10"
                      : "border-bg-border hover:border-violet-600/40"}
                    ${done ? "cursor-default" : ""}`}
                >
                  <span className="font-semibold text-gray-600 shrink-0">({LETTERS[i]})</span>
                  {!q.optionsInImage && <span className="flex-1 min-w-0">
                    {q.optImg?.[i]
                      ? <span className="inline-block max-w-full bg-white rounded p-1">
                          <img src={img(q.optImg[i])} alt={`Option ${i + 1}`} loading="lazy" className="block h-auto max-w-full"
                            style={q.qimgW && q.optImgW ? { width: fitW(q.optImgW[i], q.qimgW) } : undefined} />
                        </span>
                      : <MathTex>{o}</MathTex>}
                  </span>}
                  {isRight && <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
                  {isWrongPick && <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => { e.preventDefault(); if (typed.trim()) setChecked(true); }}
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={done}
            inputMode="decimal"
            placeholder="Your answer"
            aria-label="Your numerical answer"
            className="flex-1 rounded-xl border border-bg-border bg-bg-surface px-3 py-2 text-sm"
          />
          <button type="submit" disabled={done || !typed.trim()}
            className="rounded-xl bg-violet-600 text-white text-sm px-4 disabled:opacity-40">Check</button>
        </form>
      )}

      {!done && (
        <button type="button" onClick={() => setRevealed(true)}
          className="text-xs text-gray-600 hover:text-violet-600 inline-flex items-center gap-1">
          <Eye size={13} /> Show answer
        </button>
      )}

      {done && (
        <div className="rounded-xl bg-bg-surface border border-bg-border p-3 space-y-2">
          {status && <span className={`inline-block text-[11px] rounded-md px-2 py-0.5 ${status.cls}`}>{status.label}</span>}
          <p className="text-xs font-semibold">
            {isMcq
              ? (picked !== null && q.status !== "dropped"
                  ? (correct.includes(picked) ? "Correct! " : "Not quite. ")
                  : "") +
                (q.status === "dropped" ? "No answer — this question was dropped."
                  : q.status === "bonus" ? "Every option was given marks."
                  : `Answer: option ${correct.map((c) => c + 1).join(" or ")}`)
              : (checked ? (numericRight ? "Correct! " : "Not quite. ") : "") +
                (q.answer == null ? (q.status === "bonus" ? "Every answer was given marks." : "No answer — this question was dropped.")
                  : `Answer: ${q.answer}`)}
          </p>
          {q.explanation
            ? <div className="text-xs leading-relaxed text-fg-secondary"><MathTex>{q.explanation}</MathTex></div>
            : <p className="text-xs text-gray-600">Answer is NTA's final answer key. Step-by-step explanation: coming soon.</p>}
        </div>
      )}
      {zoom && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Zoomed question"
          className="fixed inset-0 z-[100] bg-black/85 overflow-auto" onClick={() => setZoom(null)}>
          <button type="button" onClick={() => setZoom(null)} aria-label="Close"
            className="fixed top-3 right-3 z-10 rounded-full bg-white text-black p-2 shadow"><X size={18} /></button>
          <div className="min-h-full flex p-3 pt-14">
            {/* m-auto (not justify-center) so a wide image can still be scrolled to its left edge */}
            <img src={zoom} alt="Question, full size" className="m-auto max-w-none bg-white rounded-lg p-3"
              onClick={(e) => e.stopPropagation()} />
          </div>
        </div>,
        document.body
      )}
    </article>
  );
}
