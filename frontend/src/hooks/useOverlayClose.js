// ============================================================
//  JNEET+ AI — hooks/useOverlayClose.js
//  Closes an overlay (zoom, sheet, drawer) with Escape and, when
//  `back` is on, with the phone's Back button / back gesture — so Back
//  closes the overlay instead of leaving the page.
// ============================================================
import { useEffect, useRef } from "react";

export function useOverlayClose(open, onClose, { back = true } = {}) {
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close.current?.(); };
    window.addEventListener("keydown", onKey);

    let poppedByBack = false;
    const onPop = () => { poppedByBack = true; close.current?.(); };
    if (back) {
      window.history.pushState({ ...(window.history.state ?? {}), jnOverlay: true }, "");
      window.addEventListener("popstate", onPop);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!back) return;
      window.removeEventListener("popstate", onPop);
      // Closed with X / tap outside: drop the extra history entry again.
      // (If the student navigated away meanwhile, the top entry isn't ours
      // any more and history is left alone.)
      if (!poppedByBack && window.history.state?.jnOverlay) window.history.back();
    };
  }, [open, back]);
}
