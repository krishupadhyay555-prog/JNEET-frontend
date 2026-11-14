// ============================================================
//  JNEET+ AI — components/chat/RecapBanner.jsx
//  A slim strip at the top of the chat every time it opens:
//  "Last time you studied: <chapters> — 5 questions".
//  Only shown when the server found an honest recap (chapters from our
//  own syllabus list + verified bank questions). Hiding it lasts for
//  this visit only — next time the chat opens, it shows again.
// ============================================================

import { History, X, ArrowRight, Loader2 } from "lucide-react";
import { recapChapterText } from "../../hooks/useRecap.js";

export function RecapBanner({ recap, starting, onStart, onDismiss }) {
  if (!recap) return null;
  const chapters = recapChapterText(recap);

  return (
    <div className="px-3 sm:px-4 pt-3 shrink-0 animate-fade-in">
      <div className="max-w-3xl mx-auto flex items-center gap-3 rounded-2xl border border-violet-600/25 bg-violet-600/[0.07] pl-3 pr-2 py-2">
        <div className="w-8 h-8 rounded-xl bg-violet-600/15 flex items-center justify-center shrink-0">
          <History size={16} className="text-violet-500" />
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={starting}
          className="flex-1 min-w-0 text-left group focus-visible:outline-none"
        >
          <p className="text-[11px] text-gray-600 leading-tight">Last time you studied</p>
          <p className="text-sm font-semibold text-fg-primary truncate" title={chapters}>
            {chapters}
          </p>
        </button>

        <button
          type="button"
          onClick={onStart}
          disabled={starting}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-2 transition active:scale-95 disabled:opacity-60"
        >
          {starting ? <Loader2 size={14} className="animate-spin" /> : null}
          {recap.questions ?? 5} questions
          {!starting && <ArrowRight size={14} />}
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-fg-primary hover:bg-bg-hover transition"
          aria-label="Hide recap for now"
          title="Not now"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
