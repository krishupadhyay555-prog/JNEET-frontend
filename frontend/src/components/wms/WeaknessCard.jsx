// ============================================================
//  JNEET+ AI — components/wms/WeaknessCard.jsx  (v2 — read-only)
//  REPURPOSED: was an editable self-report card (W/M/S buttons +
//  delete). Now a read-only row showing REAL accuracy for one
//  chapter, derived from Test+Revision history. No edit/delete —
//  there's nothing to edit; this is a live view over attempt data,
//  not a separate stored record (matches "WMS should never have a
//  delete option").
// ============================================================

const STATUS_LABEL = { W: "Weak", M: "Medium", S: "Strong" };
const STATUS_CLASS = {
  W: "text-red-400 bg-red-500/10 border-red-500/25",
  M: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  S: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
};

export function WeaknessCard({ entry }) {
  const { subject, chapter, accuracyPct, total, status } = entry;

  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-3.5 flex items-center justify-between gap-3">
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