// ============================================================
//  JNEET+ AI — components/admin/ReportedQuestions.jsx
//  Founder view of questions students reported, grouped per question,
//  most-reported first. Shows exactly what the student saw (snapshot),
//  the reasons and notes. "Fixed" / "Dismiss" close all its reports.
//  Fix the question itself in backend/seed/questions, merge, re-seed.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { reportApi } from "../../api/testApi.js";
import { Spinner } from "../ui/Spinner.jsx";
import { PageLoader } from "../ui/PageLoader.jsx";

const TABS = [["open", "Open"], ["fixed", "Fixed"], ["dismissed", "Dismissed"]];
const dt = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "—");

export function ReportedQuestions() {
  const [status, setStatus] = useState("open");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (s) => {
    try {
      const res = await reportApi.list(s);
      setData(res.data); setError("");
    } catch {
      setError("Couldn't load reports.");
    }
  }, []);

  useEffect(() => { load(status); }, [status, load]);

  const act = async (questionId, next) => {
    setBusyId(questionId);
    try { await reportApi.setStatus(questionId, next); await load(status); }
    catch { setError("Couldn't update. Try again."); }
    finally { setBusyId(null); }
  };

  return (
    <section className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-fg-primary"><Flag size={14} /> Reported questions</h2>
        <div className="flex gap-1" role="tablist">
          {TABS.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={status === k} onClick={() => setStatus(k)}
              className={`text-[11.5px] px-2.5 py-1 rounded-lg border ${status === k ? "bg-violet-600 border-violet-600 text-white" : "border-bg-border text-gray-600 hover:text-fg-primary"}`}>
              {label}{data?.counts ? ` · ${data.counts[k]}` : ""}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-tone-warn mb-2">{error}</p>}
      {!data ? (
        <PageLoader size="sm" />
      ) : data.items.length === 0 ? (
        <p className="text-[12.5px] text-gray-600">{status === "open" ? "No open reports. 🎉" : "Nothing here yet."}</p>
      ) : (
        <ul className="space-y-3">
          {data.items.map((it) => {
            const sn = it.snapshot || {};
            const isBlank = sn.type === "fill_blank";
            return (
              <li key={it.questionId} className="border border-bg-border rounded-xl p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] text-gray-600">
                    <span className="font-semibold text-fg-primary">{it.count} report{it.count > 1 ? "s" : ""}</span>
                    {" · "}{sn.examMode} {sn.subject} · {sn.chapter} · latest {dt(it.latestAt)}
                  </p>
                  <div className="flex gap-1.5 shrink-0">
                    {status !== "fixed" && (
                      <button disabled={busyId === it.questionId} onClick={() => act(it.questionId, "fixed")}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white disabled:opacity-60">Fixed</button>
                    )}
                    {status !== "dismissed" && (
                      <button disabled={busyId === it.questionId} onClick={() => act(it.questionId, "dismissed")}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-bg-border text-gray-600 hover:text-fg-primary disabled:opacity-60">Dismiss</button>
                    )}
                    {status !== "open" && (
                      <button disabled={busyId === it.questionId} onClick={() => act(it.questionId, "open")}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-bg-border text-gray-600 hover:text-fg-primary disabled:opacity-60">Re-open</button>
                    )}
                  </div>
                </div>
                <p className="text-[13px] text-fg-primary mt-2 leading-relaxed">{sn.questionText}</p>
                {isBlank ? (
                  <p className="text-[12px] mt-1.5"><span className="text-gray-600">Accepted answers: </span>{(sn.answers || []).join(" | ")}</p>
                ) : (
                  <ol className="mt-1.5 space-y-0.5 text-[12px]">
                    {(sn.options || []).map((o, i) => (
                      <li key={i} className={i === sn.correctIndex ? "font-semibold text-emerald-600" : "text-fg-primary"}>
                        {String.fromCharCode(65 + i)}. {o}{i === sn.correctIndex ? "  ← key" : ""}
                      </li>
                    ))}
                  </ol>
                )}
                {sn.explanation && <p className="text-[11.5px] text-gray-600 mt-1.5">Explanation: {sn.explanation}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {it.reasons.map((r) => (
                    <span key={r.reason} className="text-[10.5px] px-2 py-0.5 rounded-full bg-bg-panel border border-bg-border text-fg-primary">{r.label} × {r.n}</span>
                  ))}
                </div>
                {it.notes.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {it.notes.map((n, i) => <li key={i} className="text-[11.5px] text-gray-600">“{n}”</li>)}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[11px] text-gray-600 mt-3">To correct a question, tell Claude the details (or edit backend/seed/questions), merge, then run the seed command. Then press "Fixed" here.</p>
    </section>
  );
}
