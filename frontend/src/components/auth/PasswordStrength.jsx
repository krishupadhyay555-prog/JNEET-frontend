// ============================================================
//  JNEET+ AI — components/auth/PasswordStrength.jsx
//  Live strength meter + requirement checklist. Mirrors the backend
//  policy (8+ chars, a letter, a number; the server additionally
//  rejects very common passwords). Purely advisory UI.
// ============================================================

import { Check, Circle } from "lucide-react";
import { passwordChecks, passwordMeetsPolicy } from "../../utils/password.js";

function score(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw) && /[A-Za-z]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(4, Math.max(passwordMeetsPolicy(pw) ? 1 : 0, s - 1));
}

const LEVELS = [
  { label: "Too weak", color: "bg-red-400" },
  { label: "Weak",     color: "bg-orange-400" },
  { label: "Okay",     color: "bg-amber-400" },
  { label: "Good",     color: "bg-lime-500" },
  { label: "Strong",   color: "bg-emerald-500" },
];

export function PasswordStrength({ password }) {
  if (!password) return null;
  const s = score(password);
  const level = LEVELS[s];
  return (
    <div className="mt-2 animate-fade-in" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1 rounded-full transition-colors duration-300 ${s >= n ? level.color : "bg-[#EDE6F3]"}`} />
          ))}
        </div>
        <span className="text-[11px] text-[#6B6572] w-14 text-right">{level.label}</span>
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        {passwordChecks(password).map((c) => (
          <li key={c.id} className={`flex items-center gap-1 text-[11px] ${c.ok ? "text-emerald-600" : "text-[#8B8594]"}`}>
            {c.ok ? <Check size={11} /> : <Circle size={9} />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
