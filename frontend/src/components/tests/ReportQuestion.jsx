// ============================================================
//  JNEET+ AI — components/tests/ReportQuestion.jsx
//  Small "Report" link under a question (result review + Revision).
//  Opens an inline panel: pick a reason, optional note, send.
//  The founder sees reports on /admin → Reported questions.
// ============================================================

import { useState } from "react";
import { Flag, Check } from "lucide-react";
import { reportApi } from "../../api/testApi.js";

const REASONS = [
  ["wrong_answer", "Answer is wrong"],
  ["wrong_question", "Question is wrong / unclear"],
  ["typo", "Typo or formatting"],
  ["out_of_syllabus", "Out of syllabus"],
  ["other", "Something else"],
];

export function ReportQuestion({ attemptId, questionId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  if (!attemptId || !questionId) return null;

  if (state === "done") {
    return (
      <p className="flex items-center gap-1.5 text-[11.5px] text-emerald-600 mt-3" role="status">
        <Check size={13} /> Thanks! We will check this question.
      </p>
    );
  }

  const send = async (e) => {
    e.preventDefault();
    if (!reason) { setError("Pick a reason."); return; }
    setState("sending"); setError("");
    try {
      await reportApi.report({ attemptId, questionId, reason, note: note.trim() });
      setState("done");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't send the report. Try again.");
      setState("idle");
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-gray-600 hover:text-fg-primary transition-colors">
        <Flag size={12} /> Report this question
      </button>
    );
  }

  return (
    <form onSubmit={send} className="mt-3 bg-bg-panel border border-bg-border rounded-xl p-3 space-y-2.5">
      <p className="text-[12px] font-semibold text-fg-primary">What's wrong with this question?</p>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Reason">
        {REASONS.map(([value, label]) => (
          <button key={value} type="button" role="radio" aria-checked={reason === value} onClick={() => { setReason(value); setError(""); }}
            className={`text-[11.5px] px-2.5 py-1.5 rounded-lg border transition-colors ${reason === value
              ? "bg-violet-600 border-violet-600 text-white" : "bg-bg-card border-bg-border text-fg-primary hover:border-violet-600/50"}`}>
            {label}
          </button>
        ))}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 500))} rows={2}
        placeholder="Optional: tell us the correct answer or what to fix"
        className="w-full text-[12.5px] bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-fg-primary placeholder:text-gray-600 focus:outline-none focus:border-violet-600/60 resize-none" />
      {error && <p className="text-[11.5px] text-tone-warn">{error}</p>}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={state === "sending"}
          className="text-[12px] font-semibold px-3.5 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send report"}
        </button>
        <button type="button" onClick={() => { setOpen(false); setError(""); }}
          className="text-[12px] px-3 py-1.5 rounded-lg text-gray-600 hover:text-fg-primary">Cancel</button>
      </div>
    </form>
  );
}
