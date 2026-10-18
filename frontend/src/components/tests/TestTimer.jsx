// ============================================================
//  JNEET+ AI — components/tests/TestTimer.jsx  (v2 — real countdown)
//  Full mocks are timed like the real exam (NEET 200 min, JEE 180 min).
//  The clock is computed from the SERVER's start time, so refreshing,
//  closing the tab or switching devices can never reset or pause it.
//  With no durationMinutes it falls back to a simple elapsed timer
//  (used by anything untimed). onExpire fires exactly once at zero.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");

function fmt(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function TestTimer({ startedAt, durationMinutes = null, onExpire }) {
  const start = new Date(startedAt).getTime();
  const total = durationMinutes ? durationMinutes * 60 : null;
  const compute = () => {
    const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
    return total ? total - elapsed : elapsed;
  };
  const [value, setValue] = useState(compute);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; });

  useEffect(() => {
    const tick = () => {
      const v = (() => {
        const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
        return total ? total - elapsed : elapsed;
      })();
      setValue(v);
      if (total && v <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start, total]);

  const shown = total ? Math.max(0, value) : value;
  const low = total && shown <= 600;      // last 10 minutes
  const critical = total && shown <= 60;

  return (
    <div
      role="timer"
      aria-label={total ? "Time remaining" : "Time elapsed"}
      className={`flex items-center gap-1.5 text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border transition-colors
        ${critical ? "text-red-500 border-red-500/40 bg-red-500/10 animate-pulse-soft"
          : low ? "text-amber-600 border-amber-600/40 bg-amber-600/10"
          : "text-gray-600 border-transparent"}`}
    >
      <Clock size={13} />
      {fmt(shown)}
    </div>
  );
}
