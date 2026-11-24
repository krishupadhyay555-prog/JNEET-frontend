// ============================================================
//  JNEET+ AI — components/freemock/FreeMockRunner.jsx
//  NTA-style CBT screen for the Free Quick Mock (lazy chunk). Answers are
//  kept on the device (resume after reload) and scored on the server.
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Bookmark, Eraser, LayoutGrid, Send, X } from "lucide-react";
import { CbtQuestion } from "../tests/CbtQuestion.jsx";
import { CbtPalette, CbtLegend } from "../tests/CbtPalette.jsx";
import { questionState } from "../tests/cbtState.js";
import { TestTimer } from "../tests/TestTimer.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";
import { Spinner } from "../ui/Spinner.jsx";
import { useOverlayClose } from "../../hooks/useOverlayClose.js";
import { freeMockApi, store, FM_ACTIVE, FM_PENDING, fmAnswersKey } from "../../api/freeMockApi.js";
import { EXAMS, friendly, nowMs } from "./shared.js";

export default function Runner({ paper, onDone }) {
  const qs = useMemo(() => paper.questions.map((q) => ({ ...q, questionId: `fm-${q.i}` })), [paper]);
  const saved = store.get(fmAnswersKey(paper.attemptId)) ?? {};
  const [answers, setAnswers] = useState(saved.answers ?? {});
  const [marked, setMarked] = useState(() => new Set(saved.marked ?? []));
  const [visited, setVisited] = useState(() => new Set(saved.visited ?? ["fm-0"]));
  const [cur, setCur] = useState(saved.cur ?? 0);
  const [showPalette, setShowPalette] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const times = useRef(saved.times ?? {});
  const enteredAt = useRef(0);
  useEffect(() => { enteredAt.current = nowMs(); }, []);
  useOverlayClose(showPalette, () => setShowPalette(false));

  const subjects = useMemo(() => [...new Set(qs.map((q) => q.subject))], [qs]);
  const q = qs[cur];
  const isAnswered = useCallback((id) => answers[id] !== undefined && answers[id] !== null && answers[id] !== "", [answers]);
  const stateOf = useCallback((id) => questionState(id, { answered: isAnswered, visited, marked }), [isAnswered, visited, marked]);

  const tick = () => {
    const id = qs[cur].questionId;
    const t = nowMs();
    if (enteredAt.current) times.current[id] = (times.current[id] ?? 0) + (t - enteredAt.current) / 1000;
    enteredAt.current = t;
  };
  useEffect(() => {
    store.set(fmAnswersKey(paper.attemptId), { answers, marked: [...marked], visited: [...visited], cur, times: times.current });
  }, [answers, marked, visited, cur, paper.attemptId]);

  const go = (i) => {
    if (i < 0 || i >= qs.length) return;
    tick(); setCur(i); setVisited((v) => new Set(v).add(qs[i].questionId)); setShowPalette(false);
  };
  const setAnswer = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));
  const clear = () => setAnswers((a) => { const n = { ...a }; delete n[q.questionId]; return n; });
  const toggleMark = () => { setMarked((m) => { const n = new Set(m); if (n.has(q.questionId)) n.delete(q.questionId); else n.add(q.questionId); return n; }); go(cur + 1); };

  const submit = async () => {
    if (submitting) return;
    tick(); setSubmitting(true); setConfirm(false);
    const payload = qs.map((x) => {
      const v = answers[x.questionId];
      const t = Math.round(times.current[x.questionId] ?? 0);
      if (x.type === "numeric") return { i: x.i, textAnswer: typeof v === "string" && v.trim() ? v.trim() : null, timeSec: t };
      return { i: x.i, selectedIndex: Number.isInteger(v) ? v : null, timeSec: t };
    });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const { data } = await freeMockApi.submit(paper.attemptId, payload);
        store.del(FM_ACTIVE); store.del(fmAnswersKey(paper.attemptId)); store.set(FM_PENDING, { id: paper.attemptId, exam: paper.exam });
        onDone(data.result);
        return;
      } catch (err) {
        if (err?.response?.status && err.response.status < 500 && err.response.status !== 409) {
          toast.error(friendly(err, "Couldn't submit. Please try again.")); break;
        }
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
    toast.error("Your internet looks slow — your answers are saved on this phone. Tap Submit again.", { duration: 8000 });
    setSubmitting(false);
  };

  const counts = useMemo(() => {
    const c = { notVisited: 0, notAnswered: 0, answered: 0, marked: 0, answeredMarked: 0 };
    for (const x of qs) c[stateOf(x.questionId)] += 1;
    return c;
  }, [qs, stateOf]);
  const items = qs.map((x, index) => ({ q: x, index }));

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <header className="sticky top-0 z-20 bg-bg-surface border-b border-bg-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 flex items-center gap-3">
          <span className="font-semibold text-fg-primary text-sm truncate">{EXAMS[paper.exam].title} Quick Mock</span>
          <span className="text-xs text-gray-500 hidden sm:inline">{counts.answered + counts.answeredMarked}/{qs.length} answered · +4 / −1</span>
          <div className="ml-auto"><TestTimer startedAt={paper.startedAt} durationMinutes={paper.durationMinutes} onExpire={submit} /></div>
          <button type="button" onClick={() => setConfirm(true)} disabled={submitting}
            className="min-h-[40px] px-3 rounded-lg bg-[#0D9488] text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-60">
            {submitting ? <Spinner size={12} /> : <Send size={14} />} Submit
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-3 sm:px-5 flex gap-1 overflow-x-auto" aria-label="Sections">
          {subjects.map((s) => {
            const first = qs.findIndex((x) => x.subject === s);
            return (
              <button key={s} type="button" onClick={() => go(first)}
                className={`min-h-[40px] px-3 text-sm whitespace-nowrap border-b-2 ${q.subject === s ? "border-[#0D9488] text-fg-primary font-semibold" : "border-transparent text-gray-500"}`}>
                {s} <span className="text-[11px] text-gray-500">{qs.filter((x) => x.subject === s && isAnswered(x.questionId)).length}/{qs.filter((x) => x.subject === s).length}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-5 py-4 lg:grid lg:grid-cols-[1fr_280px] lg:gap-5">
        <section className="space-y-3 pb-28 lg:pb-6">
          <CbtQuestion question={q} number={cur + 1} value={answers[q.questionId]} onChange={setAnswer} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={toggleMark} className="min-h-[44px] rounded-xl border border-bg-border text-sm font-medium text-fg-primary inline-flex items-center justify-center gap-1.5"><Bookmark size={14} /> Mark & Next</button>
            <button type="button" onClick={clear} className="min-h-[44px] rounded-xl border border-bg-border text-sm font-medium text-fg-primary inline-flex items-center justify-center gap-1.5"><Eraser size={14} /> Clear</button>
            <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} className="min-h-[44px] rounded-xl border border-bg-border text-sm text-fg-primary inline-flex items-center justify-center gap-1 disabled:opacity-40"><ChevronLeft size={14} /> Back</button>
            <button type="button" onClick={() => (cur === qs.length - 1 ? setConfirm(true) : go(cur + 1))} className="min-h-[44px] rounded-xl bg-[#0D9488] text-white text-sm font-semibold inline-flex items-center justify-center gap-1">
              {cur === qs.length - 1 ? "Finish" : "Save & Next"} <ChevronRight size={14} />
            </button>
          </div>
          <button type="button" onClick={() => setShowPalette(true)} className="lg:hidden w-full min-h-[44px] rounded-xl border border-bg-border text-sm text-fg-primary inline-flex items-center justify-center gap-1.5"><LayoutGrid size={14} /> All questions</button>
        </section>
        <aside className={`${showPalette ? "fixed inset-0 z-30 bg-black/50 flex items-end" : "hidden"} lg:static lg:block lg:bg-transparent`} onClick={() => setShowPalette(false)}>
          <div className="w-full bg-bg-surface lg:bg-transparent rounded-t-2xl lg:rounded-none p-4 lg:p-0 max-h-[80vh] overflow-y-auto lg:sticky lg:top-32 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between lg:hidden">
              <span className="font-semibold text-fg-primary">All questions</span>
              <button type="button" aria-label="Close" onClick={() => setShowPalette(false)} className="p-2"><X size={18} /></button>
            </div>
            <CbtLegend counts={counts} />
            {subjects.map((s) => (
              <div key={s}>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">{s}</p>
                <CbtPalette items={items.filter((it) => it.q.subject === s)} currentIndex={cur} stateOf={stateOf} onJump={go} />
              </div>
            ))}
          </div>
        </aside>
      </main>

      <ConfirmDialog open={confirm} title="Submit the test?"
        message={`${counts.answered + counts.answeredMarked} of ${qs.length} answered. You can't change answers after submitting.`}
        confirmLabel="Submit" cancelLabel="Keep going" onConfirm={submit} onCancel={() => setConfirm(false)} />
    </div>
  );
}

