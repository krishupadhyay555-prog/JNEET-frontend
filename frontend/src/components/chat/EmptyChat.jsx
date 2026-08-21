// ============================================================
//  JNEET+ AI — components/chat/EmptyChat.jsx  (v4 — real logo)
//  CHANGED: Sparkles icon (looked like Gemini's icon) replaced
//  with the app's own JN logo image (frontend/public/icon-192.png).
//  Everything else — quick-prompt grid, English text, layout — is
//  UNCHANGED from v3.
// ============================================================

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

      {/* Icon — app's own JN logo, not a generic AI-sparkle */}
      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow-violet">
        <img
          src="/icon-192.png"
          alt="JNEET+ AI"
          className="w-full h-full object-cover"
        />
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