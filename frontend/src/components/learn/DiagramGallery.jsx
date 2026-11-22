// Grid of chapter diagrams; tap to open full size (pinch/scroll to zoom).
import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function DiagramZoom({ d, onClose }) {
  const [big, setBig] = useState(false);
  if (!d) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/85 overflow-auto p-3 flex flex-col" onClick={onClose} role="dialog" aria-label={d.t}>
      <button type="button" onClick={onClose} className="fixed top-3 right-3 text-white p-2 rounded-full bg-black/60" aria-label="Close">
        <X size={18} />
      </button>
      <p className="text-white text-sm font-semibold text-center mb-2 pr-10">{d.t}</p>
      <img src={d.f} alt={d.t} onClick={(e) => { e.stopPropagation(); setBig((v) => !v); }}
        className={`m-auto max-w-none bg-white rounded-lg ${big ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        style={{ width: big ? "min(1600px, 230vw)" : "min(1100px, 100%)" }} />
      <p className="text-white/70 text-[11px] text-center mt-2">Tap the image to zoom {big ? "out" : "in"}</p>
    </div>,
    document.body,
  );
}

export function DiagramGallery({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <p className="text-[12px] text-gray-600">Tap a diagram to open it full size.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((d) => (
          <button key={d.id} type="button" onClick={() => setOpen(d)}
            className="text-left bg-bg-card border border-bg-border rounded-xl overflow-hidden hover:border-fg-secondary transition">
            <div className="bg-white aspect-[4/3] flex items-center justify-center">
              <img src={d.f} alt={d.t} loading="lazy" decoding="async" width={d.w} height={d.h} className="max-w-full max-h-full object-contain" />
            </div>
            <p className="px-2.5 py-2 text-[12.5px] font-semibold leading-snug">{d.t}</p>
          </button>
        ))}
      </div>
      <DiagramZoom d={open} onClose={() => setOpen(null)} />
    </>
  );
}
