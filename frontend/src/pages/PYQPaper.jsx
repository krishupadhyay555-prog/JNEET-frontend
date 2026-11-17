// ============================================================
//  JNEET+ AI — pages/PYQPaper.jsx
//  One official paper (/pyq/:id), or every PYQ of one chapter
//  (/pyq/chapter?subject=…&chapter=…). Subject tabs for a full paper.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useGoBack } from "../hooks/useGoBack.js";
import { pyqApi } from "../api/pyqApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { PyqQuestion } from "../components/pyq/PyqQuestion.jsx";

export default function PYQPaper() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { examMode } = useAuth();
  const goBack = useGoBack();
  const isChapter = !id;
  const subjectParam = params.get("subject") ?? "";
  const chapterParam = params.get("chapter") ?? "";
  const key = `${examMode}|${id ?? ""}|${subjectParam}|${chapterParam}`;
  const [loaded, setLoaded] = useState({ key: null, paper: null, questions: [], error: "" });
  const state = loaded.key === key ? { loading: false, ...loaded } : { loading: true, paper: null, questions: [], error: "" };
  const [tab, setTab] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const req = isChapter ? pyqApi.chapter(subjectParam, chapterParam) : pyqApi.paper(id);
    req
      .then((r) => {
        if (cancelled) return;
        if (isChapter) setLoaded({ key, paper: null, questions: r.data.questions ?? [], error: "" });
        else setLoaded({ key, paper: r.data.paper, questions: r.data.paper.questions ?? [], error: "" });
        setTab(null);
        window.scrollTo(0, 0);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e?.response?.status === 404 ? "This paper isn't available for your exam." : "Couldn't load these questions. Check your internet and try again.";
        setLoaded({ key, paper: null, questions: [], error: msg });
      });
    return () => { cancelled = true; };
  }, [key, id, isChapter, subjectParam, chapterParam]);

  const subjects = useMemo(() => [...new Set(state.questions.map((q) => q.subject))], [state.questions]);
  const active = tab ?? subjects[0] ?? null;
  const shown = isChapter ? state.questions : state.questions.filter((q) => q.subject === active);
  const title = isChapter ? chapterParam : state.paper?.title ?? "Paper";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} aria-label="Back" className="text-gray-500 hover:text-fg-primary transition p-2 rounded-lg hover:bg-bg-hover">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm truncate">{title}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        {state.loading ? (
          <div className="flex justify-center py-16"><Spinner size={20} /></div>
        ) : state.error ? (
          <p className="text-xs text-red-500 text-center pt-8">{state.error}</p>
        ) : (
          <>
            {isChapter ? (
              <p className="text-xs text-gray-600">{subjectParam} · {state.questions.length} question{state.questions.length === 1 ? "" : "s"} from official papers, newest first.</p>
            ) : (
              <>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Source: NTA question paper{state.paper.paperHost ? ` (candidate copy, hosted on ${state.paper.paperHost}; every Question ID checked against NTA's key)` : ""}{" "}
                  {state.paper.paperPdf
                    ? <a href={state.paper.paperPdf} target="_blank" rel="noopener noreferrer" className="text-violet-600 inline-flex items-center gap-0.5">PDF <ExternalLink size={10} /></a>
                    : null}
                  {" "}· Answers: NTA final answer key{" "}
                  <a href={state.paper.keyPdf} target="_blank" rel="noopener noreferrer" className="text-violet-600 inline-flex items-center gap-0.5">PDF <ExternalLink size={10} /></a>
                  {state.paper.questions?.some((q) => q.explanation)
                    ? " · Explanations by JNEET+ AI."
                    : " · Questions shown exactly as in NTA's paper. Explanations: coming soon."}
                </p>
                <div className="rounded-2xl p-1.5 flex gap-1.5 sticky top-[57px] z-[5] bg-bg-surface border border-bg-border shadow-sm" role="tablist" aria-label="Subject">
                  {subjects.map((s) => (
                    <button key={s} role="tab" aria-selected={active === s} onClick={() => { setTab(s); window.scrollTo(0, 0); }}
                      className={`flex-1 text-xs font-medium px-3 py-2 rounded-xl transition
                        ${active === s ? "bg-violet-600 text-white" : "text-gray-600 hover:text-fg-primary"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="space-y-3">
              {shown.map((q) => (
                <PyqQuestion key={`${q.paper?.id ?? id}-${q.n}`} q={q} paperId={q.paper?.id ?? id} paperTitle={state.paper?.title} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
