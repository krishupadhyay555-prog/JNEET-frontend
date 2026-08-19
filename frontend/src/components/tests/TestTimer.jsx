// ============================================================
//  JNEET+ AI — components/tests/TestTimer.jsx
//  Simple elapsed-time display — counts up from test start.
//  Not an enforced countdown (no auto-submit) — just feedback for
//  the student. Keeping it simple deliberately for the MVP.
// ============================================================

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function TestTimer({ startedAt }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium tabular-nums">
      <Clock size={13} />
      {mins}:{secs}
    </div>
  );
}