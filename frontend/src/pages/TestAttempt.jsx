// ============================================================
//  JNEET+ AI — pages/TestAttempt.jsx  (v4 — NTA-style exam screen)
//  Full mocks now look and work like NTA's computer-based test:
//    - section tabs (JEE: Mathematics · Physics · Chemistry; NEET:
//      Physics · Chemistry · Biology) with the answered count;
//    - NTA's palette states: Not visited · Not answered · Answered ·
//      Marked for review · Answered & marked (counts as answered);
//    - NTA's buttons: Save & Next · Clear Response · Mark for Review
//      & Next · Back, and a Submit summary per section;
//    - real PYQs show NTA's own image with "PYQ · <exam · date · shift>";
//      numericals (JEE Section B) take a typed number.
//  Kept from v3: server-based timer (auto-submit at zero), answers kept
//  on this device (refresh / crash safe), exit = submit what is done.
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Send, Bookmark, Eraser, LayoutGrid, X } from "lucide-react";
import { testApi } from "../api/testApi.js";
import { MCQCard } from "../components/tests/MCQCard.jsx";
import { CbtQuestion } from "../components/tests/CbtQuestion.jsx";
import { CbtPalette, CbtLegend } from "../components/tests/CbtPalette.jsx";
import { questionState } from "../components/tests/cbtState.js";
import { TestTimer } from "../components/tests/TestTimer.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import toast from "react-hot-toast";

const hasValue = (v) => v !== undefined && v !== null && v !== "";

export default function TestAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});          // qid → option index | typed number
  const [marked, setMarked] = useState(() => new Set());
  const [visited, setVisited] = useState(() => new Set());
  const [showPalette, setShowPalette] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(null);         // "submit" | "exit" | null
  const submittedRef = useRef(false);

  // Progress lives on this device too: a refresh, a crash or the phone killing
  // the tab in the middle of a 3-hour paper must not lose the answers.
  const storeKey = `jneet.attempt.${attemptId}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await testApi.getAttempt(attemptId);
        if (cancelled) return;

        const a = res.data.attempt;

        if (a.status === "submitted") {
          navigate(`/test/result/${attemptId}`, { replace: true });
          return;
        }

        setAttempt(a);

        const initialAnswers = {};
        a.questions.forEach((q) => {
          if (q.type === "numeric" ? hasValue(q.textAnswer) : hasValue(q.selectedIndex)) {
            initialAnswers[q.questionId] = q.type === "numeric" ? q.textAnswer : q.selectedIndex;
          }
        });
        try {
          const saved = JSON.parse(localStorage.getItem(storeKey) || "null");
          if (saved?.answers) Object.assign(initialAnswers, saved.answers);
          if (Array.isArray(saved?.marked)) setMarked(new Set(saved.marked));
          if (Array.isArray(saved?.visited)) setVisited(new Set(saved.visited));
          if (Number.isInteger(saved?.index) && saved.index >= 0 && saved.index < a.questions.length) setCurrentIndex(saved.index);
        } catch { /* storage unavailable or corrupt — start from what the server has */ }
        setAnswers(initialAnswers);

      } catch {
        toast.error("Could not load this test.");
        navigate("/tests", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [attemptId, navigate, storeKey]);

  // the question on screen counts as visited (NTA: "Not answered" once seen)
  useEffect(() => {
    const qid = attempt?.questions?.[currentIndex]?.questionId;
    if (qid && !visited.has(qid)) setVisited((v) => new Set(v).add(qid));
  }, [attempt, currentIndex, visited]);

  // keep the on-device copy current
  useEffect(() => {
    if (!attempt || submittedRef.current) return;
    try {
      localStorage.setItem(storeKey, JSON.stringify({ answers, index: currentIndex, marked: [...marked], visited: [...visited] }));
    } catch { /* ignore */ }
  }, [answers, currentIndex, marked, visited, attempt, storeKey]);

  // closing / reloading mid-test asks first (the browser shows its own wording)
  useEffect(() => {
    if (!attempt) return undefined;
    const warn = (e) => { if (!submittedRef.current) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [attempt]);

  const inFlightRef = useRef(false);
  const handleSubmit = useCallback(async ({ timeUp = false } = {}) => {
    if (!attempt || inFlightRef.current || submittedRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      await testApi.submit(attemptId, {
        answers: attempt.questions.map((q) => (q.type === "numeric"
          ? { questionId: q.questionId, selectedIndex: null, textAnswer: hasValue(answers[q.questionId]) ? String(answers[q.questionId]) : null }
          : { questionId: q.questionId, selectedIndex: answers[q.questionId] ?? null })),
      });
      submittedRef.current = true;
      try { localStorage.removeItem(storeKey); } catch { /* ignore */ }
      if (timeUp) toast("Time is up — your test was submitted.", { icon: "⏰", duration: 5000 });
      navigate(`/test/result/${attemptId}`, { replace: true });
    } catch (err) {
      if (err.response?.status === 409) {           // already submitted (other tab / auto-submit)
        submittedRef.current = true;
        try { localStorage.removeItem(storeKey); } catch { /* ignore */ }
        navigate(`/test/result/${attemptId}`, { replace: true });
      } else {
        toast.error(err.isNetworkError
          ? "No connection — your answers are saved on this device. Reconnect and tap Submit again."
          : (err.response?.data?.error || "Could not submit test"));
      }
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }, [attempt, answers, attemptId, navigate, storeKey]);

  // sections in paper order: [{ subject, start, items: [{ q, index }] }]
  const sections = useMemo(() => {
    const out = [];
    (attempt?.questions ?? []).forEach((q, index) => {
      const last = out[out.length - 1];
      if (!last || last.subject !== q.subject) out.push({ subject: q.subject, start: index, items: [{ q, index }] });
      else last.items.push({ q, index });
    });
    return out;
  }, [attempt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Spinner size={20} />
      </div>
    );
  }

  if (!attempt) return null;

  const questions = attempt.questions;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answered = (qid) => hasValue(answers[qid]);
  const stateOf = (qid) => questionState(qid, { answered, visited, marked });
  const counts = questions.reduce((c, q) => { const s = stateOf(q.questionId); c[s] = (c[s] ?? 0) + 1; return c; }, {});
  const answeredCount = questions.filter((q) => answered(q.questionId)).length;
  const section = sections.find((s) => currentIndex >= s.start && currentIndex < s.start + s.items.length) ?? sections[0];

  const setAnswer = (qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }));
  const clearAnswer = (qid) => setAnswers((prev) => { const n = { ...prev }; delete n[qid]; return n; });
  const go = (i) => setCurrentIndex(Math.max(0, Math.min(questions.length - 1, i)));
  const next = () => { if (!isLast) go(currentIndex + 1); };
  const toggleMark = (qid, on) => setMarked((m) => { const n = new Set(m); on ? n.add(qid) : n.delete(qid); return n; });

  const qid = currentQuestion.questionId;
  const summary = sections.map((s) => {
    const done = s.items.filter(({ q }) => answered(q.questionId)).length;
    return `${s.subject}: ${done}/${s.items.length}`;
  }).join(" · ");

  // Revision-style attempts that still open here (old links) keep the simple card.
  const isMock = attempt.mode === "test";

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <ConfirmDialog
        open={confirm !== null}
        title={confirm === "exit" ? "Exit this test?" : "Submit the test?"}
        message={`${answeredCount} of ${questions.length} answered (${summary}). ${counts.marked ? `${counts.marked} marked for review without an answer. ` : ""}Unanswered questions get 0; a wrong answer is −1. You cannot change answers after submitting.`}
        confirmLabel="Submit"
        cancelLabel="Keep going"
        tone="danger"
        busy={submitting}
        onConfirm={() => { setConfirm(null); handleSubmit(); }}
        onCancel={() => setConfirm(null)}
      />

      <nav className="border-b border-bg-border bg-bg-surface/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setConfirm("exit")}
            disabled={submitting}
            className="text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover shrink-0 disabled:opacity-50"
            title="Exit and submit"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{attempt.chapter}</p>
            <p className="text-[10px] text-gray-600">{answeredCount}/{questions.length} answered · +4 / −1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TestTimer startedAt={attempt.startedAt} durationMinutes={attempt.durationMinutes} onExpire={() => handleSubmit({ timeUp: true })} />
          <button
            onClick={() => setConfirm("submit")}
            disabled={submitting}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg"
          >
            <Send size={12} /> Submit
          </button>
        </div>
      </nav>

      {/* section tabs */}
      {sections.length > 1 && (
        <div className="border-b border-bg-border bg-bg-surface px-3 flex gap-1 overflow-x-auto sticky top-[57px] z-10" role="tablist">
          {sections.map((s) => {
            const active = s === section;
            const done = s.items.filter(({ q }) => answered(q.questionId)).length;
            return (
              <button
                key={s.subject}
                role="tab"
                aria-selected={active}
                onClick={() => go(s.start)}
                className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition
                  ${active ? "border-violet-600 text-fg-primary" : "border-transparent text-gray-600 hover:text-fg-primary"}`}
              >
                {s.subject} <span className="text-[10px] font-normal text-gray-600">{done}/{s.items.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-5 lg:grid lg:grid-cols-[1fr_300px] lg:gap-5">
        <main className="space-y-4 min-w-0">
          <div key={qid} className="animate-fade-up">
            {isMock ? (
              <CbtQuestion question={currentQuestion} number={currentIndex + 1} value={answers[qid]} onChange={setAnswer} />
            ) : (
              <MCQCard question={currentQuestion} index={currentIndex} total={questions.length}
                selectedIndex={answers[qid] ?? null} onSelect={setAnswer} />
            )}
          </div>

          {/* NTA's buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { toggleMark(qid, true); next(); }}
              className="flex items-center justify-center gap-1.5 bg-violet-600/10 border border-violet-600/40 text-violet-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-violet-600/20"
            >
              <Bookmark size={13} /> Mark for Review & Next
            </button>
            <button
              onClick={() => { clearAnswer(qid); toggleMark(qid, false); }}
              disabled={!answered(qid) && !marked.has(qid)}
              className="flex items-center justify-center gap-1.5 bg-bg-panel border border-bg-border text-fg-primary text-xs font-semibold px-3 py-2.5 rounded-xl disabled:opacity-40"
            >
              <Eraser size={13} /> Clear Response
            </button>
            <button
              onClick={() => go(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center justify-center gap-1.5 bg-bg-panel border border-bg-border text-fg-primary text-xs font-semibold px-3 py-2.5 rounded-xl disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {isLast ? (
              <button
                onClick={() => setConfirm("submit")}
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2.5 rounded-xl"
              >
                <Send size={13} /> {submitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={() => { toggleMark(qid, false); next(); }}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2.5 rounded-xl"
              >
                Save & Next <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 lg:hidden">
            <button
              onClick={() => setShowPalette(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-bg-panel border border-bg-border text-fg-primary text-xs font-semibold px-3 py-2.5 rounded-xl"
            >
              <LayoutGrid size={13} /> All questions
            </button>
            <button
              onClick={() => setConfirm("submit")}
              disabled={submitting}
              className="sm:hidden flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50"
            >
              <Send size={12} /> Submit
            </button>
          </div>
        </main>

        {/* palette: side column on wide screens, a sheet on phones */}
        <aside className={`${showPalette ? "fixed inset-0 z-30 bg-black/50 flex items-end" : "hidden"} lg:static lg:block lg:bg-transparent`}
          onClick={() => setShowPalette(false)}>
          <div className="w-full bg-bg-surface lg:bg-transparent rounded-t-2xl lg:rounded-none p-4 lg:p-0 max-h-[80vh] overflow-y-auto lg:sticky lg:top-28 space-y-3"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between lg:hidden">
              <p className="text-sm font-semibold">{section?.subject}</p>
              <button onClick={() => setShowPalette(false)} className="p-1.5 rounded-lg hover:bg-bg-hover" aria-label="Close"><X size={16} /></button>
            </div>
            <div className="glass-panel rounded-2xl p-3 space-y-3">
              <CbtLegend counts={counts} />
              <p className="text-[11px] font-semibold text-fg-primary hidden lg:block">{section?.subject}</p>
              <CbtPalette items={section?.items ?? []} currentIndex={currentIndex} stateOf={stateOf}
                onJump={(i) => { go(i); setShowPalette(false); }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
