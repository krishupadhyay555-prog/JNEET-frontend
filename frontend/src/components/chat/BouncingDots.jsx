// ============================================================
//  JNEET+ AI — components/chat/BouncingDots.jsx
// ============================================================

export function BouncingDots() {
  return (
    <span className="flex items-center gap-[5px] py-1 px-1" aria-label="AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.18}s` }}
          className="w-[6px] h-[6px] rounded-full bg-violet-300 shadow-[0_0_10px_rgba(91,179,255,0.35)] animate-bounce-dots"
        />
      ))}
    </span>
  );
}
