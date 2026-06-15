// ============================================================
//  JNEET+ AI — components/sidebar/Sidebar.jsx
//  History + Saved tabs, collapsible on mobile.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, X, Plus, Bookmark, ArrowLeft, LayoutDashboard,
} from "lucide-react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:relative z-30 md:z-auto
          w-[264px] h-full flex flex-col
          bg-bg-surface border-r border-bg-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-bg-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center
              shadow-glow-sm">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide gradient-text">JNEET+</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-white transition p-1 rounded-lg
              hover:bg-bg-hover"
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
              transition shadow-glow-sm active:scale-[0.98]"
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

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="flex mx-3 mb-2 bg-bg-panel rounded-xl p-1 gap-1 shrink-0">
          {[
            { id: "history", label: "History" },
            { id: "saved",   label: `Saved ${savedItems.length > 0 ? `(${savedItems.length})` : ""}` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-[11px] py-1.5 rounded-lg transition font-medium
                ${activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-glow-sm"
                  : "text-gray-600 hover:text-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {activeTab === "history" ? (
            !isSessionsLoaded ? (
              <SidebarSkeletons />
            ) : sessions.length === 0 ? (
              <p className="text-[11px] text-gray-700 text-center pt-10 px-4 leading-relaxed">
                Koi chat nahi hai.
                <br />
                "New Chat" se shuru karo!
              </p>
            ) : (
              sessions.map((s) => (
                <SessionItem
                  key={s._id}
                  session={s}
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
                  Koi saved concept nahi.
                  <br />
                  AI reply pe "Save" click karo!
                </p>
              </div>
            ) : (
              savedItems.map((item) => (
                <SavedItem
                  key={item._id}
                  item={item}
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
            className="w-full flex items-center gap-2 text-gray-700 hover:text-gray-300
              text-[11px] px-2 py-2 rounded-lg hover:bg-bg-hover transition"
          >
            <LayoutDashboard size={12} />
            Dashboard
          </button>
        </div>
      </aside>
    </>
  );
}
