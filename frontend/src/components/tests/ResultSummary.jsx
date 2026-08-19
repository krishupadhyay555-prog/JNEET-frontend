// ============================================================
//  JNEET+ AI — components/tests/ResultSummary.jsx  (v3 — mode-aware)
//  Full "test" mode shows the real NEET/JEE-style marks
//  (marksObtained / maxMarks, +4/-1 already applied). Chapter-wise
//  "revision" mode keeps the simple percentage view — no negative
//  marking shown there, since revision isn't meant to feel
//  punishing the way a real exam simulation should.
// ============================================================

export function ResultSummary({ attempt }) {
  const {
    mode, score, correctCount, wrongCount, unattemptedCount,
    totalQuestions, marksObtained, maxMarks,
  } = attempt;

  const isTestMode = mode === "test";

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="text-center mb-4">
        {isTestMode ? (
          <>
            <p className="text-4xl font-bold text-fg-primary tabular-nums">
              {marksObtained}
              <span className="text-lg text-gray-600"> / {maxMarks}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {correctCount} correct, {wrongCount} wrong (+4 / −1 marking)
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-fg-primary tabular-nums">{score}%</p>
            <p className="text-xs text-gray-600 mt-1">
              {correctCount} out of {totalQuestions} correct
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl py-2.5">
          <p className="text-lg font-bold text-emerald-400 tabular-nums">{correctCount}</p>
          <p className="text-[10px] text-gray-600">Correct</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl py-2.5">
          <p className="text-lg font-bold text-red-400 tabular-nums">{wrongCount}</p>
          <p className="text-[10px] text-gray-600">Wrong</p>
        </div>
        <div className="bg-bg-panel border border-bg-border rounded-xl py-2.5">
          <p className="text-lg font-bold text-gray-500 tabular-nums">{unattemptedCount}</p>
          <p className="text-[10px] text-gray-600">Skipped</p>
        </div>
      </div>
    </div>
  );
}