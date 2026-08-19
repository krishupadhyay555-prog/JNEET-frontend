// ============================================================
//  JNEET+ AI — components/tests/MCQCard.jsx  (v2 — glass panel)
// ============================================================

export function MCQCard({ question, index, total, selectedIndex, onSelect }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-[11px] text-gray-600 mb-2 font-medium">
        Question {index + 1} of {total}
      </p>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question diagram"
          className="w-full max-h-64 object-contain rounded-xl border border-bg-border mb-4 bg-bg-panel"
        />
      )}

      <p className="text-sm text-fg-primary leading-relaxed mb-4">
        {question.questionText}
      </p>

      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(question.questionId, i)}
            className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all duration-150
              ${selectedIndex === i
                ? "bg-violet-600/15 border-violet-600/50 text-fg-primary"
                : "bg-bg-panel border-bg-border text-gray-600 hover:border-violet-600/30 hover:text-fg-primary"}`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}