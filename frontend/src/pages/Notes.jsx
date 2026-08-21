// ============================================================
//  JNEET+ AI — pages/Notes.jsx  (v3 — filter chips removed)
//  REMOVED: the Physics/Chemistry/Biology quick-filter chips
//  added in v2. Root issue: they only match notes that literally
//  contain a subject-word somewhere in content/tag — a note that's
//  just a raw formula ("F = ma") with no subject word anywhere
//  would never surface under a chip, silently. True automatic
//  subject-detection would need an AI classification call on every
//  save (extra latency, extra API cost, a new failure point if
//  Gemini is slow/down) — not worth that complexity/fragility for
//  a low-stakes personal-notes feature. Back to plain manual
//  tag + full-text search only — predictable, nothing hidden.
//  UNCHANGED from v2: long-press/right-click context menu (Edit/
//  Delete) on each note, editor view, save flow, all API calls.
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "../components/ProfileMenu.jsx";
import { ContextMenu } from "../components/ui/ContextMenu.jsx";
import { notesApi } from "../api/notesApi.js";
import toast from "react-hot-toast";
import {
  ArrowLeft, Search, Plus, X, Trash2, Edit3, Loader2, StickyNote,
} from "lucide-react";

function formatRelative(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const LONG_PRESS_MS = 500;
const MOVE_CANCEL_PX = 10;

function NoteCard({ note, index, onOpen, onRequestMenu }) {
  const pressTimer = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const longPressFired = useRef(false);

  const clearTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return; // ignore right/middle mouse here — onContextMenu handles right-click
    longPressFired.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    pressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onRequestMenu(note, e.clientX, e.clientY);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearTimer();
  };

  const handlePointerUp = () => {
    clearTimer();
    if (!longPressFired.current) onOpen(note._id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    clearTimer();
    onRequestMenu(note, e.clientX, e.clientY);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={clearTimer}
      onContextMenu={handleContextMenu}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: "backwards" }}
      className="animate-fade-up w-full text-left bg-bg-card border border-bg-border
        hover:border-violet-600/40 hover:bg-bg-hover rounded-xl px-4 py-3.5
        transition-all duration-150 cursor-pointer select-none"
    >
      <p
        className="text-sm text-fg-primary font-medium leading-snug"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {note.preview}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {note.tag && (
          <span className="text-[10px] bg-violet-600/10 text-violet-600 border border-violet-600/25 px-2 py-0.5 rounded-full font-medium">
            {note.tag}
          </span>
        )}
        <span className="text-[11px] text-gray-600">{formatRelative(note.updatedAt)}</span>
      </div>
    </div>
  );
}

export default function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching]     = useState(false);
  const debounceRef = useRef(null);

  const [menu, setMenu] = useState(null); // { note, x, y } | null

  const [view, setView]               = useState("list"); // "list" | "editor"
  const [activeNoteId, setActiveNoteId] = useState(null); // null = creating a new note
  const [editContent, setEditContent] = useState("");
  const [editTag, setEditTag]         = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const loadNotes = useCallback(async (q) => {
    try {
      const res = await notesApi.list(q?.trim() || undefined);
      setNotes(res.data.notes ?? []);
    } catch {
      toast.error("Couldn't load your notes. Try again.");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSearching(false);
      loadNotes();
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => loadNotes(searchQuery), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const openNew = () => {
    setActiveNoteId(null);
    setEditContent("");
    setEditTag("");
    setView("editor");
  };

  const openNote = async (id) => {
    setActiveNoteId(id);
    setView("editor");
    setEditLoading(true);
    try {
      const res = await notesApi.get(id);
      setEditContent(res.data.note.content);
      setEditTag(res.data.note.tag || "");
    } catch {
      toast.error("Couldn't open this note.");
      setView("list");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditor = () => {
    setView("list");
    setActiveNoteId(null);
  };

  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error("Write something before saving.");
      return;
    }
    setSaving(true);
    try {
      if (activeNoteId) {
        await notesApi.update(activeNoteId, { content: editContent, tag: editTag });
      } else {
        await notesApi.create({ content: editContent, tag: editTag });
      }
      toast.success("Note saved");
      closeEditor();
      loadNotes(searchQuery);
    } catch {
      toast.error("Couldn't save this note. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;
    setDeleting(true);
    try {
      await notesApi.remove(activeNoteId);
      toast.success("Note deleted");
      closeEditor();
      loadNotes(searchQuery);
    } catch {
      toast.error("Couldn't delete this note. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleQuickDelete = async (noteId) => {
    try {
      await notesApi.remove(noteId);
      toast.success("Note deleted");
      loadNotes(searchQuery);
    } catch {
      toast.error("Couldn't delete this note. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <nav className="border-b border-bg-border bg-bg-surface px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (view === "editor" ? closeEditor() : navigate("/dashboard"))}
            className="text-gray-600 hover:text-fg-primary transition p-1 rounded-lg hover:bg-bg-hover"
          >
            <ArrowLeft size={17} />
          </button>
          <span className="font-bold text-sm tracking-wide">
            {view === "editor" ? (activeNoteId ? "Edit Note" : "New Note") : "Notes"}
          </span>
        </div>
        <ProfileMenu />
      </nav>

      {view === "list" ? (
        <div className="max-w-2xl mx-auto px-5 py-6 animate-fade-up">
          <div className="relative mb-5">
            {searching ? (
              <Loader2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" />
            ) : (
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes..."
              className="w-full bg-bg-panel border border-bg-border rounded-xl pl-10 pr-9 py-2.5
                text-sm text-fg-primary placeholder-gray-500 focus:outline-none
                focus:border-violet-500/50 transition-all duration-150"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-fg-primary transition p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl skeleton" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center pt-16 px-4">
              <StickyNote size={28} className="text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed">
                {searchQuery
                  ? `No notes found for "${searchQuery}".`
                  : "No notes yet. Save formulas, definitions, or anything you want to remember."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notes.map((n, i) => (
                <NoteCard
                  key={n._id}
                  note={n}
                  index={i}
                  onOpen={openNote}
                  onRequestMenu={(note, x, y) => setMenu({ note, x, y })}
                />
              ))}
            </div>
          )}

          <button
            onClick={openNew}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full
              bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center
              shadow-glow-violet transition-all duration-150 active:scale-95 hover:-translate-y-0.5 z-20"
            title="New note"
          >
            <Plus size={22} />
          </button>

          {menu && (
            <ContextMenu
              x={menu.x}
              y={menu.y}
              onClose={() => setMenu(null)}
              items={[
                {
                  label: "Edit",
                  icon: Edit3,
                  onClick: () => openNote(menu.note._id),
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  danger: true,
                  confirm: true,
                  onClick: () => handleQuickDelete(menu.note._id),
                },
              ]}
            />
          )}
        </div>
      ) : (
        <div
          className="max-w-2xl mx-auto px-5 py-6 animate-fade-up flex flex-col"
          style={{ minHeight: "calc(100dvh - 60px)" }}
        >
          {editLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={20} className="text-gray-500 animate-spin" />
            </div>
          ) : (
            <>
              <input
                type="text"
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                placeholder="Tag (optional) — e.g. Physics formula"
                maxLength={40}
                className="mb-3 bg-bg-panel border border-bg-border rounded-xl px-4 py-2
                  text-xs text-fg-primary placeholder-gray-500 focus:outline-none
                  focus:border-violet-500/50 transition-all duration-150"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write anything — a formula, a definition, a quick reminder..."
                maxLength={10000}
                autoFocus
                className="flex-1 w-full bg-transparent text-[0.9rem] leading-relaxed text-fg-primary
                  placeholder-gray-500 resize-none focus:outline-none font-sans"
              />

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-bg-border mt-4">
                {activeNoteId ? (
                  <button
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="flex items-center gap-1.5 text-xs text-red-500/80 hover:text-red-500
                      transition disabled:opacity-50 px-2 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={13} />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                ) : <span />}

                <button
                  onClick={handleSave}
                  disabled={saving || deleting || !editContent.trim()}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed
                    text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all duration-150
                    active:scale-[0.97]"
                >
                  {saving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}