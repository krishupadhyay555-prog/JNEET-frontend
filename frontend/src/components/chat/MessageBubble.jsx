// ============================================================
//  JNEET+ AI — components/chat/MessageBubble.jsx  (v6 — full actions)
//  Every message now has the actions people expect from ChatGPT / Claude:
//   AI answer : Copy · 👍 · 👎 · Regenerate (latest answer) · Save
//   Your msg  : Copy · Edit (re-asks from that point)
//  How to reach them:
//   - desktop : hover the message (always visible on the latest answer),
//               or right-click for the same list as a menu
//   - mobile  : tap the message to show the bar, or press-and-hold for the menu
// ============================================================

import { memo, useState, useRef, useEffect, useCallback } from "react";
import {
  User, Bookmark, BookmarkCheck, Copy, Check, RefreshCw,
  ThumbsUp, ThumbsDown, Pencil, X, ArrowUp,
} from "lucide-react";
import { Markdown } from "./Markdown.jsx";
import { ContextMenu } from "../ui/ContextMenu.jsx";
import { useCopy } from "../../hooks/useCopy.js";

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE = 8;

function ActionButton({ label, onClick, active, activeClass = "text-fg-primary", disabled, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : !!active}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`p-1.5 rounded-lg transition-all duration-150 active:scale-90 disabled:opacity-40 disabled:pointer-events-none
        ${active ? activeClass : "text-gray-500 hover:text-fg-primary hover:bg-bg-hover"}`}
    >
      {children}
    </button>
  );
}

export const MessageBubble = memo(function MessageBubble({
  msg, isLastAi = false, busy = false,
  onToggleSaved, onRegenerate, onEdit, onFeedback,
}) {
  const isUser = msg.role === "user";
  const [copied, copy] = useCopy();
  const [showBar, setShowBar] = useState(false);   // tapped open (touch)
  const [menu, setMenu] = useState(null);          // { x, y } | null
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(msg.content);
  const pressRef = useRef({ timer: null, x: 0, y: 0, fired: false });
  const taRef = useRef(null);

  const canRegenerate = !isUser && isLastAi && !busy && !!onRegenerate;
  const canEdit = isUser && !busy && !!onEdit;

  // ── long-press (touch/pen) → context menu ──────────────────
  const clearPress = () => { clearTimeout(pressRef.current.timer); pressRef.current.timer = null; };
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" || editing) return;
    pressRef.current = { ...pressRef.current, x: e.clientX, y: e.clientY, fired: false };
    clearPress();
    pressRef.current.timer = setTimeout(() => {
      pressRef.current.fired = true;
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch { /* unsupported */ } }
      setMenu({ x: pressRef.current.x, y: pressRef.current.y });
    }, LONG_PRESS_MS);
  };
  const onPointerMove = (e) => {
    if (!pressRef.current.timer) return;
    if (Math.abs(e.clientX - pressRef.current.x) > MOVE_TOLERANCE || Math.abs(e.clientY - pressRef.current.y) > MOVE_TOLERANCE) clearPress();
  };
  const onClick = (e) => {
    if (pressRef.current.fired) { pressRef.current.fired = false; e.preventDefault(); return; }
    if (e.target.closest("a,button,textarea")) return;
    if (window.getSelection()?.toString()) return;          // selecting text, not tapping
    if (window.matchMedia?.("(hover: none)").matches) setShowBar((v) => !v);
  };
  const onContextMenu = (e) => {
    if (editing) return;
    e.preventDefault();                                      // right-click or Android long-press
    clearPress();
    setMenu({ x: e.clientX, y: e.clientY });
  };
  useEffect(() => () => clearTimeout(pressRef.current.timer), []);

  // ── edit ───────────────────────────────────────────────────
  const startEdit = useCallback(() => { setDraft(msg.content); setEditing(true); setMenu(null); }, [msg.content]);
  useEffect(() => {
    if (!editing) return;
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, [editing]);
  useEffect(() => {
    const ta = taRef.current;
    if (!editing || !ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 260)}px`;
  }, [draft, editing]);
  const submitEdit = () => {
    const t = draft.trim();
    if (!t) return;
    setEditing(false);
    if (t !== msg.content) onEdit(msg._id, t);
  };

  const menuItems = isUser
    ? [
        { label: "Copy", icon: Copy, onClick: () => copy(msg.content) },
        ...(canEdit ? [{ label: "Edit", icon: Pencil, onClick: startEdit }] : []),
      ]
    : [
        { label: "Copy", icon: Copy, onClick: () => copy(msg.content) },
        ...(canRegenerate ? [{ label: "Regenerate", icon: RefreshCw, onClick: () => onRegenerate(msg._id) }] : []),
        { label: msg.feedback === "up" ? "Remove good response" : "Good response", icon: ThumbsUp, onClick: () => onFeedback?.(msg, "up") },
        { label: msg.feedback === "down" ? "Remove bad response" : "Bad response", icon: ThumbsDown, onClick: () => onFeedback?.(msg, "down") },
        { label: msg.saved ? "Remove from saved" : "Save", icon: msg.saved ? BookmarkCheck : Bookmark, onClick: () => onToggleSaved?.(msg) },
      ];

  const barVisible = showBar || (isLastAi && !busy);

  return (
    <div
      className={`flex items-start gap-2.5 group animate-message-in
        ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110">
          <User size={12} className="text-white" />
        </div>
      ) : (
        <div className="w-7 h-7 relative shrink-0 mt-0.5 transition-transform duration-200 hover:scale-110" aria-hidden="true">
          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#4a8fe8]/90" />
          <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-[#34b76a]/90" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[86%] sm:max-w-[76%] lg:max-w-[620px] ${editing ? "w-full" : ""}
          ${isUser ? "items-end" : "items-start"}`}
      >
        {editing ? (
          <div className="w-full rounded-2xl border border-violet-500/40 bg-bg-card p-2.5 shadow-card animate-scale-in">
            <textarea
              ref={taRef}
              value={draft}
              maxLength={5000}
              rows={1}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setEditing(false); }
                else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitEdit(); }
              }}
              aria-label="Edit your message"
              className="w-full resize-none bg-transparent text-[16px] sm:text-[0.875rem] leading-[1.6] text-fg-primary focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-[11px] text-gray-500 hidden sm:block">Ctrl/⌘ + Enter to send</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:text-fg-primary hover:bg-bg-hover transition-colors active:scale-95">
                  <X size={12} /> Cancel
                </button>
                <button type="button" onClick={submitEdit} disabled={!draft.trim() || draft.trim() === msg.content}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none">
                  <ArrowUp size={12} /> Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={clearPress}
            onPointerCancel={clearPress}
            onPointerLeave={clearPress}
            onClick={onClick}
            onContextMenu={onContextMenu}
            style={{ WebkitTouchCallout: "none" }}
            className={`
              px-4 py-2.5 text-[0.875rem] leading-[1.65]
              tracking-[0.002em] break-words
              transition duration-200
              ${isUser
                ? `bg-gradient-to-br from-violet-500 to-violet-700 text-white
                   rounded-t-2xl rounded-bl-2xl rounded-br-md
                   shadow-[0_10px_28px_rgba(74,161,230,0.16)]`
                : `bg-bg-card border border-bg-border text-fg-primary
                   rounded-t-2xl rounded-br-2xl rounded-bl-md
                   shadow-[0_10px_30px_rgba(0,0,0,0.10)]
                   ${msg.saved ? "ring-1 ring-amber-500/30" : ""}`
              }
            `}
          >
            {isUser ? <p className="whitespace-pre-wrap">{msg.content}</p> : <Markdown>{msg.content}</Markdown>}
          </div>
        )}

        {/* Action bar */}
        {!editing && (
          <div
            className={`flex items-center gap-0.5 transition-opacity duration-150
              ${barVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"}`}
          >
            <ActionButton label={copied ? "Copied" : "Copy"} onClick={() => copy(msg.content)}>
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </ActionButton>

            {isUser && canEdit && (
              <ActionButton label="Edit message" onClick={startEdit}><Pencil size={14} /></ActionButton>
            )}

            {!isUser && (
              <>
                <ActionButton label="Good response" active={msg.feedback === "up"} activeClass="text-emerald-500" onClick={() => onFeedback?.(msg, "up")}>
                  <ThumbsUp size={14} className={msg.feedback === "up" ? "fill-current" : ""} />
                </ActionButton>
                <ActionButton label="Bad response" active={msg.feedback === "down"} activeClass="text-rose-500" onClick={() => onFeedback?.(msg, "down")}>
                  <ThumbsDown size={14} className={msg.feedback === "down" ? "fill-current" : ""} />
                </ActionButton>
                {canRegenerate && (
                  <ActionButton label="Regenerate" onClick={() => onRegenerate(msg._id)}><RefreshCw size={14} /></ActionButton>
                )}
                <ActionButton label={msg.saved ? "Remove from saved" : "Save"} active={msg.saved} activeClass="text-amber-400" onClick={() => onToggleSaved?.(msg)}>
                  {msg.saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                </ActionButton>
              </>
            )}
          </div>
        )}
      </div>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />}
    </div>
  );
});
