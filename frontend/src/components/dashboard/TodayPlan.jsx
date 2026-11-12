// ============================================================
//  JNEET+ AI — components/dashboard/TodayPlan.jsx
//  "Aaj ka plan": up to three small, honest steps for today —
//    1. Recap of the last chat (only when the server found one)
//    2. One OneShot chapter to read (rotates daily)
//    3. A Revision set (or "continue" when they did one recently)
//  Every step links to a real page; nothing here is made up.
// ============================================================

import { History, BookOpen, RefreshCw, ChevronRight, Loader2 } from "lucide-react";
import { recapChapterText } from "../../hooks/useRecap.js";

function dayIndex(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function pickOneShotForToday(chapters, now = new Date()) {
  if (!chapters?.length) return null;
  return chapters[dayIndex(now) % chapters.length];
}

function PlanRow({ icon, iconBg, title, sub, cta, onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition group
        hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:opacity-60"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg-primary line-clamp-2 leading-snug">{title}</p>
        <p className="text-xs text-gray-600 truncate">{sub}</p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-violet-500 group-hover:text-violet-400">
        {busy ? <Loader2 size={13} className="animate-spin" /> : cta}
        {!busy && <ChevronRight size={14} />}
      </span>
    </button>
  );
}

export function TodayPlan({ recap, recapStarting, onStartRecap, oneshots, onOpenOneShot, revisionSub, onOpenRevision }) {
  const rows = [];
  const oneshot = pickOneShotForToday(oneshots);

  if (recap) {
    rows.push(
      <PlanRow
        key="recap"
        icon={<History size={17} className="text-violet-500" />}
        iconBg="bg-violet-600/10"
        title={`Pichli baar: ${recapChapterText(recap)}`}
        sub={`${recap.questions ?? 5} sawaal se yaad pakka karo`}
        cta="Shuru"
        busy={recapStarting}
        onClick={onStartRecap}
      />
    );
  }

  if (oneshot) {
    rows.push(
      <PlanRow
        key="oneshot"
        icon={<BookOpen size={17} className="text-amber-600" />}
        iconBg="bg-amber-500/10"
        title={`OneShot: ${oneshot.chapter}`}
        sub={`${oneshot.subject} · ${oneshot.readMinutes} min read · ${oneshot.formulaCount} formulas`}
        cta="Padho"
        onClick={() => onOpenOneShot(oneshot.slug)}
      />
    );
  }

  rows.push(
    <PlanRow
      key="revision"
      icon={<RefreshCw size={17} className="text-teal-600" />}
      iconBg="bg-teal-500/10"
      title="Revision set"
      sub={revisionSub}
      cta="Chalo"
      onClick={onOpenRevision}
    />
  );

  return (
    <section className="bg-bg-card border border-bg-border rounded-2xl p-2 mb-6" aria-labelledby="today-plan">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <p id="today-plan" className="text-[10px] text-gray-700 font-medium uppercase tracking-widest">Aaj ka plan</p>
        <p className="text-[10px] text-gray-600">{rows.length} step{rows.length === 1 ? "" : "s"}</p>
      </div>
      <div className="divide-y divide-bg-border/70">{rows}</div>
    </section>
  );
}
