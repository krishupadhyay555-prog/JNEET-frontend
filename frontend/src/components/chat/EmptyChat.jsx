// ============================================================
//  JNEET+ AI — components/chat/EmptyChat.jsx  (v3 — all text English)
//  CHANGED: quick-prompt example questions AND the description
//  line are now English (were Hinglish). Since the AI itself will
//  still reply in whatever language the student actually types in
//  their own message, these example prompts no longer need to
//  demonstrate Hinglish phrasing — clicking one still sends a
//  perfectly valid question, and the AI mirrors whatever language
//  the student's own follow-up messages use from there.
//  Everything else — icon, layout, prompt grid — is UNCHANGED.
// ============================================================

import { Sparkles } from "lucide-react";

const QUICK_PROMPTS = {
  NEET: [
    "What's the difference between Mitosis and Meiosis?",
    "Explain the mechanism of Photorespiration",
    "Solve numericals on Newton's Laws",
    "Explain the mechanism of Esterification",
    "Explain the full process of DNA replication",
    "Solve a numerical on Ohm's Law and resistance",
  ],
  JEE: [
    "Explain integration by parts",
    "Derive the equations of projectile motion",
    "What is Le Chatelier's Principle?",
    "Explain the properties of complex numbers",
    "Solve a numerical on the first law of thermodynamics",
    "Find the roots of a quadratic equation",
  ],
};

export function EmptyChat({ examMode, onPromptSelect }) {
  const prompts = QUICK_PROMPTS[examMode] ?? QUICK_PROMPTS.NEET;

  return (
    <div className="flex flex-col items-center justify-center h-full
      text-center gap-6 pb-20 px-4 animate-fade-up">

      {/* Icon */}
      <div className="w-16 h-16 bg-violet-600/10 border border-violet-600/20
        rounded-2xl flex items-center justify-center shadow-glow-violet">
        <Sparkles size={28} className="text-violet-400" />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-fg-primary mb-1 tracking-tight">
          JNEET+ AI Mentor
        </h2>
        <p className="text-gray-600 text-sm">
          {examMode === "NEET"
            ? "Physics · Chemistry · Biology"
            : "Physics · Chemistry · Mathematics"}
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Ask any {examMode} question — I'm always ready to help.
        </p>
      </div>

      {/* Quick prompts — staggered entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {prompts.map((q, i) => (
          <button
            key={q}
            onClick={() => onPromptSelect(q)}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
            className="animate-fade-up text-left text-xs bg-bg-card border border-bg-border
              hover:border-violet-600/40 hover:bg-bg-hover hover:-translate-y-0.5
              rounded-xl px-3 py-2.5 text-gray-600 hover:text-fg-primary
              transition-all duration-150 leading-relaxed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}