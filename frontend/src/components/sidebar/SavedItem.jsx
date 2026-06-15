// ============================================================
//  JNEET+ AI — components/sidebar/SavedItem.jsx
// ============================================================

import { memo } from "react";
import { Trash2 } from "lucide-react";

export const SavedItem = memo(function SavedItem({ item, onRemove }) {
  return (
    <div className="bg-bg-panel border border-bg-border rounded-xl p-2.5 mb-1.5 group
      hover:border-violet-600/20 transition duration-150">
      <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
        {item.content?.slice(0, 160)}
        {item.content?.length > 160 ? "…" : ""}
      </p>

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-gray-700 truncate max-w-[120px]">
          {item.sessionTitle || "Chat"}
        </span>
        <button
          onClick={() => onRemove(item)}
          className="opacity-0 group-hover:opacity-100 text-gray-700
            hover:text-red-400 transition-all duration-150 p-0.5"
          title="Remove from saved"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
});