// ============================================================
//  JNEET+ AI — components/chat/EmptyChat.jsx
// ============================================================

import { Bot } from "lucide-react";

const QUICK_PROMPTS = {
  NEET: [
    "Mitosis aur Meiosis mein fark kya hai?",
    "Photorespiration ka mechanism explain karo",
    "Newton's Laws ke numerical solve karo",
    "Esterification reaction ka mechanism",
    "DNA replication ka full process",
    "Ohm's Law aur resistance ka numerical",
  ],
  JEE: [
    "Integration by parts explain karo",
    "Projectile motion ke equations derive karo",
    "Le Chatelier's Principle kya hai?",
    "Complex numbers ke properties",
    "Thermodynamics first law ka numerical",
    "Quadratic equations ke roots find karo",
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
        <Bot size={28} className="text-violet-400" />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1 tracking-tight">
          JNEET+ AI Mentor
        </h2>
        <p className="text-gray-600 text-sm">
          {examMode === "NEET"
            ? "Physics · Chemistry · Biology"
            : "Physics · Chemistry · Mathematics"}
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Koi bhi {examMode} sawaal puchho — main hamesha taiyar hoon.
        </p>
      </div>

      {/* Quick prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {prompts.map((q) => (
          <button
            key={q}
            onClick={() => onPromptSelect(q)}
            className="text-left text-xs bg-bg-card border border-bg-border
              hover:border-violet-600/40 hover:bg-bg-hover
              rounded-xl px-3 py-2.5 text-gray-600 hover:text-gray-300
              transition duration-150 leading-relaxed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}