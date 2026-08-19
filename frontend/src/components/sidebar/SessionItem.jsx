// ============================================================
//  JNEET+ AI — components/sidebar/SessionItem.jsx  (Theme-polished)
//  Changed: active-state text-gray-200 → text-fg-primary (was
//  low-contrast on the light-violet-tinted active background in
//  light mode); hover:text-gray-300 → hover:text-fg-primary.
// ============================================================

import { memo } from "react";
import { MessageSquare, Trash2 } from "lucide-react";

export const SessionItem = memo(function SessionItem({
  session, active, onSelect, onDelete, index = 0,
}) {
  return (
    <div
      onClick={() => onSelect(session._id)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms`, animationFillMode: "backwards" }}
      className={`animate-fade-up group relative flex items-center gap-2 px-2.5 py-2 rounded-xl
        cursor-pointer transition-all duration-150 text-xs hover:translate-x-0.5
        ${active
          ? "bg-violet-600/15 border border-violet-600/25 text-fg-primary"
          : "text-gray-600 hover:bg-bg-hover hover:text-fg-primary border border-transparent"
        }`}
    >
      <MessageSquare size={11} className="shrink-0 mt-0.5 opacity-60" />

      <div className="flex-1 min-w-0">
        <p className="truncate leading-relaxed font-medium">{session.title}</p>
        {session.lastMessage && (
          <p className="truncate text-[10px] text-gray-700 mt-0.5 font-normal">
            {session.lastMessage}
          </p>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(session._id); }}
        className="opacity-0 group-hover:opacity-100 text-gray-700
          hover:text-red-400 hover:scale-110 transition-all duration-150 shrink-0 p-0.5"
        title="Delete session"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
});