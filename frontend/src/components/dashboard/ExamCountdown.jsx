// ============================================================
//  JNEET+ AI — components/dashboard/ExamCountdown.jsx  (v2 —
//  readability fix + wording fix)
//  FIXED (root cause of "countdown invisible in light mode"):
//    - Digit component had `text-white` HARDCODED. In light mode
//      the digit boxes sit on bg-bg-panel (near-white), so white
//      text on a near-white box was genuinely invisible — this
//      wasn't a "faded on purpose" look, it was a real bug.
//      Swapped to text-fg-primary, which is dark in light mode
//      and light in dark mode, like every other themed text in
//      the app.
//    - "Choose target" → "Set target" (shorter, clearer, matches
//      the active-verb style used elsewhere in the app, e.g.
//      "Change Target Exam").
//    - That corner label is now an actual button (was just a
//      static span) that opens the target-exam modal directly —
//      previously it looked like it should be clickable but did
//      nothing, which is exactly the kind of "looks interactive,
//      isn't" issue this project has hit before. New optional
//      onChangeTarget prop; falls back to a plain span if the
//      prop isn't passed, so this stays backward-compatible with
//      any other place ExamCountdown might be used without it.
//    - "Final stretch" message: amber-500/80 → amber-600, which
//      has readable contrast on BOTH the near-black dark-mode
//      background and the near-white light-mode one (500 was
//      tuned for dark backgrounds only).
//  UNCHANGED: countdown calculation logic, urgent threshold,
//  tentative-date handling, hasPassed fallback state.
// ============================================================

import { useState, useEffect } from "react";
import { Timer, CalendarX } from "lucide-react";
import { getTargetExam, getDefaultTargetExam } from "../../config/targetExams.js";

function getExamInfo(targetExamKey) {
  const selected = targetExamKey ? getTargetExam(targetExamKey) : null;
  const fallback = getDefaultTargetExam();
  const info = selected ?? fallback;

  if (!info) return null; // extreme edge case: no upcoming exams in the list at all

  return {
    target: new Date(info.date),
    label: info.label,
    tentative: !!info.tentative,
    isFallback: !selected,
  };
}

function formatCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(ms / 1000);
  const days    = Math.floor(totalSec / 86400);
  const hours   = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function Digit({ value, label, urgent }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`bg-bg-panel border rounded-xl px-3 py-2 min-w-[48px] text-center transition-colors duration-300
          ${urgent ? "border-amber-600/50 shadow-glow-sm" : "border-bg-border"}`}
      >
        <span className="text-xl font-bold text-fg-primary tabular-nums font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function ExamCountdown({ targetExam, onChangeTarget }) {
  const examInfo = getExamInfo(targetExam);

  const [countdown, setCountdown] = useState(
    { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    if (!examInfo || examInfo.target.getTime() <= Date.now()) return;
    const tick = () => setCountdown(formatCountdown(examInfo.target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examInfo?.target?.getTime()]);

  // No upcoming exam at all in the config — shouldn't normally happen
  if (!examInfo) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-600">No upcoming exam dates available right now.</p>
      </div>
    );
  }

  const hasPassed = examInfo.target.getTime() <= Date.now();

  const dateStr = examInfo.target.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Defensive case: a previously-saved target's date has since passed
  // (e.g. the exam happened between the user's last visit and today)
  if (hasPassed) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-4 flex items-center gap-3 animate-fade-up">
        <CalendarX size={16} className="text-gray-600 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-fg-primary">{examInfo.label} has already taken place</p>
          <p className="text-[11px] text-gray-600 mt-0.5">Update your target exam to keep the countdown accurate.</p>
        </div>
      </div>
    );
  }

  const urgent = countdown.days <= 30;

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-4 animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <Timer size={14} className="text-violet-500" />
        <span className="text-xs font-semibold text-fg-primary">{examInfo.label} Countdown</span>
        <span className="ml-auto text-[10px] text-gray-600">
          {examInfo.isFallback ? (
            onChangeTarget ? (
              <button
                type="button"
                onClick={onChangeTarget}
                className="link-accent font-medium transition"
              >
                Set target
              </button>
            ) : (
              "Set target"
            )
          ) : examInfo.tentative ? (
            `~${dateStr} (tentative)`
          ) : (
            dateStr
          )}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Digit value={countdown.days}    label="Days"  urgent={urgent} />
        <span className="text-gray-600 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.hours}   label="Hours" urgent={urgent} />
        <span className="text-gray-600 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.minutes} label="Mins"  urgent={urgent} />
        <span className="text-gray-600 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.seconds} label="Secs"  urgent={urgent} />
      </div>

      {urgent && (
        <p className="text-center text-[11px] text-amber-600 mt-3 animate-pulse-soft">
          Final stretch! {countdown.days} days remaining.
        </p>
      )}

      {examInfo.tentative && (
        <p className="text-center text-[10px] text-gray-600 mt-2">
          Official date not yet announced by NTA — based on past-year trends.
        </p>
      )}
    </div>
  );
}