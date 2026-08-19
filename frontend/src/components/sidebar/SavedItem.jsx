// ============================================================
//  JNEET+ AI — components/sidebar/SavedItem.jsx  (Fix v2.2)
//  FIX (saved item doesn't open bug):
//    - This card previously had NO click handler at all — only
//      the trash/remove button worked. Clicking the card body did
//      nothing because opening a saved item's original chat was
//      never wired up.
//    - Added `onOpen` prop + onClick on the card. The remove
//      button now calls e.stopPropagation() so clicking Trash
//      doesn't also trigger "open" (they'd otherwise both fire
//      since Trash sits inside the clickable card).
//  Nothing else changed.
// ============================================================

import { memo } from "react";
import { Trash2 } from "lucide-react";

export const SavedItem = memo(function SavedItem({ item, onRemove, onOpen, index = 0 }) {
  const handleRemoveClick = (e) => {
    e.stopPropagation(); // prevent the card's onOpen from also firing
    onRemove(item);
  };

  return (
    <div
      onClick={() => onOpen?.(item)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms`, animationFillMode: "backwards" }}
      className="animate-fade-up bg-bg-panel border border-bg-border rounded-xl p-2.5 mb-1.5 group
        hover:border-violet-600/20 hover:-translate-y-0.5 transition-all duration-150
        cursor-pointer"
    >
      <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
        {item.content?.slice(0, 160)}
        {item.content?.length > 160 ? "…" : ""}
      </p>

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-gray-700 truncate max-w-[120px]">
          {item.sessionTitle || "Chat"}
        </span>
        <button
          onClick={handleRemoveClick}
          className="opacity-0 group-hover:opacity-100 text-gray-700
            hover:text-red-400 hover:scale-110 transition-all duration-150 p-0.5"
          title="Remove from saved"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
});