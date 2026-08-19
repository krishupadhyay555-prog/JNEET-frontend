// ============================================================
//  JNEET+ AI — components/dashboard/TargetExamModal.jsx  (v2)
//  FIX (missing X on first-time registration):
//    - The X (close) button was gated behind `allowLater`, which
//      Dashboard.jsx deliberately sets to false for brand-new
//      accounts (isNewAccount = true) — so first-time users had
//      no way to close this modal at all except picking a target.
//      The X now always renders regardless of allowLater; clicking
//      it behaves exactly like "Later" (dismisses without a target
//      selected, same handleLater() call).
//    - The footer "Later" TEXT button is UNCHANGED — still gated
//      by allowLater, so that specific wording/flow still only
//      shows for returning users, exactly as before.
//  Everything else — exam list, tentative badges, save flow — is
//  UNCHANGED from the previous version.
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
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-surface/90 shadow-card backdrop-blur-xl p-5 animate-scale-in">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="text-violet-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Which NEET exam are you preparing for?</h2>
            <p className="text-xs text-gray-500 mt-1">
              Your dashboard countdown will follow this target.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLater}
            disabled={saving}
            className="text-gray-600 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X size={16} />
          </button>
        </div>

        {upcomingExams.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">
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
                    : "bg-white/[0.03] text-gray-300 border-white/10 hover:border-violet-500/40 hover:bg-white/[0.05]"
                  }`}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="block text-sm font-semibold">{exam.label}</span>
                  {exam.tentative && (
                    <span className="text-[8px] uppercase tracking-wide bg-amber-900/30 text-amber-400 border border-amber-700/30 rounded-full px-1.5 py-0.5">
                      Tentative
                    </span>
                  )}
                </div>
                <span className="block text-[10px] opacity-70 mt-1">
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
          <p className="text-[10px] text-gray-700 mt-3">
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
                className="px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
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