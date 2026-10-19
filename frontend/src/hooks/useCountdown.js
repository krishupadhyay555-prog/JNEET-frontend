// ============================================================
//  JNEET+ AI — hooks/useCountdown.js
//  Whole-second countdown (resend-code timers). Based on an absolute
//  end time rather than decrementing a counter, so background-tab
//  throttling or a sleeping phone can't make the timer drift.
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

export function useCountdown(initialSeconds = 0) {
  const endRef = useRef(0);
  const [left, setLeft] = useState(Math.max(0, Math.ceil(initialSeconds)));

  useEffect(() => {
    if (initialSeconds > 0) endRef.current = Date.now() + initialSeconds * 1000;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (left <= 0) return undefined;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [left > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback((seconds) => {
    const s = Math.max(0, Math.ceil(Number(seconds) || 0));
    endRef.current = Date.now() + s * 1000;
    setLeft(s);
  }, []);

  return [left, start];
}
