// ============================================================
//  JNEET+ AI — components/sidebar/Sidebar.jsx  (v5 — real logo)
//  CHANGED: Sparkles icon in the header badge replaced with the
//  app's own JN logo image (icon-192.png) — Sparkles looked like
//  Gemini's icon, this is the actual brand mark.
//  Everything else (search, tabs, history/saved logic, collapse
//  animation) UNCHANGED from v4.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Plus, Bookmark, LayoutDashboard, Search, Loader2,
} from "lucide-react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { chatApi } from "../../api/chatApi.js";
import { SessionItem }     from "./SessionItem.jsx";
import { SavedItem }       from "./SavedItem.jsx";
import { SidebarSkeletons } from "../ui/SkeletonLoader.jsx";

export function Sidebar({ isOpen, onClose }) {
  const navigate                  = useNavigate();
  const { examMode }              = useAuth();
  const {
    sessions, savedItems,
    activeSessionId, isSessionsLoaded,
    selectSession, newSession,
    deleteSession, toggleSaved,
  } = useChat();

  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

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

  const handleNewChat = async () => {
    await newSession();
    onClose?.();
  };

  const handleSelectSession = async (id) => {
    await selectSession(id);
    onClose?.();
  };

  const handleRemoveSaved = (item) => {
    toggleSaved({ ...item, saved: true });
  };

  const handleOpenSaved = async (item) => {
    if (!item.sessionId) return;
    await selectSession(item.sessionId);
    onClose?.();
  };

  const searchResultsForDisplay = (searchResults ?? []).map((r) => ({
    _id:         r._id,
    title:       r.title,
    lastMessage: r.snippet,
    createdAt:   r.createdAt,
  }));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative z-30 md:z-auto
          h-full shrink-0 overflow-hidden
          transition-all duration-300 ease-in-out
          w-[264px]
          ${isOpen
            ? "translate-x-0 md:w-[264px]"
            : "-translate-x-full md:translate-x-0 md:w-0"
          }
        `}
      >
        <div className="w-[264px] h-full flex flex-col bg-bg-surface border-r border-bg-border">

          {/* ── Header ─────────────────────────────────────── */}
          <div className="flex items-center justify-between px-3 py-4 border-b border-bg-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden shadow-glow-sm">
                <img
                  src="/icon-192.png"
                  alt="JNEET+"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-sm tracking-wide gradient-text">JNEET+</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-fg-primary transition p-1 rounded-lg
                hover:bg-bg-hover"
              title="Close sidebar"
            >
              <X size={15} />
            </button>
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

          {/* ── Tabs — sliding highlight, not a hard swap ──── */}
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

          {/* ── Search ──────────────────────────────── */}
          <div className="px-3 pb-2 shrink-0">
            <div className="relative">
              {searching ? (
                <Loader2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" />
              ) : (
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              )}
              <input
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
                        onDelete={deleteSession}
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
                      onDelete={deleteSession}
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
      </aside>
    </>
  );
}