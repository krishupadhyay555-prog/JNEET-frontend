// ============================================================
//  JNEET+ AI — components/ui/ContextMenu.jsx  (NEW)
//  Reusable right-click (desktop) / long-press (mobile) context
//  menu — built generic on purpose so it can be reused wherever
//  this pattern is needed next (Sidebar chat sessions, Profile,
//  etc), not just Notes.
//  Items with `confirm: true` require a second click to actually
//  fire — the first click "arms" it (label changes, turns red),
//  protecting against an accidental long-press deleting something.
//  Auto-clamps position so the menu never renders off-screen when
//  triggered near a viewport edge.
// ============================================================

import { useState, useEffect, useRef } from "react";

export function ContextMenu({ x, y, items, onClose }) {
  const [armedIndex, setArmedIndex] = useState(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    const clampedLeft = Math.min(x, window.innerWidth - rect.width - 8);
    const clampedTop  = Math.min(y, window.innerHeight - rect.height - 8);
    setPos({ left: Math.max(8, clampedLeft), top: Math.max(8, clampedTop) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (item, index) => {
    if (item.confirm && armedIndex !== index) {
      setArmedIndex(index);
      return;
    }
    item.onClick();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ position: "fixed", left: pos.left, top: pos.top }}
      className="z-50 min-w-[170px] bg-bg-card border border-bg-border rounded-xl
        shadow-card py-1.5 animate-scale-in"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const isArmed = item.confirm && armedIndex === i;
        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item, i)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-left
              transition-colors duration-100
              ${isArmed
                ? "bg-red-500/10 text-red-500"
                : item.danger
                  ? "text-red-500/85 hover:bg-red-500/10 hover:text-red-500"
                  : "text-fg-primary hover:bg-bg-hover"
              }`}
          >
            <Icon size={14} />
            {isArmed ? "Confirm delete?" : item.label}
          </button>
        );
      })}
    </div>
  );
}