// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — pages/MistakeNotebook.jsx  (/mistakes)
//  Every question you got wrong (or skipped in a full test) lands
//  here automatically. It comes back for revision after 1 day, then
//  3 days; two right answers in a row clear it. Pro & Elite; free
//  users see their counts.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookX, CheckCircle2, Lock, RotateCcw, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGoBack } from "../hooks/useGoBack.js";
import { mistakesApi } from "../api/testApi.js";
import { CbtQuestion } from "../components/tests/CbtQuestion.jsx";
import { ExplainWithAi } from "../components/tests/ExplainWithAi.jsx";
import { MathTex } from "../components/learn/MathTex.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";

const TABS = [["due", "Due today"], ["open", "All open"], ["cleared", "Cleared"]];

function Stat({ label, value, tone = "" }) {
  return (
    <div className="glass-panel rounded-2xl p-3.5 text-center">
      <p className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      <p className="text-[11px] text-gray-600 mt-0.5">{label}</p>
    </div>
  );
}

const when = (d) => {
  const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  return days <= 0 ? "due now" : days === 1 ? "tomorrow" : `in ${days} days`;
};

function Review({ items, onDone }) {
  const [i, setI] = useState(0);
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const m = items[i];
  const typed = m?.q.type === "numeric" || m?.q.type === "fill_blank";

  const check = async () => {
    setBusy(true);
    try {
      const body = typed ? { textAnswer: value == null ? "" : String(value) } : { selectedIndex: value };
      const { data } = await mistakesApi.answer(m.id, body);
      setResult(data);
    } catch {
      toast.error("Could not check the answer. Try again.");
    } finally {
      setBusy(false);
    }
  };
  const next = () => {
    if (i + 1 >= items.length) return onDone();
    setI(i + 1); setValue(null); setResult(null);
  };

  if (!m) return null;
  const q = { ...m.q, questionId: m.q.questionId ?? m.id };
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">Question {i + 1} of {items.length} · {m.subject} · {m.chapter}</p>
      {q.type === "fill_blank" ? (
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <p className="text-sm">{q.questionText}</p>
          <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} disabled={!!result}
            className="w-full rounded-xl border border-bg-border bg-bg-card px-3 py-2 text-sm" placeholder="Type the missing word" />
        </div>
      ) : (
        <CbtQuestion question={q} number={i + 1} value={value} onChange={result ? () => {} : (_id, v) => setValue(v)} />
      )}

      {!result ? (
        <button type="button" onClick={check} disabled={busy || value === null || value === ""}
          className="w-full rounded-xl bg-teal-600 text-white text-sm font-semibold py-2.5 disabled:opacity-50">
          Check answer
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl p-3 text-sm font-semibold flex items-center gap-2 ${result.correct ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-600"}`}>
            {result.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {result.correct
              ? (result.mistake.resolvedAt ? "Right again — cleared from your notebook!" : `Right! It comes back ${when(result.mistake.nextReviewAt)} for one more check.`)
              : `Not yet. Answer: ${typed ? result.answers.join(" / ") : `option ${result.correctIndex + 1}`}. It comes back tomorrow.`}
          </div>
          {result.explanation && <p className="text-xs text-gray-600 bg-bg-panel border border-bg-border rounded-xl p-3"><MathTex>{result.explanation}</MathTex></p>}
          {q.source === "pyq" && <ExplainWithAi key={m.id} questionId={q.questionId} />}
          <button type="button" onClick={next} className="w-full rounded-xl border border-bg-border text-sm font-semibold py-2.5">
            {i + 1 >= items.length ? "Finish" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MistakeNotebook() {
  const goBack = useGoBack("/dashboard");
  const [summary, setSummary] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [tab, setTab] = useState("due");
  const [subject, setSubject] = useState("");
  const [items, setItems] = useState([]);
  const [reviewing, setReviewing] = useState(null);

  const [reloadKey, setReloadKey] = useState(0);
  const load = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => { document.title = "Mistake Notebook — JNEET+ AI"; }, []);
  useEffect(() => {
    let off = false;
    mistakesApi.summary()
      .then(async ({ data }) => {
        if (off) return;
        setLoadFailed(false);
        setSummary(data);
        if (!data.unlocked) return;
        const res = await mistakesApi.list({ status: tab, ...(subject ? { subject } : {}), limit: 50 });
        if (!off) setItems(res.data.items);
      })
      .catch(() => { if (!off) setLoadFailed(true); });
    return () => { off = true; };
  }, [tab, subject, reloadKey]);

  const startReview = async () => {
    const { data } = await mistakesApi.list({ status: "due", ...(subject ? { subject } : {}), limit: 10 });
    if (data.items.length) setReviewing(data.items);
  };
  const master = async (id) => {
    await mistakesApi.master(id).catch(() => {});
    load();
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={reviewing ? () => { setReviewing(null); load(); } : goBack} title="Back"
          className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">Mistake Notebook</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        {reviewing ? (
          <Review items={reviewing} onDone={() => { setReviewing(null); load(); toast.success("Revision done!"); }} />
        ) : !summary && loadFailed ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-gray-600">Couldn&apos;t load your Mistake Notebook. Please check your internet.</p>
            <button type="button" onClick={load} className="min-h-[44px] px-5 rounded-xl bg-violet-600 text-white text-sm font-semibold">Try again</button>
          </div>
        ) : !summary ? (
          <PageLoader />
        ) : (
          <>
            <p className="text-sm text-gray-600">Every question you get wrong in a test or revision lands here. It comes back after 1 day, then 3 days — get it right twice in a row and it&apos;s cleared.</p>
            <div className="grid grid-cols-3 gap-2.5">
              <Stat label="Due today" value={summary.due} tone="text-red-600" />
              <Stat label="Open" value={summary.open} />
              <Stat label="Cleared this week" value={summary.clearedThisWeek} tone="text-emerald-600" />
            </div>

            {!summary.unlocked ? (
              <div className="glass-panel rounded-2xl p-5 text-center space-y-2">
                <Lock size={18} className="mx-auto text-gray-600" />
                <p className="text-sm font-semibold">{summary.open ? `${summary.open} mistakes are waiting for you` : "Your notebook fills up as you practise"}</p>
                <p className="text-xs text-gray-600">Revising your own mistakes (with AI explanations for PYQs) is part of Pro and Elite.</p>
                <Link to="/plans" className="inline-block text-sm font-semibold underline">See plans</Link>
              </div>
            ) : (
              <>
                <button type="button" onClick={startReview} disabled={!summary.due}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white text-sm font-semibold py-3 disabled:opacity-50">
                  <RotateCcw size={16} /> {summary.due ? `Revise ${Math.min(summary.due, 10)} due now` : "Nothing due — come back tomorrow"}
                </button>

                <div className="flex flex-wrap gap-2">
                  {TABS.map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setTab(id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${tab === id ? "bg-teal-600 text-white border-teal-600" : "border-bg-border"}`}>{label}</button>
                  ))}
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject"
                    className="ml-auto rounded-lg border border-bg-border bg-bg-card text-xs px-2 py-1.5">
                    <option value="">All subjects</option>
                    {summary.bySubject.map((s) => <option key={s.subject} value={s.subject}>{s.subject} ({s.open})</option>)}
                  </select>
                </div>

                {items.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-6 text-center text-sm text-gray-600">
                    <BookX size={20} className="mx-auto mb-2" />
                    {tab === "cleared" ? "Nothing cleared yet." : "No mistakes here. Take a test or a revision to fill your notebook."}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((m) => (
                      <li key={m.id} className="glass-panel rounded-xl p-3 flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-gray-600">{m.subject} · {m.chapter}{m.q.pyqLabel ? ` · PYQ ${m.q.pyqLabel}` : ""}</p>
                          <p className="text-sm line-clamp-2"><MathTex>{m.q.questionText || "Official NTA question (image)"}</MathTex></p>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            {m.resolvedAt ? "Cleared" : `${m.reason === "skipped" ? "Skipped" : `Wrong ×${m.wrongCount}`} · ${when(m.nextReviewAt)}`}
                          </p>
                        </div>
                        {!m.resolvedAt && (
                          <button type="button" onClick={() => master(m.id)} className="text-[11px] font-semibold text-gray-600 hover:text-fg-primary shrink-0">I know this</button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
