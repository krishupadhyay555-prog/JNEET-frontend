// ============================================================
//  JNEET+ AI — components/wms/ProgressGraph.jsx  (v2 — auto data)
//  Now shows overall correct/wrong/unattempted question counts
//  across the student's FULL Test+Revision history, instead of
//  "how many topics were manually marked Weak/Medium/Strong".
// ============================================================

export function ProgressGraph({ overall }) {
  const { correct = 0, wrong = 0, unattempted = 0, total = 0, accuracyPct = 0 } = overall || {};

  if (total === 0) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-5 text-center">
        <p className="text-xs text-gray-600">
          No test or revision attempts yet — take one to see your progress here.
        </p>
      </div>
    );
  }

  const pct = (n) => (n / total) * 100;

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-fg-primary">Overall accuracy</p>
        <p className="text-lg font-bold text-fg-primary tabular-nums">{accuracyPct}%</p>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden bg-bg-panel mb-4">
        <div style={{ width: `${pct(correct)}%` }} className="bg-emerald-500" />
        <div style={{ width: `${pct(wrong)}%` }} className="bg-red-500" />
        <div style={{ width: `${pct(unattempted)}%` }} className="bg-bg-border" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-emerald-400 tabular-nums">{correct}</p>
          <p className="text-[10px] text-gray-600">Correct</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-400 tabular-nums">{wrong}</p>
          <p className="text-[10px] text-gray-600">Wrong</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-500 tabular-nums">{unattempted}</p>
          <p className="text-[10px] text-gray-600">Skipped</p>
        </div>
      </div>

      <p className="text-[10px] text-gray-700 text-center mt-3">
        Based on {total} question{total === 1 ? "" : "s"} across all tests + revisions
      </p>
    </div>
  );
}