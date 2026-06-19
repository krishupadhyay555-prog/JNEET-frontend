import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { getTargetExam } from "../../config/targetExams.js";

function getExamDate(targetExamKey) {
  const selected = getTargetExam(targetExamKey);
  const fallback = getTargetExam("NEET_2027");
  const info = selected ?? fallback;

  return {
    target: new Date(info.date),
    label: info.label,
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

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-bg-panel border border-bg-border rounded-xl px-3 py-2 min-w-[48px] text-center">
        <span className="text-xl font-bold text-white tabular-nums font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] text-gray-700 mt-1 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function ExamCountdown({ targetExam }) {
  const { target, label, isFallback } = getExamDate(targetExam);
  const [countdown, setCountdown] = useState(
    { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const dateStr = target.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Timer size={14} className="text-violet-400" />
        <span className="text-xs font-semibold text-gray-300">{label} Countdown</span>
        <span className="ml-auto text-[10px] text-gray-700">
          {isFallback ? "Choose target" : dateStr}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Digit value={countdown.days}    label="Days"  />
        <span className="text-gray-700 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.hours}   label="Hours" />
        <span className="text-gray-700 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.minutes} label="Mins"  />
        <span className="text-gray-700 text-lg font-bold mb-4">:</span>
        <Digit value={countdown.seconds} label="Secs"  />
      </div>

      {countdown.days <= 30 && (
        <p className="text-center text-[11px] text-amber-500/80 mt-3 animate-pulse-soft">
          Final stretch! {countdown.days} days remaining.
        </p>
      )}
    </div>
  );
}
