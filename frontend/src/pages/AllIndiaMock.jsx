// ============================================================
//  JNEET+ AI — pages/AllIndiaMock.jsx
//  The weekly All-India Mock: every Sunday 8:00 AM – 11:59 PM IST, the
//  same NTA-pattern paper (mostly real PYQs) for every student, then an
//  All-India rank list. Names are never shown — every student is a
//  code (#K7Q2). Answers and review open for everyone when it closes.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Users, Medal, CalendarDays, CheckCircle2, Lock, BarChart3 } from "lucide-react";
import { useGoBack } from "../hooks/useGoBack.js";
import { allIndiaApi } from "../api/testApi.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";
import { PageLoader } from "../components/ui/PageLoader.jsx";

const IST = { timeZone: "Asia/Kolkata" };
const fmtDay = (d) => new Date(d).toLocaleDateString("en-IN", { ...IST, weekday: "long", day: "numeric", month: "short" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { ...IST, hour: "numeric", minute: "2-digit" });

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function left(ms) {
  if (ms <= 0) return "0m";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-bg-panel border border-bg-border p-3">
      <p className="text-[10px] text-gray-600 flex items-center gap-1">{icon} {label}</p>
      <p className="text-base font-bold text-fg-primary tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function Leaderboard({ mockId, title }) {
  const [lb, setLb] = useState(null);
  useEffect(() => {
    let cancelled = false;
    allIndiaApi.leaderboard(mockId)
      .then((r) => { if (!cancelled) setLb(r.data); })
      .catch(() => { if (!cancelled) setLb({ error: true }); });
    return () => { cancelled = true; };
  }, [mockId]);

  if (!lb) return <div className="py-6 flex justify-center"><Spinner size={16} /></div>;
  if (lb.error) return <p className="text-xs text-gray-600">Could not load the rank list. Check your internet and open this page again.</p>;
  if (!lb.participants) return <p className="text-xs text-gray-600">No one has finished yet — the rank list fills in as students submit.</p>;

  return (
    <div className="space-y-3">
      {title && <p className="text-xs font-semibold text-fg-primary">{title}</p>}
      {lb.me && (
        <div className="rounded-2xl border border-violet-600/30 bg-violet-600/10 p-4">
          <p className="text-[11px] text-violet-600 font-semibold">Your All-India result{lb.final ? "" : " (provisional — final at 11:59 PM)"}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div><p className="text-2xl font-bold tabular-nums">#{lb.me.rank}</p><p className="text-[10px] text-gray-600">of {lb.participants}</p></div>
            <div><p className="text-2xl font-bold tabular-nums">{lb.me.marks}</p><p className="text-[10px] text-gray-600">of {lb.maxMarks} marks</p></div>
            <div><p className="text-2xl font-bold tabular-nums">{lb.me.percentile}</p><p className="text-[10px] text-gray-600">percentile</p></div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 text-center">Your code on the list: <span className="font-semibold text-fg-primary">{lb.me.code}</span></p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={<Users size={11} />} label="Students" value={lb.participants.toLocaleString("en-IN")} />
        <Stat icon={<Medal size={11} />} label="Topper" value={lb.topperMarks} />
        <Stat icon={<BarChart3 size={11} />} label="Average" value={lb.averageMarks} />
      </div>
      <div className="rounded-2xl border border-bg-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-bg-panel text-gray-600">
            <tr><th className="text-left font-medium px-3 py-2">Rank</th><th className="text-left font-medium px-3 py-2">Student</th><th className="text-right font-medium px-3 py-2">Marks</th><th className="text-right font-medium px-3 py-2">Time</th></tr>
          </thead>
          <tbody>
            {lb.top.map((r) => (
              <tr key={r.code} className={`border-t border-bg-border ${r.you ? "bg-violet-600/10 font-semibold" : ""}`}>
                <td className="px-3 py-2 tabular-nums">{r.rank}</td>
                <td className="px-3 py-2">{r.code}{r.you ? " (you)" : ""}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.marks}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-600">{r.minutes} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-600">Ranked by marks, then by time taken. Names are never shown — every student is a code.</p>
    </div>
  );
}

export default function AllIndiaMock() {
  const navigate = useNavigate();
  const goBack = useGoBack("/tests");
  const now = useNow();
  const [data, setData] = useState(null);
  const [starting, setStarting] = useState(false);

  const load = useCallback(() => {
    allIndiaApi.get()
      .then((r) => setData(r.data))
      .catch(() => setData({ failed: true }));
  }, []);
  useEffect(() => { load(); }, [load]);

  const cur = data?.current;
  // the page flips from "opens in" to "start" by itself at 8:00 AM
  const opensIn = cur ? new Date(cur.opensAt).getTime() - now : 0;
  const lastStartIn = cur ? new Date(cur.lastStartAt).getTime() - now : 0;
  const closesIn = cur ? new Date(cur.closesAt).getTime() - now : 0;
  const status = !cur ? null : opensIn > 0 ? "upcoming" : lastStartIn > 0 ? "open" : closesIn > 0 ? "closing" : "closed";

  const start = async () => {
    setStarting(true);
    try {
      const res = await allIndiaApi.start(cur.id);
      navigate(`/test/attempt/${res.data.attemptId}`);
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.attemptId) navigate(`/test/result/${err.response.data.attemptId}`);
      else toast.error(err.response?.data?.error || "Could not start the All-India Mock.");
      load();
    } finally {
      setStarting(false);
    }
  };

  const mine = cur?.mine;
  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-500 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover" title="Back">
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-sm">All-India Mock</span>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {!data ? (
          <PageLoader />
        ) : data.failed ? (
          <p className="text-sm text-gray-600 text-center py-10">Couldn&apos;t load the All-India Mock. Check your internet and open this page again.</p>
        ) : !cur ? (
          <p className="text-sm text-gray-600 text-center py-10">{data.error || "This week's All-India Mock is not ready yet."}</p>
        ) : (
          <>
            <section className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-fg-primary">{cur.title}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5 flex items-center gap-1">
                    <CalendarDays size={11} /> {fmtDay(cur.opensAt)} · {fmtTime(cur.opensAt)} – {fmtTime(cur.closesAt)} IST
                  </p>
                </div>
                <span className={`ml-auto shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5
                  ${status === "open" ? "bg-emerald-600/15 text-emerald-700" : status === "upcoming" ? "bg-amber-500/15 text-amber-700" : "bg-bg-panel text-gray-600 border border-bg-border"}`}>
                  {status === "open" ? "Live now" : status === "upcoming" ? "Upcoming" : status === "closing" ? "Closing" : "Closed"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat icon={<CheckCircle2 size={11} />} label="Questions" value={cur.totalQuestions} />
                <Stat icon={<Clock size={11} />} label="Time" value={`${Math.round(cur.durationMinutes / 60 * 10) / 10} h`} />
                <Stat icon={<Users size={11} />} label="Finished" value={cur.participants.toLocaleString("en-IN")} />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Same paper for every {cur.examMode === "JEE" ? "JEE Main" : "NEET UG"} student on JNEET+ — {cur.pyqCount} real previous-year
                questions (NTA&apos;s originals, NTA&apos;s answers) and our toughest questions, on the NTA-style screen with
                +4 / −1 marking. One attempt. Your All-India rank appears as soon as you submit.
              </p>

              {mine?.status === "submitted" ? (
                <button onClick={() => navigate(`/test/result/${mine.attemptId}`)}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold py-2.5 rounded-xl">
                  See your result ({mine.marksObtained} / {cur.maxMarks})
                </button>
              ) : mine && status !== "closed" ? (
                <button onClick={start} disabled={starting}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-xl">
                  {starting ? "Opening…" : "Resume your paper"}
                </button>
              ) : status === "open" ? (
                <>
                  <button onClick={start} disabled={starting}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-xl">
                    {starting ? "Starting…" : "Start All-India Mock"}
                  </button>
                  <p className="text-[10px] text-gray-600 text-center">Start by {fmtTime(cur.lastStartAt)} IST to get the full {Math.round(cur.durationMinutes / 60 * 10) / 10} hours · {left(lastStartIn)} left to start</p>
                </>
              ) : status === "upcoming" ? (
                <div className="rounded-xl bg-bg-panel border border-bg-border p-3 text-center">
                  <p className="text-[11px] text-gray-600">Opens in</p>
                  <p className="text-xl font-bold tabular-nums">{left(opensIn)}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-bg-panel border border-bg-border p-3 text-center flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Lock size={13} /> {status === "closing" ? `Starting closed at ${fmtTime(cur.lastStartAt)} IST — results final at ${fmtTime(cur.closesAt)}` : "This week's mock has closed."} Next one: next Sunday, 8:00 AM.
                </div>
              )}
            </section>

            {(mine?.status === "submitted" || status === "closed") && (
              <section className="glass-panel rounded-2xl p-5">
                <p className="text-sm font-semibold mb-3">All-India rank list</p>
                <Leaderboard mockId={cur.id} />
              </section>
            )}

            {data.last?.mine?.status === "submitted" && (
              <section className="glass-panel rounded-2xl p-5">
                <Leaderboard mockId={data.last.id} title={`Last week: ${data.last.title}`} />
              </section>
            )}

            <section className="glass-panel rounded-2xl p-5">
              <p className="text-sm font-semibold mb-2">Rules</p>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                <li>Every Sunday, 8:00 AM – 11:59 PM IST. Start any time, as long as the full time fits before it closes.</li>
                <li>One attempt per student. The timer keeps running if you close the app — your answers are saved on this device.</li>
                <li>NTA marking: +4 correct, −1 wrong, 0 unanswered. Rank by marks, then by time taken.</li>
                <li>Answers and the question-by-question review open for everyone when the mock closes, so no one can pass them on.</li>
                <li>Names are never shown on the rank list — each student is a code only you can see is yours.</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
