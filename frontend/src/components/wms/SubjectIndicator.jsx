// ============================================================
//  JNEET+ AI — components/wms/SubjectIndicator.jsx  (v3 — polished)
//  CHANGED: added a per-subject icon (Physics/Chemistry/Biology/
//  Mathematics) for quicker visual scanning, and switched status
//  colors from 400-stop (text-red-400 etc — too light in light
//  mode) to the safe 600-stop + 15%-tint-badge pattern already
//  established on Dashboard's feature-card badges.
//  Prop shape UNCHANGED — still { subject, stats }.
// ============================================================

import { Atom, FlaskConical, Dna, Sigma } from "lucide-react";

const SUBJECT_ICON = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
  Mathematics: Sigma,
};

const STATUS_LABEL = { W: "Weak", M: "Medium", S: "Strong" };
const STATUS_CLASS = {
  W: "text-red-600 bg-red-600/10",
  M: "text-amber-600 bg-amber-600/10",
  S: "text-emerald-600 bg-emerald-600/10",
};
const BAR_CLASS = {
  W: "bg-red-600",
  M: "bg-amber-600",
  S: "bg-emerald-600",
};

export function SubjectIndicator({ subject, stats }) {
  const Icon = SUBJECT_ICON[subject] ?? Atom;

  if (!stats || stats.total === 0) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-xl p-3.5">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className="text-gray-500" />
          <p className="text-xs font-semibold text-fg-primary">{subject}</p>
        </div>
        <p className="text-[10px] text-gray-600">No attempts yet</p>
      </div>
    );
  }

  const { total, accuracyPct, status } = stats;

  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-500" />
          <p className="text-xs font-semibold text-fg-primary">{subject}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="h-2 rounded-full bg-bg-panel overflow-hidden mb-2">
        <div
          style={{ width: `${accuracyPct}%`, transition: "width 0.5s ease-out" }}
          className={`h-full rounded-full ${BAR_CLASS[status]}`}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-600">
        <span className="font-medium text-fg-primary">{accuracyPct}%</span>
        <span>{total} question{total === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}