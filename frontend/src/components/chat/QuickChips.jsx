// ============================================================
//  JNEET+ AI — components/chat/QuickChips.jsx
//  One-tap follow-ups under the mentor's latest answer. Each chip just
//  sends a normal message — the mentor already has the chat history,
//  so "isko" always means the answer right above.
// ============================================================

const CHIPS = [
  { label: "Aur simple",                prompt: "Isko aur simple tarike se, ek example ke saath samjhao." },
  { label: "Trick do",                  prompt: "Isko yaad rakhne ki koi short trick ya mnemonic do." },
  { label: "Exam mein kaise aata hai",  prompt: "Ye topic exam mein kaise poocha jata hai? Common question types aur galtiyan batao." },
  { label: "Mujhse sawal pucho",        prompt: "Isi topic par mujhse 3 sawaal poochho, ek-ek karke. Answer mere reply ke baad batana." },
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
