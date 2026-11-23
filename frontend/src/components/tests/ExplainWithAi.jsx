// "Explain with AI" for an official PYQ (Pro & Elite). The server only
// returns an explanation whose final answer matches NTA's key.
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lightbulb, Lock } from "lucide-react";
import { learnApi } from "../../api/testApi.js";
import { Markdown } from "../chat/Markdown.jsx";

export function ExplainWithAi({ questionId }) {
  const [state, setState] = useState({ status: "idle" });
  if (!questionId) return null;

  const run = async () => {
    setState({ status: "loading" });
    try {
      const { data } = await learnApi.explainPyq(questionId);
      setState(data.available ? { status: "ok", text: data.text } : { status: "none", message: data.message });
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "PLAN_REQUIRED") setState({ status: "locked" });
      else setState({ status: "error", message: err.response?.data?.error || "Could not load the explanation. Please try again." });
    }
  };

  if (state.status === "ok") {
    return (
      <div className="bg-bg-panel border border-bg-border rounded-xl p-3.5 text-sm">
        <p className="text-[11px] text-gray-600 font-semibold mb-1 flex items-center gap-1.5"><Lightbulb size={13} /> AI explanation · matches NTA&apos;s answer key</p>
        <Markdown>{state.text}</Markdown>
      </div>
    );
  }
  if (state.status === "locked") {
    return (
      <p className="text-xs text-gray-600 flex items-center gap-1.5">
        <Lock size={13} /> Step-by-step AI explanations of PYQs are in Pro and Elite. <Link to="/plans" className="font-semibold underline">See plans</Link>
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      <button type="button" onClick={run} disabled={state.status === "loading"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-bg-border bg-bg-card px-3 py-2 hover:border-fg-secondary disabled:opacity-60">
        {state.status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
        {state.status === "loading" ? "Solving… (can take ~20 s)" : "Explain with AI"}
      </button>
      {(state.status === "none" || state.status === "error") && <p className="text-[11px] text-gray-600">{state.message}</p>}
    </div>
  );
}
