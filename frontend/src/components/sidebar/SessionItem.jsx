// ============================================================
//  JNEET+ AI — components/sidebar/SessionItem.jsx  (v3 — right-
//  click open+close bug fixed)
//  FIXED (root cause): right-click fires pointerdown(button=2) →
//  contextmenu → pointerup, in that order. handlePointerDown
//  already skipped arming the long-press timer for non-left
//  buttons, but handlePointerUp had NO such check — it fired
//  onSelect() unconditionally whenever longPressFired was false,
//  which was true for every right-click (the timer never even
//  started). That's why right-click both opened the chat AND
//  (via Sidebar's onClose in handleSelectSession) closed the
//  mobile sidebar. Added isPrimaryButtonRef, set in pointerdown,
//  checked in pointerup — onSelect now only fires after a genuine
//  left-click/tap, never after a right-click.
//  UNCHANGED: long-press detection, pin/rename display, inline
//  rename input, context-menu trigger button.
// ============================================================

import { memo, useState, useRef, useEffect } from "react";
import { MessageSquare, Pin, MoreVertical } from "lucide-react";

const LONG_PRESS_MS = 500;
const MOVE_CANCEL_PX = 10;

export const SessionItem = memo(function SessionItem({
  session, active, onSelect, index = 0,
  isEditing, onFinishRename,
  onRequestMenu,
}) {
  const [draftTitle, setDraftTitle] = useState(session.title);
  const inputRef = useRef(null);

  const pressTimer = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const longPressFired = useRef(false);
  const isPrimaryButtonRef = useRef(true);

  useEffect(() => {
    if (isEditing) {
      setDraftTitle(session.title);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [isEditing, session.title]);

  const clearTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePointerDown = (e) => {
    if (isEditing) return;

    // Touch events report e.button === 0 too (or undefined) —
    // only a real right/middle mouse click sets this to a
    // non-zero value, so this correctly leaves long-press
    // (touch) untouched while flagging real right-clicks.
    isPrimaryButtonRef.current = e.button === undefined || e.button === 0;

    if (!isPrimaryButtonRef.current) return; // right/middle click — let onContextMenu handle it, don't arm the timer

    longPressFired.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    pressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onRequestMenu(session, e.clientX, e.clientY);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearTimer();
  };

  const handlePointerUp = () => {
    clearTimer();
    // FIX: only open the chat on a genuine left-click/tap that
    // wasn't a long-press — never on a right-click's trailing
    // pointerup event.
    if (isPrimaryButtonRef.current && !longPressFired.current && !isEditing) {
      onSelect(session._id);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    clearTimer();
    if (!isEditing) onRequestMenu(session, e.clientX, e.clientY);
  };

  const handleMenuButtonClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onRequestMenu(session, rect.right, rect.bottom + 4);
  };

  const commitRename = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== session.title) {
      onFinishRename(session._id, trimmed);
    } else {
      onFinishRename(session._id, null);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      onFinishRename(session._id, null);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={clearTimer}
      onContextMenu={handleContextMenu}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms`, animationFillMode: "backwards" }}
      className={`animate-fade-up group relative flex items-center gap-2 px-2.5 py-2 rounded-xl
        transition-all duration-150 text-xs select-none
        ${isEditing ? "" : "cursor-pointer hover:translate-x-0.5"}
        ${active
          ? "bg-violet-600/15 border border-violet-600/25 text-fg-primary"
          : "text-gray-600 hover:bg-bg-hover hover:text-fg-primary border border-transparent"
        }`}
    >
      <MessageSquare size={11} className="shrink-0 mt-0.5 opacity-60" />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={commitRename}
            onClick={(e) => e.stopPropagation()}
            maxLength={100}
            className="w-full bg-bg-panel border border-violet-500/50 rounded-lg px-1.5 py-0.5
              text-xs text-fg-primary focus:outline-none"
          />
        ) : (
          <div className="flex items-center gap-1">
            {session.pinned && (
              <Pin size={9} className="shrink-0 fill-current opacity-70" />
            )}
            <p className="truncate leading-relaxed font-medium">{session.title}</p>
          </div>
        )}
        {!isEditing && session.lastMessage && (
          <p className="truncate text-[10px] text-gray-700 mt-0.5 font-normal">
            {session.lastMessage}
          </p>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={handleMenuButtonClick}
          className="opacity-0 group-hover:opacity-100 text-gray-700
            hover:text-fg-primary transition-all duration-150 shrink-0 p-1 rounded-md hover:bg-bg-hover"
          title="Chat options"
        >
          <MoreVertical size={12} />
        </button>
      )}
    </div>
  );
});