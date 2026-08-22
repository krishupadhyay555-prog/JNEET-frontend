// ============================================================
//  JNEET+ AI — components/wms/WeaknessCard.jsx  (v3 — polished)
//  CHANGED: added a rank number (relies on the list already being
//  sorted weakest-first by the backend) so the "focus first" order
//  is visually obvious, not just implied by position. Switched
//  status colors from 400-stop to safe 600-stop pattern, matching
//  SubjectIndicator v3 and Dashboard's badges.
//  New optional `rank` prop — defaults to null (renders no number)
//  so this stays backward-compatible if used anywhere without it.
// ============================================================

const STATUS_LABEL = { W: "Weak", M: "Medium", S: "Strong" };
const STATUS_CLASS = {
  W: "text-red-600 bg-red-600/10 border-red-600/25",
  M: "text-amber-600 bg-amber-600/10 border-amber-600/25",
  S: "text-emerald-600 bg-emerald-600/10 border-emerald-600/25",
};
const RANK_CLASS = {
  W: "bg-red-600/10 text-red-600",
  M: "bg-amber-600/10 text-amber-600",
  S: "bg-emerald-600/10 text-emerald-600",
};

export function WeaknessCard({ entry, rank = null }) {
  const { subject, chapter, accuracyPct, total, status } = entry;

  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-3.5 flex items-center gap-3">
      {rank !== null && (
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${RANK_CLASS[status]}`}>
          {rank}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg-primary truncate">{chapter}</p>
        <p className="text-[11px] text-gray-600">
          {subject} · {total} question{total === 1 ? "" : "s"} attempted
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-fg-primary tabular-nums">{accuracyPct}%</span>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
    </div>
  );
}