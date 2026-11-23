// Elite "deep analysis" under a test result. Locked teaser for others.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Lock } from "lucide-react";
import { learnApi } from "../../api/testApi.js";

const mmss = (s) => (s == null ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

function Row({ cells, head = false }) {
  return (
    <div className={`grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-2 py-1.5 text-xs ${head ? "text-gray-600 font-semibold border-b border-bg-border" : ""}`}>
      {cells.map((c, i) => <span key={i} className={i ? "text-right tabular-nums" : "truncate"}>{c}</span>)}
    </div>
  );
}

export function DeepAnalysis({ attemptId }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let off = false;
    learnApi.analysis(attemptId)
      .then(({ data }) => { if (!off) setState({ status: "ok", a: data.analysis }); })
      .catch((err) => {
        const code = err.response?.data?.code;
        if (!off) setState({ status: code === "PLAN_REQUIRED" ? "locked" : "hidden" });
      });
    return () => { off = true; };
  }, [attemptId]);

  if (state.status === "loading" || state.status === "hidden") return null;
  if (state.status === "locked") {
    return (
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <p className="text-sm font-semibold flex items-center gap-2"><Lock size={15} /> Deep analysis · Elite</p>
        <ul className="text-xs text-gray-600 list-disc pl-5 space-y-0.5">
          <li>Chapter-wise accuracy and your 5 weakest chapters</li>
          <li>Marks lost to negative marking and to slow questions</li>
          <li>Time per question and per subject, PYQ vs practice accuracy</li>
          <li>Your score trend and a short action plan</li>
        </ul>
        <Link to="/plans" className="inline-block text-sm font-semibold underline">See Elite</Link>
      </div>
    );
  }

  const { a } = state;
  const o = a.overall;
  const pctOf = (t) => (t.max ? Math.max(t.marks, 0) / t.max : 0);
  return (
    <section className="glass-panel rounded-2xl p-5 space-y-4" aria-label="Deep analysis">
      <p className="text-sm font-semibold flex items-center gap-2"><BarChart3 size={16} /> Deep analysis</p>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div><p className="text-xl font-bold tabular-nums">{o.accuracy ?? "—"}%</p><p className="text-[11px] text-gray-600">Accuracy</p></div>
        <div><p className="text-xl font-bold tabular-nums text-red-600">−{o.wrong}</p><p className="text-[11px] text-gray-600">Negative marks</p></div>
        <div><p className="text-xl font-bold tabular-nums">{mmss(a.time?.medianSec)}</p><p className="text-[11px] text-gray-600">Typical time / Q</p></div>
      </div>

      {a.tips.length > 0 && (
        <div className="bg-bg-panel border border-bg-border rounded-xl p-3">
          <p className="text-[11px] font-semibold text-gray-600 mb-1">What to do next</p>
          <ul className="text-xs space-y-1 list-disc pl-4">{a.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}

      <div>
        <Row head cells={["Subject", "Marks", "Accuracy", "Avg time"]} />
        {a.subjects.map((s) => <Row key={s.subject} cells={[s.subject, s.marks, `${s.accuracy ?? "—"}%`, mmss(s.avgSec)]} />)}
      </div>

      {a.weakest.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-600 mb-1">Weakest chapters (marks left on the table)</p>
          <ul className="space-y-1.5">
            {a.weakest.map((c) => (
              <li key={`${c.subject}|${c.chapter}`} className="flex items-center gap-2 text-xs">
                <span className="flex-1 min-w-0 truncate">{c.chapter} <span className="text-gray-600">· {c.subject}</span></span>
                <span className="tabular-nums text-gray-600">{c.correct}/{c.total} right</span>
                <span className="tabular-nums font-semibold text-red-600">−{c.dropped}</span>
                {c.slug && <Link to={`/oneshot/${c.slug}`} className="font-semibold underline">Revise</Link>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {a.strongest.length > 0 && (
        <p className="text-xs"><span className="text-gray-600">Strong: </span>{a.strongest.map((c) => c.chapter).join(", ")}</p>
      )}

      {a.pyq.total > 0 && a.bank.total > 0 && (
        <p className="text-xs"><span className="text-gray-600">Real PYQs: </span><b>{a.pyq.accuracy ?? "—"}%</b> accuracy · <span className="text-gray-600">practice questions: </span><b>{a.bank.accuracy ?? "—"}%</b></p>
      )}

      {a.trend.length > 1 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-600 mb-1">Your last {a.trend.length} full tests</p>
          <div className="flex items-end gap-1.5 h-20" role="img" aria-label={`Marks: ${a.trend.map((t) => `${t.marks}/${t.max}`).join(", ")}`}>
            {a.trend.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${t.marks}/${t.max}`}>
                <span className="text-[10px] tabular-nums text-gray-600">{t.marks}</span>
                <div className={`w-full rounded-t ${i === a.trend.length - 1 ? "bg-teal-600" : "bg-teal-600/35"}`} style={{ height: `${Math.max(4, pctOf(t) * 100)}%` }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
