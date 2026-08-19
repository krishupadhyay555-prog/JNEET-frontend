// ============================================================
//  JNEET+ AI — components/tests/TestCard.jsx  (v2 — glass panel)
//  Same behavior as before, now using .glass-panel for the
//  premium/consistent look instead of flat bg-bg-card.
// ============================================================

import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";

export function TestCard({ chapterInfo, onStart, starting }) {
  const { chapter, easy, moderate, tough, total } = chapterInfo;
  const [open, setOpen] = useState(false);
  const [mix, setMix] = useState({
    easy: Math.min(easy, 5),
    moderate: Math.min(moderate, 5),
    tough: Math.min(tough, 5),
  });

  const clamp = (val, max) => Math.max(0, Math.min(val, max));

  const handleStart = () => {
    onStart(chapter, mix);
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden transition-all duration-200 hover:border-violet-600/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div>
          <p className="text-sm font-medium text-fg-primary">{chapter}</p>
          <p className="text-[11px] text-gray-600 mt-0.5">
            {total} question{total === 1 ? "" : "s"} available
          </p>
        </div>
        <ChevronDown
          size={15}
          className={`text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 animate-fade-up border-t border-bg-border pt-3">
          {[
            { key: "easy",     label: "Easy",     max: easy },
            { key: "moderate", label: "Moderate", max: moderate },
            { key: "tough",    label: "Tough",    max: tough },
          ].map((d) => (
            <div key={d.key} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {d.label} <span className="text-gray-700">({d.max} available)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMix((p) => ({ ...p, [d.key]: clamp(p[d.key] - 1, d.max) }))}
                  className="w-6 h-6 rounded-lg bg-bg-panel border border-bg-border text-fg-primary text-xs hover:border-violet-600/40 transition"
                >
                  −
                </button>
                <span className="w-6 text-center text-xs font-semibold text-fg-primary tabular-nums">
                  {mix[d.key]}
                </span>
                <button
                  type="button"
                  onClick={() => setMix((p) => ({ ...p, [d.key]: clamp(p[d.key] + 1, d.max) }))}
                  className="w-6 h-6 rounded-lg bg-bg-panel border border-bg-border text-fg-primary text-xs hover:border-violet-600/40 transition"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleStart}
            disabled={starting || (mix.easy + mix.moderate + mix.tough === 0)}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500
              disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-xl
              transition-all duration-150 active:scale-[0.98]"
          >
            <Play size={13} />
            {starting ? "Starting..." : `Start Test (${mix.easy + mix.moderate + mix.tough} questions)`}
          </button>
        </div>
      )}
    </div>
  );
}