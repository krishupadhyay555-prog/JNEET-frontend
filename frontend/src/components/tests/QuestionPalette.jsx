// ============================================================
//  JNEET+ AI — components/tests/QuestionPalette.jsx  (NEW)
//  Numbered jump-buttons — current question highlighted, answered
//  questions tinted, unanswered neutral. Standard exam-app pattern.
// ============================================================

export function QuestionPalette({ questions, currentIndex, answers, onJump }) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q, i) => {
        const answered = answers[q.questionId] !== undefined && answers[q.questionId] !== null;
        const isCurrent = i === currentIndex;

        return (
          <button
            key={q.questionId}
            onClick={() => onJump(i)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center
              ${isCurrent
                ? "bg-violet-600 text-white shadow-glow-sm scale-110"
                : answered
                  ? "bg-violet-600/20 border border-violet-600/40 text-fg-primary"
                  : "bg-bg-panel border border-bg-border text-gray-600 hover:border-violet-600/30"}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}