// ============================================================
//  JNEET+ AI — pages/OneShot.jsx
//  List of chapters that have a OneShot (short summary, all important
//  formulas, solved examples, key topics) for the student's exam.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useGoBack } from "../hooks/useGoBack.js";
import { oneshotApi } from "../api/learnApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Physics", "Chemistry", "Mathematics"],
};

export default function OneShot() {
  const { examMode } = useAuth();
  const goBack = useGoBack();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;
  // Keyed by exam: when the exam changes, the old list is simply "not
  // loaded yet" (no reset needed inside the effect).
  const [loaded, setLoaded] = useState({ key: null, chapters: [], error: "" });
  const state = loaded.key === examMode
    ? { loading: false, chapters: loaded.chapters, error: loaded.error }
    : { loading: true, chapters: [], error: "" };
  const [subject, setSubject] = useState("All");

  useEffect(() => {
    let cancelled = false;
    oneshotApi.list()
      .then((r) => { if (!cancelled) setLoaded({ key: examMode, chapters: r.data.chapters ?? [], error: "" }); })
      .catch(() => { if (!cancelled) setLoaded({ key: examMode, chapters: [], error: "OneShot load nahi ho paya. Internet check karke dobara kholo." }); });
    return () => { cancelled = true; };
  }, [examMode]);

  const shown = useMemo(
    () => state.chapters.filter((c) => subject === "All" || c.subject === subject),
    [state.chapters, subject]
  );

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} aria-label="Back" className="text-gray-500 hover:text-fg-primary transition p-2 rounded-lg hover:bg-bg-hover">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">OneShot</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-7 space-y-5">
        <div>
          <h1 className="text-lg font-bold mb-1">Poora chapter, ek baar mein</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Short summary, saare important formulas (kab use karein + common galti), solved examples aur key topics —
            exam se pehle fast revision ke liye. Har page verified hai.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5" role="tablist" aria-label="Subject">
          {["All", ...subjects].map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={subject === s}
              onClick={() => setSubject(s)}
              className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition
                ${subject === s ? "bg-violet-600 text-white" : "text-gray-600 hover:text-fg-primary"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {state.loading ? (
          <div className="flex justify-center py-16"><Spinner size={20} /></div>
        ) : state.error ? (
          <p className="text-xs text-red-500 text-center pt-8">{state.error}</p>
        ) : shown.length === 0 ? (
          <p className="text-xs text-gray-600 text-center pt-8">{subject} ke OneShot jald aa rahe hain.</p>
        ) : (
          <ul className="space-y-2">
            {shown.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/oneshot/${c.slug}`}
                  className="glass-panel rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-violet-600/40 transition group"
                >
                  <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <BookOpen size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">{c.title}</span>
                    <span className="block text-[11px] text-gray-600 mt-0.5">
                      {c.subject} · <Clock size={10} className="inline -mt-0.5" /> ~{c.readMinutes} min · {c.formulaCount} formula cards
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-gray-600 group-hover:text-violet-500 transition" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!state.loading && !state.error && (
          <p className="text-[11px] text-gray-600 text-center">Aur chapters har hafte jud rahe hain.</p>
        )}
      </div>
    </div>
  );
}
