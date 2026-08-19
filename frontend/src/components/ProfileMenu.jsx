// ============================================================
//  JNEET+ AI — components/ProfileMenu.jsx  (Portal fix v2.2)
//  FIX (dropdown hidden behind chat bubbles bug):
//    - The chat page's header uses `backdrop-blur-xl`, which
//      forces the browser to create its OWN stacking context for
//      that header. Because of that, the dropdown's z-50 only
//      ranked it above other things INSIDE the header — not above
//      the scrollable chat-messages area next to it, which is why
//      it kept rendering underneath the AI reply bubbles.
//    - Fix: render the dropdown menu through a React Portal
//      straight onto document.body. This takes it completely out
//      of the header's stacking context, so it always paints on
//      top of the whole page, everywhere it's used (Dashboard AND
//      Chat), with zero risk of this happening again elsewhere.
//    - Position is calculated from the button's on-screen location
//      (getBoundingClientRect) every time it opens.
//  Nothing else changed — same props, same behavior, same look.
// ============================================================

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const buttonRef = useRef(null);
  const menuRef   = useRef(null);

  // Recalculate dropdown position every time it opens, based on
  // where the avatar button actually is on screen right now.
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top:   rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const clickedButton = buttonRef.current && buttonRef.current.contains(e.target);
      const clickedMenu    = menuRef.current   && menuRef.current.contains(e.target);
      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    // Close on scroll too — a stale-positioned dropdown floating
    // away from the button as the page scrolls looks broken.
    const handleScroll = () => setOpen(false);

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full
          border border-transparent hover:border-bg-border hover:bg-bg-hover
          transition-all duration-150 active:scale-95"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-700
          flex items-center justify-center text-[11px] font-bold text-white shadow-glow-sm shrink-0">
          {getInitials(user?.name)}
        </div>
        <ChevronDown
          size={13}
          className={`text-gray-600 transition-transform duration-200 hidden sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: menuPos.top, right: menuPos.right }}
          className="w-64 bg-bg-surface border border-bg-border
            rounded-2xl shadow-card overflow-hidden z-[999] animate-scale-in origin-top-right"
        >
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-bg-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700
              flex items-center justify-center text-sm font-bold text-white shadow-glow-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg-primary truncate">{user?.name ?? "Student"}</p>
              <p className="text-[11px] text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              onClick={() => goTo("/profile")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400
                hover:text-fg-primary hover:bg-bg-hover transition-colors duration-150"
            >
              <User size={15} className="text-gray-600" />
              Profile
            </button>
            <button
              onClick={() => goTo("/settings")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400
                hover:text-fg-primary hover:bg-bg-hover transition-colors duration-150"
            >
              <Settings size={15} className="text-gray-600" />
              Settings
            </button>
          </div>

          <div className="border-t border-bg-border py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400
                hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}