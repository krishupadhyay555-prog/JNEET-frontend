// ============================================================
//  JNEET+ AI — pages/PYQ.jsx
//  Previous-year questions for the student's exam:
//   • By paper — pick a year, then a paper (date + shift).
//   • By chapter — every PYQ of one chapter, across all papers.
//  Only official NTA papers; every answer is NTA's final answer key.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, FileText, Layers } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useGoBack } from "../hooks/useGoBack.js";
import { pyqApi } from "../api/pyqApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";

const SUBJECTS_BY_EXAM = {
  NEET: ["Physics", "Chemistry", "Biology"],
  JEE:  ["Mathematics", "Physics", "Chemistry"],
};

const fmtDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
};

export default function PYQ() {
  const { examMode } = useAuth();
  const goBack = useGoBack();
  const subjects = SUBJECTS_BY_EXAM[examMode] ?? SUBJECTS_BY_EXAM.NEET;
  const [view, setView] = useState("paper");
  const [loaded, setLoaded] = useState({ key: null, years: [], chapters: [], error: "" });
  const state = loaded.key === examMode
    ? { loading: false, ...loaded }
    : { loading: true, years: [], chapters: [], error: "" };
  const [year, setYear] = useState(null);
  const [subject, setSubject] = useState(subjects[0]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([pyqApi.list(), pyqApi.chapters()])
      .then(([p, c]) => {
        if (cancelled) return;
        setLoaded({ key: examMode, years: p.data.years ?? [], chapters: c.data.chapters ?? [], error: "" });
        setYear(null);
      })
      .catch(() => { if (!cancelled) setLoaded({ key: examMode, years: [], chapters: [], error: "Couldn't load PYQs. Check your internet and open it again." }); });
    return () => { cancelled = true; };
  }, [examMode]);

  const activeYear = year ?? state.years[0]?.year ?? null;
  const papers = useMemo(() => state.years.find((y) => y.year === activeYear)?.papers ?? [], [state.years, activeYear]);
  const subjectSafe = subjects.includes(subject) ? subject : subjects[0];
  const chapters = useMemo(() => state.chapters.filter((c) => c.subject === subjectSafe), [state.chapters, subjectSafe]);
  const examName = examMode === "JEE" ? "JEE Main" : "NEET UG";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} aria-label="Back" className="text-gray-500 hover:text-fg-primary transition p-2 rounded-lg hover:bg-bg-hover">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Previous Year Questions</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-7 space-y-5">
        <div>
          <h1 className="text-lg font-bold mb-1">{examName} PYQs</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Real questions from NTA's official papers. Every answer is NTA's final answer key, and every
            explanation is ours. Try a question first, then check.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5" role="tablist" aria-label="View">
          {[["paper", "By paper", <FileText key="i" size={13} />], ["chapter", "By chapter", <Layers key="i" size={13} />]].map(([v, label, icon]) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition inline-flex items-center justify-center gap-1.5
                ${view === v ? "bg-violet-600 text-white" : "text-gray-600 hover:text-fg-primary"}`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {state.loading ? (
          <PageLoader />
        ) : state.error ? (
          <p className="text-xs text-red-500 text-center pt-8">{state.error}</p>
        ) : state.years.length === 0 ? (
          <p className="text-xs text-gray-600 text-center pt-8">{examName} PYQs are being added — check back soon.</p>
        ) : view === "paper" ? (
          <>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Year">
              {state.years.map((y) => (
                <button key={y.year} role="tab" aria-selected={activeYear === y.year} onClick={() => setYear(y.year)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition
                    ${activeYear === y.year ? "border-violet-600 bg-violet-600 text-white" : "border-bg-border text-gray-600 hover:text-fg-primary"}`}>
                  {y.year}
                </button>
              ))}
            </div>
            <ul className="space-y-2">
              {papers.map((p) => (
                <li key={p.id}>
                  <Link to={`/pyq/${p.id}`}
                    className="glass-panel rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-violet-600/40 transition group">
                    <span className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate">
                        {fmtDate(p.date)}{p.shift ? ` · Shift ${p.shift}` : ""}
                      </span>
                      <span className="block text-[11px] text-gray-600 mt-0.5">
                        {p.session ? `Session ${p.session} · ` : ""}{p.total} questions · {Object.entries(p.counts).map(([s, n]) => `${s} ${n}`).join(" · ")}
                      </span>
                    </span>
                    <ChevronRight size={15} className="text-gray-600 group-hover:text-violet-500 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="glass-panel rounded-2xl p-1.5 flex gap-1.5" role="tablist" aria-label="Subject">
              {subjects.map((s) => (
                <button key={s} role="tab" aria-selected={subjectSafe === s} onClick={() => setSubject(s)}
                  className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition
                    ${subjectSafe === s ? "bg-violet-600 text-white" : "text-gray-600 hover:text-fg-primary"}`}>
                  {s}
                </button>
              ))}
            </div>
            {chapters.length === 0 ? (
              <p className="text-xs text-gray-600 text-center pt-6">No {subjectSafe} PYQs yet.</p>
            ) : (
              <ul className="space-y-2">
                {chapters.map((c) => (
                  <li key={c.chapter}>
                    <Link to={`/pyq/chapter?subject=${encodeURIComponent(c.subject)}&chapter=${encodeURIComponent(c.chapter)}`}
                      className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-violet-600/40 transition group">
                      <span className="flex-1 min-w-0 text-sm font-medium truncate">{c.chapter}</span>
                      <span className="text-[11px] text-gray-600">{c.count} Q</span>
                      <ChevronRight size={15} className="text-gray-600 group-hover:text-violet-500 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {!state.loading && !state.error && state.years.length > 0 && (
          <p className="text-[11px] text-gray-600 text-center">
            More years and shifts are added every week.{examMode === "JEE" ? " JEE Advanced PYQs: coming soon (after JEE Main results)." : ""}
          </p>
        )}
      </div>
    </div>
  );
}
