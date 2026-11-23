// ============================================================
//  JNEET+ AI — components/tests/ReviewAnswer.jsx  (v3 — mode-aware)
//  ADDED: `mode` prop — explanation block only renders for
//  "revision" mode. Full "test" mode shows correct/incorrect +
//  the right answer, but NOT the explanation — matches the real
//  exam-review experience (you see what was right, not a tutor
//  explaining why, which is what revision mode is for).
// ============================================================

import { MathTex } from "../learn/MathTex.jsx";
import { ExplainWithAi } from "./ExplainWithAi.jsx";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { ReportQuestion } from "./ReportQuestion.jsx";
import { PyqBadge, PyqImage, ZoomView } from "./CbtQuestion.jsx";
import { fitW } from "../pyq/pyqImage.js";

export function ReviewAnswer({ question, index, mode = "revision", attemptId }) {
  const { questionText, options = [], correctIndex, selectedIndex, explanation, imageUrl, type, answers, textAnswer } = question;
  const isPyq = question.source === "pyq";
  const [zoom, setZoom] = useState(null);
  // fill-in-the-blank and numericals: a typed answer, marked 0 (right) / 1 (wrong)
  const isBlank = type === "fill_blank" || type === "numeric";
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
    <div className="glass-panel rounded-2xl p-5" style={isPyq ? { containerType: "inline-size" } : undefined}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-[11px] text-gray-600 font-medium flex flex-wrap items-center gap-2">
          Question {index + 1}{isPyq && <PyqBadge label={question.pyqLabel} />}
        </p>
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

      {isPyq && imageUrl && (
        <div className="mb-3"><PyqImage src={imageUrl} w={question.imageW} refW={question.imageW} alt={`Question ${index + 1} (original NTA paper)`} onZoom={setZoom} /></div>
      )}
      {isPyq && question.figUrl && <div className="mb-3"><PyqImage src={question.figUrl} alt="Figure" onZoom={setZoom} /></div>}
      {!isPyq && imageUrl && (
        <img
          src={imageUrl}
          alt="Question diagram"
          className="w-full max-h-64 object-contain rounded-xl border border-bg-border mb-3 bg-bg-panel"
        />
      )}

      {questionText && <p className="text-sm text-fg-primary leading-relaxed mb-3"><MathTex>{questionText}</MathTex></p>}

      {isBlank ? (
        <div className="space-y-1.5 mb-3 text-sm">
          {!wasSkipped && (
            <p className={`px-4 py-2.5 rounded-xl border ${wasCorrect ? "bg-emerald-500/10 border-emerald-500/40" : "bg-red-500/10 border-red-500/40"} text-fg-primary`}>
              <span className="text-[11px] text-gray-600 mr-2">Your answer</span>{textAnswer}
            </p>
          )}
          <p className="px-4 py-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/40 text-fg-primary">
            <span className="text-[11px] text-gray-600 mr-2">Answer</span>{answers?.[0]}
          </p>
        </div>
      ) : (
      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`text-sm px-4 py-2.5 rounded-xl border ${optionClass(i)}`}
          >
            <span className="font-semibold mr-2">{isPyq ? `(${i + 1})` : `${String.fromCharCode(65 + i)}.`}</span>
            {isPyq && question.optionImages?.[i] ? (
              <span className="inline-block max-w-full align-middle bg-white rounded p-1">
                <img src={question.optionImages[i]} alt={`Option ${i + 1}`} loading="lazy" className="block h-auto max-w-full"
                  style={question.imageW && question.optionImageW?.[i] ? { width: fitW(question.optionImageW[i], question.imageW) } : undefined} />
              </span>
            ) : <MathTex>{opt}</MathTex>}
          </div>
        ))}
      </div>
      )}

      {/* Explanation only for revision mode — test mode stays exam-realistic */}
      {mode === "revision" && explanation && (
        <div className="bg-bg-panel border border-bg-border rounded-xl p-3">
          <p className="text-[11px] text-gray-600 font-medium mb-1">Explanation</p>
          <p className="text-xs text-fg-primary leading-relaxed"><MathTex>{explanation}</MathTex></p>
        </div>
      )}
      {isPyq && <div className="mt-3"><ExplainWithAi questionId={question.questionId} /></div>}
      <ZoomView src={zoom} onClose={() => setZoom(null)} />
      <ReportQuestion attemptId={attemptId} questionId={question.questionId} />
    </div>
  );
}