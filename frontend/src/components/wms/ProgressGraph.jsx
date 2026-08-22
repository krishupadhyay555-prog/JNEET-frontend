// ============================================================
//  JNEET+ AI — components/wms/ProgressGraph.jsx  (v3 — polished)
//  CHANGED: replaced the flat 3-segment linear bar with a single
//  hero circular progress ring (pure SVG, no chart library) —
//  cleaner than showing the same accuracy number twice in two
//  visual forms. Ring color uses the app's own theme-reactive
//  violet-500 CSS variable (so it correctly follows NEET-teal/
//  JEE-indigo/Normal-gray accent skins, unlike a hardcoded color).
//  Stat chips below use safe emerald-600/red-600/gray-600 (was
//  emerald-400/red-400) — the 400 stop reads too light against a
//  near-white light-mode background, same root-cause pattern
//  already fixed on Dashboard's badges.
//  Props/data shape UNCHANGED — still takes `overall` from the
//  WMS summary API, no backend change needed.
// ============================================================

export function ProgressGraph({ overall }) {
  const { correct = 0, wrong = 0, unattempted = 0, total = 0, accuracyPct = 0 } = overall || {};

  if (total === 0) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-5 text-center">
        <p className="text-xs text-gray-600">
          No test or revision attempts yet — take one to see your progress here.
        </p>
      </div>
    );
  }

  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - accuracyPct / 100);

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
      <div className="flex items-center gap-6">
        <div className="relative w-[130px] h-[130px] shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
            <circle
              cx="65" cy="65" r={r}
              fill="none"
              stroke="rgb(var(--bg-panel))"
              strokeWidth="10"
            />
            <circle
              cx="65" cy="65" r={r}
              fill="none"
              stroke="rgb(var(--violet-500))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-fg-primary tabular-nums">{accuracyPct}%</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Accuracy</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              Correct
            </span>
            <span className="text-sm font-semibold text-emerald-600 tabular-nums">{correct}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              Wrong
            </span>
            <span className="text-sm font-semibold text-red-600 tabular-nums">{wrong}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
              Skipped
            </span>
            <span className="text-sm font-semibold text-gray-600 tabular-nums">{unattempted}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-4 pt-4 border-t border-bg-border">
        Based on {total} question{total === 1 ? "" : "s"} across all tests + revisions
      </p>
    </div>
  );
}