// ============================================================
//  JNEET+ AI — components/ui/LoadingScreen.jsx  (NEW)
//  Replaces the old inline Sparkles-icon loading UI that lived
//  directly inside ProtectedRoute.jsx. That was the LAST place
//  in the app still using the Sparkles icon (it looked like
//  Gemini's icon) — everywhere else was already swapped for the
//  real JN logo in the previous cleanup pass.
//  Design: the JN logo breathes with a soft pulse (reusing the
//  existing animate-pulse-soft keyframe from index.css — no new
//  CSS needed), and the caption text cycles through a short set
//  of branded, feature-hinting lines instead of one static
//  "Loading your session..." string. This is a genuinely brief
//  screen (session-restore usually resolves in under a second),
//  so the rotation mostly just adds a bit of life/personality
//  rather than being a real progress indicator — it never claims
//  false progress or a percentage.
// ============================================================

import { useState, useEffect } from "react";

const LOADING_LINES = [
  "Loading your session…",
  "Getting your progress ready…",
];

export function LoadingScreen() {
  const [lineIndex, setLineIndex] = useState(0);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, LOADING_LINES.length - 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-5">
      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow-violet animate-pulse-soft">
        <img
          src="/icon-192.png"
          alt="JNEET+ AI"
          className="w-full h-full object-cover"
        />
      </div>

      <p
        key={lineIndex}
        className="text-sm text-gray-600 animate-fade-in font-medium min-h-[20px]"
      >
        {slow ? "Taking longer than usual — your internet may be slow." : LOADING_LINES[lineIndex]}
      </p>
      {slow ? (
        <button type="button" onClick={() => window.location.reload()}
          className="min-h-[44px] px-5 rounded-xl border border-bg-border text-sm font-semibold text-fg-primary">
          Retry
        </button>
      ) : null}
    </div>
  );
}