// ============================================================
//  JNEET+ AI — components/tests/cbtState.js
//  NTA's five palette states and how a question gets one.
// ============================================================

export const STATE_STYLE = {
  notVisited:     { label: "Not visited",        cls: "bg-bg-panel border border-bg-border text-gray-600" },
  notAnswered:    { label: "Not answered",       cls: "bg-red-500/90 text-white" },
  answered:       { label: "Answered",           cls: "bg-emerald-600 text-white" },
  marked:         { label: "Marked for review",  cls: "bg-violet-600 text-white rounded-full" },
  answeredMarked: { label: "Answered & marked",  cls: "bg-violet-600 text-white rounded-full ring-2 ring-emerald-500" },
};

export function questionState(qid, { answered, visited, marked }) {
  const a = answered(qid);
  if (marked.has(qid)) return a ? "answeredMarked" : "marked";
  if (a) return "answered";
  return visited.has(qid) ? "notAnswered" : "notVisited";
}
