// ============================================================
//  JNEET+ AI — components/ui/ConfirmDialog.jsx
//  Replaces the browser's plain window.confirm() with an on-brand dialog:
//  focus moves into it, Escape cancels, Enter on the focused button confirms,
//  the page behind stays put. `tone="danger"` colours the confirm button red.
// ============================================================

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  tone = "primary", busy = false, onConfirm, onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    confirmRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape" && !busy) onCancel?.(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); previous?.focus?.(); };
  }, [open, busy, onCancel]);

  if (!open) return null;

  const confirmCls = tone === "danger"
    ? "bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-500"
    : "bg-violet-600 hover:bg-violet-500 text-white border border-transparent";

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onCancel?.(); }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-msg"
        className="w-full max-w-sm rounded-2xl border border-bg-border bg-bg-surface shadow-card p-5 animate-scale-in">
        <h2 id="confirm-title" className="text-base font-bold text-fg-primary mb-1.5">{title}</h2>
        <p id="confirm-msg" className="text-xs text-gray-600 leading-relaxed mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} disabled={busy}
            className="px-4 py-2 rounded-xl border border-bg-border text-xs font-semibold text-gray-500 hover:text-fg-primary hover:bg-bg-hover transition active:scale-95 disabled:opacity-50">
            {cancelLabel}
          </button>
          <button type="button" ref={confirmRef} onClick={onConfirm} disabled={busy}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 disabled:opacity-50 ${confirmCls}`}>
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
