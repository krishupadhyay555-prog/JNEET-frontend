// ============================================================
//  JNEET+ AI — components/tests/ReviewAnswer.jsx  (v3 — mode-aware)
//  ADDED: `mode` prop — explanation block only renders for
//  "revision" mode. Full "test" mode shows correct/incorrect +
//  the right answer, but NOT the explanation — matches the real
//  exam-review experience (you see what was right, not a tutor
//  explaining why, which is what revision mode is for).
// ============================================================

import { Check, X } from "lucide-react";

export function ReviewAnswer({ question, index, mode = "revision" }) {
  const { questionText, options, correctIndex, selectedIndex, explanation, imageUrl } = question;
  const wasCorrect = selectedIndex === correctIndex;
  const wasSkipped = selectedIndex === null || selectedIndex === undefined;

  const optionClass = (i) => {
    if (i === correctIndex) {
      return "bg-emerald-500/10 border-emerald-500/40 text-fg-primary";
    }
    if (i === selectedIndex && !wasCorrect) {
      return "bg-red-500/10 border-red-500/40 text-fg-primary";
    }
    return "bg-bg-panel border-bg-border text-gray-600";
  };

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-gray-600 font-medium">Question {index + 1}</p>
        {wasSkipped ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg-panel border border-bg-border text-gray-600">
            Skipped
          </span>
        ) : wasCorrect ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Check size={10} /> Correct
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
            <X size={10} /> Incorrect
          </span>
        )}
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Question diagram"
          className="w-full max-h-64 object-contain rounded-xl border border-bg-border mb-3 bg-bg-panel"
        />
      )}

      <p className="text-sm text-fg-primary leading-relaxed mb-3">{questionText}</p>

      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`text-sm px-4 py-2.5 rounded-xl border ${optionClass(i)}`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </div>
        ))}
      </div>

      {/* Explanation only for revision mode — test mode stays exam-realistic */}
      {mode === "revision" && explanation && (
        <div className="bg-bg-panel border border-bg-border rounded-xl p-3">
          <p className="text-[11px] text-gray-600 font-medium mb-1">Explanation</p>
          <p className="text-xs text-fg-primary leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}