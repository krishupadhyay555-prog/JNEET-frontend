// ============================================================
//  JNEET+ AI — pages/FreeMock.jsx   (/free-mock, no signup)
//  Intro (JEE / NEET) → NTA-style CBT screen → result.
//  Scored on the server; answers + solutions unlock after a free
//  signup (the sitting then moves into the account).
// ============================================================
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Clock, Target, RotateCcw } from "lucide-react";
import { PublicShell } from "../components/public/PublicShell.jsx";
import { Captcha } from "../components/security/Captcha.jsx";
import { withCaptcha } from "../utils/turnstile.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { predictJee, predictNeet } from "../utils/rankPredict.js";
import { freeMockApi, store, FM_ACTIVE, rememberFreeMockSource } from "../api/freeMockApi.js";
import { EXAMS, friendly, fmtTime } from "../components/freemock/shared.js";

// The CBT screen (with the maths renderer) is a separate chunk, fetched
// while the student is still choosing the exam — fast on Slow 3G.
const loadRunner = () => import("../components/freemock/FreeMockRunner.jsx");
const Runner = lazy(loadRunner);

export default function FreeMock() {
  const [phase, setPhase] = useState(() => (store.get(FM_ACTIVE) ? "loading" : "intro")); // loading | intro | test | result
  const [paper, setPaper] = useState(null);
  const [result, setResult] = useState(null);
  const source = useMemo(() => rememberFreeMockSource(), []);

  // Resume a sitting after reload / back.
  useEffect(() => {
    const active = store.get(FM_ACTIVE);
    if (!active) return;
    freeMockApi.get(active).then(({ data }) => {
      if (data.submitted) { setResult({ exam: data.exam, attemptId: data.attemptId, ...data.result }); setPhase("result"); store.del(FM_ACTIVE); }
      else { setPaper(data); setPhase("test"); }
    }).catch(() => { store.del(FM_ACTIVE); setPhase("intro"); });
  }, []);

  useEffect(() => { document.title = "Free JEE Main & NEET Quick Mock — JNEET+ AI"; }, []);

  if (phase === "loading") return <div className="min-h-screen flex items-center justify-center"><Spinner size={24} /></div>;
  if (phase === "test") {
    return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size={24} /></div>}><Runner paper={paper} onDone={(r) => { setResult({ exam: paper.exam, attemptId: paper.attemptId, ...r }); setPhase("result"); window.scrollTo(0, 0); }} /></Suspense>;
  }
  return (
    <PublicShell>
      {phase === "result"
        ? <Result r={result} onRetake={() => { setResult(null); setPhase("intro"); }} />
        : <Intro source={source} onStart={(p) => { setPaper(p); store.set(FM_ACTIVE, p.attemptId); setPhase("test"); }} />}
    </PublicShell>
  );
}

function Intro({ onStart, source }) {
  const [exam, setExam] = useState("JEE");
  const [busy, setBusy] = useState(false);
  const captchaRef = useRef(null);
  useEffect(() => { loadRunner().catch(() => {}); }, []);
  const start = async () => {
    setBusy(true);
    try {
      const { data } = await freeMockApi.start(await withCaptcha(captchaRef, { exam, source }));
      onStart(data);
    } catch (err) {
      toast.error(friendly(err, "Couldn't start the test. Please try again."), { duration: 6000 });
    } finally { setBusy(false); }
  };
  return (
    <div className="max-w-3xl mx-auto px-5 pt-12 pb-16 sm:pt-16">
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#0D9488] mb-3">Free · no signup</p>
      <h1 className="text-[30px] sm:text-[40px] font-bold tracking-tight leading-tight text-[#17161C]">Free Quick Mock</h1>
      <p className="text-[16px] leading-relaxed text-[#3A3741] mt-3">
        A short NTA-style test: real previous-year questions plus our hardest practice questions. +4 / −1 marking. Get your score, subject-wise report, weak chapters and an estimated rank in minutes.
      </p>
      <div role="radiogroup" aria-label="Choose your exam" className="grid sm:grid-cols-2 gap-3 mt-8">
        {Object.entries(EXAMS).map(([k, e]) => (
          <button key={k} type="button" role="radio" aria-checked={exam === k} onClick={() => setExam(k)}
            className={`text-left rounded-2xl border p-5 min-h-[44px] transition ${exam === k ? "border-[#0D9488] bg-[#F0FDFA] ring-1 ring-[#0D9488]" : "border-[#E7E4DD] bg-white hover:border-[#0D9488]/50"}`}>
            <span className="block text-[18px] font-bold text-[#17161C]">{e.title}</span>
            <span className="block text-[14px] text-[#3A3741] mt-1">{e.qs} questions · {e.min} minutes</span>
            <span className="block text-[13px] text-[#6E6A76] mt-1">{e.split} · {e.note}</span>
          </button>
        ))}
      </div>
      <ul className="mt-6 space-y-1.5 text-[14px] text-[#3A3741]">
        <li>• Questions marked <b>PYQ</b> are from real NTA papers (year and shift shown).</li>
        <li>• Take it as many times as you like — each test is new.</li>
        <li>• Free signup unlocks answers + solutions, the Mistake Notebook and the All-India rank.</li>
      </ul>
      <div className="mt-6"><Captcha ref={captchaRef} /></div>
      <button type="button" onClick={start} disabled={busy}
        className="mt-4 w-full sm:w-auto min-h-[48px] px-8 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2">
        {busy ? <Spinner size={14} /> : null} Start {EXAMS[exam].title} test
      </button>
    </div>
  );
}

function Result({ r, onRetake }) {
  const { isLoggedIn } = useAuth();
  const rank = useMemo(() => {
    try {
      if (r.exam === "JEE") {
        const m = Math.max(-75, Math.min(300, Math.round((r.marks / r.maxMarks) * 300)));
        return { label: "JEE Main rank (est.)", value: predictJee({ marks: m }).rank.mid };
      }
      const m = Math.max(-180, Math.min(720, Math.round((r.marks / r.maxMarks) * 720)));
      return { label: "NEET UG rank (est.)", value: predictNeet({ marks: m }).y2026.rank.mid };
    } catch { return null; }
  }, [r]);
  const cta = isLoggedIn ? "/dashboard" : "/register";

  return (
    <div className="max-w-3xl mx-auto px-5 pt-10 pb-16">
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#0D9488] mb-2">{EXAMS[r.exam].title} Quick Mock · result</p>
      <div className="rounded-2xl bg-white border border-[#E7E4DD] p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div><p className="text-[13px] text-[#6E6A76]">Score</p><p className="text-[40px] font-bold leading-none text-[#17161C]">{r.marks}<span className="text-[20px] text-[#6E6A76] font-semibold"> / {r.maxMarks}</span></p></div>
          <Stat icon={Target} label="Accuracy" value={`${r.accuracy}%`} />
          <Stat icon={Clock} label="Time" value={fmtTime(r.timeTakenSec)} />
          {rank ? <Stat label={rank.label} value={`~${rank.value.toLocaleString("en-IN")}`} /> : null}
        </div>
        <p className="text-[13px] text-[#6E6A76] mt-3">{r.correct} right · {r.wrong} wrong · {r.skipped} skipped. Rank is a rough estimate from a short test, scaled to the full paper.</p>
      </div>

      <h2 className="text-[18px] font-bold mt-8 mb-3 text-[#17161C]">Subject-wise</h2>
      <div className="rounded-2xl bg-white border border-[#E7E4DD] divide-y divide-[#EFECE6]">
        {r.subjects.map((s) => (
          <div key={s.subject} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-[14px]">
            <span className="font-semibold text-[#17161C] w-28">{s.subject}</span>
            <span className="text-[#17161C]">{s.marks} / {s.total * 4}</span>
            <span className="text-[#6E6A76]">{s.correct}✓ · {s.wrong}✗ · {s.skipped} skipped</span>
            <span className="text-[#6E6A76] ml-auto">{fmtTime(s.timeSec)}</span>
          </div>
        ))}
      </div>

      {r.weakChapters.length ? (
        <>
          <h2 className="text-[18px] font-bold mt-8 mb-3 text-[#17161C]">Work on these chapters first</h2>
          <ol className="space-y-2">
            {r.weakChapters.map((c, i) => (
              <li key={`${c.subject}${c.chapter}`} className="rounded-xl bg-white border border-[#E7E4DD] p-3 text-[14px] text-[#3A3741]">
                <b className="text-[#17161C]">{i + 1}. {c.chapter}</b> <span className="text-[#6E6A76]">({c.subject}) — {c.wrong} wrong, {c.skipped} skipped</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <div className="mt-8 rounded-2xl border border-[#0D9488]/30 bg-[#F0FDFA] p-5">
        <p className="flex items-center gap-2 font-bold text-[#0F766E]"><Lock size={16} /> Unlock with a free account</p>
        <ul className="mt-2 text-[14px] text-[#3A3741] space-y-1">
          <li>• Correct answers + step-by-step solutions for this test</li>
          <li>• Your wrong ones saved to the Mistake Notebook</li>
          <li>• Sunday All-India Mock with a real rank</li>
        </ul>
        <Link to={cta} className="mt-4 inline-flex min-h-[48px] items-center justify-center px-6 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold w-full sm:w-auto">
          {isLoggedIn ? "Save to my account" : `Sign up free — choose ${EXAMS[r.exam].title}`}
        </Link>
        {!isLoggedIn ? <p className="text-[12.5px] text-[#6E6A76] mt-2">Pick <b>{EXAMS[r.exam].title}</b> when you sign up so this test moves into your account.</p> : null}
      </div>

      <button type="button" onClick={onRetake} className="mt-4 min-h-[44px] inline-flex items-center gap-2 text-[#0F766E] font-semibold">
        <RotateCcw size={15} /> Take another test
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="text-[13px] text-[#6E6A76] flex items-center gap-1">{Icon ? <Icon size={13} /> : null}{label}</p>
      <p className="text-[22px] font-bold text-[#17161C]">{value}</p>
    </div>
  );
}
