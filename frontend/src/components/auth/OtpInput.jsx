// ============================================================
//  JNEET+ AI — components/auth/OtpInput.jsx
//  Six-box one-time-code entry like Google / WhatsApp / banking apps:
//   - numeric keypad on phones, SMS/e-mail autofill (one-time-code)
//   - paste a whole code into any box and it spreads across all six
//   - Backspace / arrow keys move between boxes
//   - calls onComplete(code) when the 6th digit is entered
//   - screen-reader labels per digit
// ============================================================

import { useRef, useEffect } from "react";

const LENGTH = 6;

export function OtpInput({ value, onChange, onComplete, disabled, error, autoFocus = true, idPrefix = "otp" }) {
  const refs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next) => {
    const clean = next.replace(/\D/g, "").slice(0, LENGTH);
    onChange(clean);
    if (clean.length === LENGTH) onComplete?.(clean);
    return clean;
  };

  const focusAt = (i) => {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];
    el?.focus();
    el?.select?.();
  };

  const handleInput = (i, e) => {
    const typed = e.target.value.replace(/\D/g, "");
    if (!typed) {
      commit(value.slice(0, i) + value.slice(i + 1));
      return;
    }
    // Autofill / multi-digit input arrives in one box: spread it.
    const next = (value.slice(0, i) + typed + value.slice(i + 1)).slice(0, LENGTH);
    const clean = commit(next);
    focusAt(Math.min(i + typed.length, LENGTH - 1));
    if (clean.length === LENGTH) refs.current[LENGTH - 1]?.blur?.();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) return; // let onChange clear this box
      e.preventDefault();
      commit(value.slice(0, Math.max(0, i - 1)) + value.slice(i));
      focusAt(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault(); focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault(); focusAt(i + 1);
    }
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData?.getData("text") ?? "").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    commit(text);
    focusAt(Math.min(text.length, LENGTH - 1));
  };

  return (
    <div>
      <div role="group" aria-label="6-digit verification code" className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            id={`${idPrefix}-${i}`}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => handleInput(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={i === 0 ? LENGTH : 1}
            aria-label={`Digit ${i + 1} of ${LENGTH}`}
            aria-invalid={error ? "true" : undefined}
            className={[
              "w-full min-w-0 aspect-square max-w-[48px] text-center text-lg font-semibold",
              "bg-white border rounded-xl text-[#2D2A32] font-sans",
              "focus:outline-none transition-all duration-150 disabled:opacity-50",
              error
                ? "border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]"
                : "border-[#EDE6F3] focus:border-[#93C5FD] focus:shadow-[0_0_0_3px_rgba(147,197,253,0.18)]",
            ].join(" ")}
          />
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-red-500 text-xs mt-2 animate-fade-in">{error}</p>
      ) : null}
    </div>
  );
}
