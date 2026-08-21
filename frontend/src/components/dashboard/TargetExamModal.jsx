// ============================================================
//  JNEET+ AI — components/dashboard/TargetExamModal.jsx  (v3 —
//  readability fix)
//  FIXED (root cause of "exam dates/years not clearly visible"):
//  This modal was built with light-mode never considered — every
//  color was hardcoded for a dark background specifically:
//    - "text-white" heading            → text-fg-primary
//    - "border-white/10" card border   → border-bg-border
//    - unselected exam buttons used
//      "bg-white/[0.03] text-gray-300 border-white/10" — on a
//      light-mode white modal, a 3%-white tint is basically
//      invisible, and gray-300 (light gray) text on a near-white
//      background has almost no contrast. This is exactly why
//      the exam dates ("years wagera") looked washed out — the
//      date <span> has no color of its own, it inherits this
//      broken parent color.
//      → swapped to theme tokens: bg-bg-panel / text-gray-500 /
//      border-bg-border, matching the same pattern already used
//      for Dashboard's NEET/JEE mode-select buttons.
//    - Close (X) and "Later" buttons: text-gray-600 hover:white,
//      hover:bg-white/5 → hover:text-fg-primary, hover:bg-bg-hover
//    - CalendarDays icon: text-violet-300 sat inside a
//      bg-violet-600/15 tinted badge — 300 is a LIGHT ramp-stop,
//      which has poor contrast against that light tint in light
//      mode. Darkened to text-violet-600 (visible on the tint in
//      both modes).
//    - Tentative badge: bg-amber-900/30 text-amber-400 → the same
//      "tuned for dark-mode only" issue as elsewhere in the app —
//      swapped to bg-amber-600/15 text-amber-600, readable in
//      both modes.
//  UNCHANGED: modal open/close logic, exam selection/save flow,
//  allowLater gating on the X button and footer "Later" button.
// ============================================================

import { useMemo, useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { getUpcomingTargetExams } from "../../config/targetExams.js";

export function TargetExamModal({ user, open, onClose, onSave, allowLater = true }) {
  const [selected, setSelected] = useState(user?.targetExam ?? "");
  const [saving, setSaving] = useState(false);

  // Computed once per mount — only exams that haven't happened yet.
  const upcomingExams = useMemo(() => getUpcomingTargetExams(), []);

  const selectedExam = useMemo(
    () => upcomingExams.find((exam) => exam.key === selected),
    [selected, upcomingExams]
  );

  if (!open) return null;

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleLater = async () => {
    setSaving(true);
    try {
      await onSave(null, true);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-bg-border bg-bg-surface/95 shadow-card backdrop-blur-xl p-5 animate-scale-in">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-fg-primary">Which NEET exam are you preparing for?</h2>
            <p className="text-xs text-gray-600 mt-1">
              Your dashboard countdown will follow this target.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLater}
            disabled={saving}
            className="text-gray-600 hover:text-fg-primary p-1 rounded-lg hover:bg-bg-hover transition"
          >
            <X size={16} />
          </button>
        </div>

        {upcomingExams.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-6">
            No upcoming exam dates available right now — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {upcomingExams.map((exam, i) => (
              <button
                key={exam.key}
                type="button"
                onClick={() => setSelected(exam.key)}
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
                className={`animate-fade-up rounded-xl border px-3 py-3 text-left transition active:scale-[0.98]
                  ${selected === exam.key
                    ? "bg-violet-600 text-white border-violet-500 shadow-glow-sm"
                    : "bg-bg-panel text-gray-500 border-bg-border hover:border-violet-500/40 hover:bg-bg-hover hover:text-fg-primary"
                  }`}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="block text-sm font-semibold">{exam.label}</span>
                  {exam.tentative && (
                    <span className="text-[8px] uppercase tracking-wide bg-amber-600/15 text-amber-600 border border-amber-600/30 rounded-full px-1.5 py-0.5">
                      Tentative
                    </span>
                  )}
                </div>
                <span className="block text-[10px] opacity-80 mt-1">
                  {exam.tentative ? "~" : ""}
                  {new Date(exam.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </button>
            ))}
          </div>
        )}

        {upcomingExams.some((e) => e.tentative) && (
          <p className="text-[10px] text-gray-600 mt-3">
            Tentative dates are based on past-year trends — NTA hasn't officially confirmed them yet.
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-5">
          <p className="text-[11px] text-gray-600">
            {selectedExam ? `${selectedExam.label} selected` : "Select one option"}
          </p>
          <div className="flex gap-2">
            {allowLater && (
              <button
                type="button"
                onClick={handleLater}
                disabled={saving}
                className="px-3 py-2 rounded-xl border border-bg-border text-xs text-gray-500 hover:text-fg-primary hover:bg-bg-hover transition disabled:opacity-50"
              >
                Later
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!selected || saving}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Target"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}