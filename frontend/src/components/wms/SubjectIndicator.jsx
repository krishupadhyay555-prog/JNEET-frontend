// ============================================================
//  JNEET+ AI — components/wms/SubjectIndicator.jsx  (v2 — auto data)
//  Prop shape changed: now takes accuracy-based stats
//  { total, correct, wrong, unattempted, accuracyPct, status }
//  from the auto-calculated summary, instead of manual W/M/S
//  entry counts.
// ============================================================

const STATUS_LABEL = { W: "Weak", M: "Medium", S: "Strong" };
const STATUS_COLOR = {
  W: "text-red-400",
  M: "text-amber-400",
  S: "text-emerald-400",
};

export function SubjectIndicator({ subject, stats }) {
  if (!stats || stats.total === 0) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-xl p-3">
        <p className="text-xs font-semibold text-fg-primary mb-1">{subject}</p>
        <p className="text-[10px] text-gray-600">No attempts yet</p>
      </div>
    );
  }

  const { total, accuracyPct, status } = stats;

  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-fg-primary">{subject}</p>
        <span className={`text-[10px] font-semibold ${STATUS_COLOR[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="h-2 rounded-full bg-bg-panel overflow-hidden mb-1.5">
        <div
          style={{ width: `${accuracyPct}%` }}
          className={`h-full ${
            status === "W" ? "bg-red-500" : status === "M" ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{accuracyPct}% accuracy</span>
        <span>{total} question{total === 1 ? "" : "s"} attempted</span>
      </div>
    </div>
  );
}