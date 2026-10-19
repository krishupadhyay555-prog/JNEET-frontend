// ============================================================
//  JNEET+ AI — components/sidebar/Sidebar.jsx  (v7 — Claude-style hover rail)
//  ADDED: sessionMenu state (open ContextMenu with Rename/Pin/
//  Delete) + editingSessionId state (which session is currently
//  in inline-rename mode) — both lifted here so a single shared
//  <ContextMenu /> instance serves every SessionItem, matching
//  the pattern already used in Notes.jsx. Passed down to
//  SessionItem in BOTH render paths (normal history list AND
//  search-results list) so pin/rename/delete work identically
//  whether or not a search is active.
//  v7: on desktop the sidebar is a slim icon rail that expands over the
//  chat when the cursor touches it (and can be pinned open); on mobile it
//  is a slide-over drawer. Everything else (search debounce, tabs, saved-tab logic,
//  collapse animation, real JN logo) — UNCHANGED from v5.
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Plus, Bookmark, LayoutDashboard, Search, Loader2,
  Edit3, Pin, PinOff, Trash2, PanelLeftClose, PanelLeftOpen, Clock,
} from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { chatApi } from "../../api/chatApi.js";
import { ContextMenu }     from "../ui/ContextMenu.jsx";
import { SessionItem }     from "./SessionItem.jsx";
import { SavedItem }       from "./SavedItem.jsx";
import { SidebarSkeletons } from "../ui/SkeletonLoader.jsx";

export function Sidebar({ pinned, onTogglePin, mobileOpen, onMobileClose }) {
  const navigate                  = useNavigate();
  const isDesktop                 = useMediaQuery("(min-width: 768px)");
  const canHover                  = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovered, setHovered]     = useState(false);
  const hoverTimer                = useRef(null);
  const searchRef                 = useRef(null);
  const { examMode }              = useAuth();
  const {
    sessions, savedItems,
    activeSessionId, isSessionsLoaded,
    selectSession, newSession,
    deleteSession, renameSession, togglePin,
    toggleSaved,
  } = useChat();

  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const [sessionMenu, setSessionMenu] = useState(null); // { session, x, y } | null
  const [editingSessionId, setEditingSessionId] = useState(null);

  useEffect(() => {
    if (activeTab !== "history" || !searchQuery.trim()) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await chatApi.searchChats(searchQuery.trim());
        setSearchResults(res.data.results ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, activeTab]);

  const filteredSaved = savedItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.content?.toLowerCase().includes(q) ||
      item.sessionTitle?.toLowerCase().includes(q)
    );
  });

  // Desktop: collapse the hover-expanded rail after choosing something; mobile: close the drawer.
  const closeMobile = () => { if (!isDesktop) onMobileClose?.(); else if (!pinned) setHovered(false); };

  const handleNewChat = async () => {
    await newSession();
    closeMobile();
  };

  const handleSelectSession = async (id) => {
    await selectSession(id);
    closeMobile();
  };

  const handleRemoveSaved = (item) => {
    toggleSaved({ ...item, saved: true });
  };

  const handleOpenSaved = async (item) => {
    if (!item.sessionId) return;
    await selectSession(item.sessionId);
    closeMobile();
  };

  const handleFinishRename = (sessionId, newTitle) => {
    setEditingSessionId(null);
    if (newTitle) renameSession(sessionId, newTitle);
  };

  const menuItems = sessionMenu ? [
    {
      label: "Rename",
      icon: Edit3,
      onClick: () => setEditingSessionId(sessionMenu.session._id),
    },
    {
      label: sessionMenu.session.pinned ? "Unpin" : "Pin",
      icon: sessionMenu.session.pinned ? PinOff : Pin,
      onClick: () => togglePin(sessionMenu.session._id),
    },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      confirm: true,
      onClick: () => deleteSession(sessionMenu.session._id),
    },
  ] : [];

  // SessionItem expects `lastMessage` — search results carry
  // `snippet` instead, so map here rather than touching SessionItem.
  const searchResultsForDisplay = (searchResults ?? []).map((r) => ({
    _id:         r._id,
    title:       r.title,
    lastMessage: r.snippet,
    createdAt:   r.createdAt,
    pinned:      r.pinned,
  }));


  // ── hover-to-expand (desktop, mouse only) ───────────────────
  const menuOpen = !!sessionMenu || !!editingSessionId;
  const expanded = isDesktop ? (pinned || hovered) : true;

  const openSoon = useCallback((delay = 110) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHovered(true), delay);
  }, []);
  const closeSoon = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHovered(false), 260);
  }, []);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const onEnter = (e) => { if (canHover && e.pointerType === "mouse") openSoon(); };
  const onLeave = (e) => { if (canHover && e.pointerType === "mouse" && !menuOpen) closeSoon(); };
  // Keyboard users: focusing anything in the rail expands it, leaving collapses it.
  const onFocusIn = () => { if (isDesktop) { clearTimeout(hoverTimer.current); setHovered(true); } };
  const onBlurOut = (e) => {
    if (isDesktop && !e.currentTarget.contains(e.relatedTarget) && !menuOpen) closeSoon();
  };
  const expandAndFocusSearch = () => {
    setHovered(true);
    setActiveTab("history");
    setTimeout(() => searchRef.current?.focus(), 220);
  };

  const fullPanel = (
    <div className="w-[264px] h-full flex flex-col bg-bg-surface">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-bg-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden shadow-glow-sm">
            <img src="/icon-192.png" alt="JNEET+" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm tracking-wide gradient-text">JNEET+</span>
        </div>
        {isDesktop ? (
          <button
            onClick={onTogglePin}
            className="text-gray-600 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover active:scale-90"
            title={pinned ? "Unpin sidebar (hover to open)" : "Pin sidebar open"}
            aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
            aria-pressed={pinned}
          >
            {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        ) : (
          <button
            onClick={onMobileClose}
            className="text-gray-600 hover:text-fg-primary transition p-1.5 rounded-lg hover:bg-bg-hover"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

          {/* ── New Chat button ─────────────────────────────── */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-violet-600
                hover:bg-violet-500 text-white text-xs font-semibold py-2.5 rounded-xl
                transition-all duration-150 shadow-glow-sm active:scale-[0.98]
                hover:-translate-y-0.5 hover:shadow-glow-violet"
            >
              <Plus size={13} />
              New Chat
            </button>
          </div>

          {/* ── Exam mode pill ──────────────────────────────── */}
          <div className="px-3 pb-2 shrink-0">
            <div className="bg-bg-panel border border-bg-border rounded-xl px-3 py-1.5
              flex items-center justify-between">
              <span className="text-[10px] text-gray-700 uppercase tracking-widest font-medium">
                Mode
              </span>
              <span className="text-[11px] font-bold bg-violet-600/70 border border-violet-600/40
                px-2.5 py-0.5 rounded-full text-white">
                {examMode === "NEET" ? "🩺 NEET" : "⚙️ JEE"}
              </span>
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────── */}
          <div className="relative flex mx-3 mb-2 bg-bg-panel rounded-xl p-1 gap-1 shrink-0">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-violet-600
                shadow-glow-sm transition-transform duration-300 ease-out"
              style={{
                transform: activeTab === "history" ? "translateX(2px)" : "translateX(calc(100% + 6px))",
              }}
            />
            {[
              { id: "history", label: "History" },
              { id: "saved",   label: `Saved ${savedItems.length > 0 ? `(${savedItems.length})` : ""}` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex-1 text-[11px] py-1.5 rounded-lg transition-colors
                  duration-200 font-medium
                  ${activeTab === tab.id ? "text-white" : "text-gray-600 hover:text-fg-primary"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Search ──────────────────────────────────────── */}
          <div className="px-3 pb-2 shrink-0">
            <div className="relative">
              {searching ? (
                <Loader2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" />
              ) : (
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              )}
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "history" ? "Search chats..." : "Search saved..."}
                className="w-full bg-bg-panel border border-bg-border rounded-xl pl-8 pr-7 py-1.5
                  text-[11px] text-fg-primary placeholder-gray-500 focus:outline-none
                  focus:border-violet-500/50 transition-all duration-150"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-fg-primary transition p-0.5"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* ── Tab content ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {activeTab === "history" ? (
              !isSessionsLoaded ? (
                <SidebarSkeletons />
              ) : searchQuery.trim() ? (
                searching && searchResultsForDisplay.length === 0 ? (
                  <SidebarSkeletons />
                ) : searchResultsForDisplay.length === 0 ? (
                  <p className="text-[11px] text-gray-700 text-center pt-10 px-4 leading-relaxed">
                    No chats found for "{searchQuery}".
                  </p>
                ) : (
                  searchResultsForDisplay
                    .filter((s) => s._id)
                    .map((s, i) => (
                      <SessionItem
                        key={s._id}
                        session={s}
                        index={i}
                        active={s._id?.toString() === activeSessionId?.toString()}
                        onSelect={handleSelectSession}
                        isEditing={editingSessionId === s._id}
                        onFinishRename={handleFinishRename}
                        onRequestMenu={(session, x, y) => setSessionMenu({ session, x, y })}
                      />
                    ))
                )
              ) : sessions.length === 0 ? (
                <p className="text-[11px] text-gray-700 text-center pt-10 px-4 leading-relaxed">
                  No chats yet.
                  <br />
                  Start with "New Chat"!
                </p>
              ) : (
                sessions
                  .filter((s) => s._id)
                  .map((s, i) => (
                    <SessionItem
                      key={s._id}
                      session={s}
                      index={i}
                      active={s._id?.toString() === activeSessionId?.toString()}
                      onSelect={handleSelectSession}
                      isEditing={editingSessionId === s._id}
                      onFinishRename={handleFinishRename}
                      onRequestMenu={(session, x, y) => setSessionMenu({ session, x, y })}
                    />
                  ))
              )
            ) : (
              savedItems.length === 0 ? (
                <div className="text-center pt-10 px-4">
                  <Bookmark size={22} className="text-gray-800 mx-auto mb-2" />
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    No saved concepts yet.
                    <br />
                    Click "Save" on any AI reply!
                  </p>
                </div>
              ) : filteredSaved.length === 0 ? (
                <p className="text-[11px] text-gray-700 text-center pt-10 px-4 leading-relaxed">
                  No saved items found for "{searchQuery}".
                </p>
              ) : (
                filteredSaved.map((item, i) => (
                  <SavedItem
                    key={item._id}
                    item={item}
                    index={i}
                    onOpen={handleOpenSaved}
                    onRemove={handleRemoveSaved}
                  />
                ))
              )
            )}
          </div>

          {/* ── Footer ─────────────────────────────────────── */}
          <div className="border-t border-bg-border p-2 shrink-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-2 text-gray-700 hover:text-fg-primary
                text-[11px] px-2 py-2 rounded-lg hover:bg-bg-hover transition"
            >
              <LayoutDashboard size={12} />
              Dashboard
            </button>
          </div>
    </div>
  );

  const railBtn = "w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-fg-primary hover:bg-bg-hover transition-all duration-150 active:scale-90";
  const rail = (
    <div className="w-14 h-full flex flex-col items-center py-3 gap-1.5 bg-bg-surface">
      <button onClick={() => setHovered(true)} className="w-9 h-9 rounded-lg overflow-hidden shadow-glow-sm mb-2 active:scale-90 transition-transform" title="Open sidebar" aria-label="Open sidebar">
        <img src="/icon-192.png" alt="JNEET+" className="w-full h-full object-cover" />
      </button>
      <button onClick={handleNewChat} className={`${railBtn} bg-violet-600 !text-white hover:!bg-violet-500 shadow-glow-sm`} title="New chat" aria-label="New chat"><Plus size={17} /></button>
      <button onClick={expandAndFocusSearch} className={railBtn} title="Search chats" aria-label="Search chats"><Search size={17} /></button>
      <button onClick={() => { setActiveTab("history"); setHovered(true); }} className={railBtn} title="Chat history" aria-label="Chat history"><Clock size={17} /></button>
      <button onClick={() => { setActiveTab("saved"); setHovered(true); }} className={`${railBtn} relative`} title="Saved" aria-label="Saved">
        <Bookmark size={17} />
        {savedItems.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />}
      </button>
      <div className="flex-1" />
      <button onClick={() => navigate("/dashboard")} className={railBtn} title="Dashboard" aria-label="Dashboard"><LayoutDashboard size={17} /></button>
    </div>
  );

  return (
    <>
      {isDesktop ? (
        /* Reserves the rail (or full) width in the layout; the panel itself floats above the chat. */
        <div
          className="relative shrink-0 h-full transition-[width] duration-300 ease-out"
          style={{ width: pinned ? 264 : 56 }}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onFocus={onFocusIn}
          onBlur={onBlurOut}
        >
          <aside
            aria-label="Chats"
            className={`absolute left-0 top-0 h-full z-30 overflow-hidden border-r border-bg-border bg-bg-surface
              transition-[width,box-shadow] duration-300 ease-out
              ${expanded ? "w-[264px]" : "w-14"}
              ${expanded && !pinned ? "shadow-[8px_0_40px_rgba(0,0,0,0.28)]" : ""}`}
          >
            {/* collapsed rail */}
            <div
              className={`absolute inset-y-0 left-0 transition-opacity duration-200 ${expanded ? "opacity-0 pointer-events-none" : "opacity-100 delay-100"}`}
              aria-hidden={expanded}
              inert={expanded ? "" : undefined}
            >
              {rail}
            </div>
            {/* full panel */}
            <div
              className={`absolute inset-y-0 left-0 transition-opacity duration-200 ${expanded ? "opacity-100 delay-75" : "opacity-0 pointer-events-none"}`}
              aria-hidden={!expanded}
              inert={!expanded ? "" : undefined}
            >
              {fullPanel}
            </div>
          </aside>
        </div>
      ) : (
        <>
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300
              ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside
            aria-label="Chats"
            inert={!mobileOpen ? "" : undefined}
            className={`fixed left-0 top-0 h-full w-[280px] max-w-[86vw] z-30 overflow-hidden border-r border-bg-border bg-bg-surface
              transition-transform duration-300 ease-out shadow-2xl
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            {fullPanel}
          </aside>
        </>
      )}

      {sessionMenu && (
        <ContextMenu
          x={sessionMenu.x}
          y={sessionMenu.y}
          items={menuItems}
          onClose={() => setSessionMenu(null)}
        />
      )}
    </>
  );
}
