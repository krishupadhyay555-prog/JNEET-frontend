// ============================================================
//  JNEET+ AI — components/chat/BouncingDots.jsx
// ============================================================

export function BouncingDots() {
  return (
    <span className="flex items-center gap-[5px] py-0.5 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.18}s` }}
          className="w-[6px] h-[6px] rounded-full bg-violet-400 animate-bounce-dots"
        />
      ))}
    </span>
  );
}