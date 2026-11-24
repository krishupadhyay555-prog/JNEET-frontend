// ============================================================
//  JNEET+ AI — components/ui/BackendErrorBanner.jsx
//  Shown when the chat can't load (server waking up, network
//  blip, too many requests). Retries by itself once after a few
//  seconds and always offers a Retry button.
// ============================================================
import { useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function BackendErrorBanner({ message, onRetry }) {
  useEffect(() => {
    const t = setTimeout(() => onRetry?.(), 8000);
    return () => clearTimeout(t);
  }, [onRetry]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-5 px-6 py-12">
      <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
        <WifiOff size={24} className="text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-fg-primary mb-1">Couldn&apos;t load your chats</h3>
        <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
          {message || "Check your internet connection."} We&apos;ll try again in a few seconds.
        </p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition">
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}
