// ============================================================
//  JNEET+ AI — components/chat/QuickChips.jsx
//  One-tap follow-ups under the mentor's latest answer. Each chip just
//  sends a normal message — the mentor already has the chat history,
//  so "that" always means the answer right above.
// ============================================================

const CHIPS = [
  { label: "Simpler",            prompt: "Explain that more simply, with one example." },
  { label: "Give me a trick",    prompt: "Give me a short trick or mnemonic to remember this." },
  { label: "How it comes in the exam", prompt: "How is this topic asked in the exam? Tell me the common question types and mistakes." },
  { label: "Quiz me",            prompt: "Ask me 3 questions on this topic, one at a time. Tell me the answer only after I reply." },
];

export function QuickChips({ onPick, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 pl-[38px] -mt-2 animate-fade-in" role="group" aria-label="Quick follow-ups">
      {CHIPS.map((c) => (
        <button
          key={c.label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(c.prompt)}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-bg-border bg-bg-card text-gray-500
            hover:text-fg-primary hover:border-violet-600/40 transition active:scale-95 disabled:opacity-50"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
