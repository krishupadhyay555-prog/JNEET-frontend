// ============================================================
//  JNEET+ AI — components/ui/BackendErrorBanner.jsx
//  Shown when the backend is unreachable. Never loops — shows
//  a clear Retry button and the actual error message.
// ============================================================

import { WifiOff, RefreshCw } from "lucide-react";

export function BackendErrorBanner({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-5 px-6 py-12">
      <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl
        flex items-center justify-center">
        <WifiOff size={24} className="text-red-400" />
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-1">
          Server se connect nahi ho raha
        </h3>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          {message || "Backend unreachable. Make sure the server is running on port 5000."}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500
          text-white text-sm font-medium px-5 py-2.5 rounded-xl transition
          shadow-lg shadow-violet-900/30"
      >
        <RefreshCw size={14} />
        Retry Connection
      </button>

      <p className="text-[11px] text-gray-700">
        Tip: Run <code className="text-gray-600 font-mono bg-bg-card px-1 rounded">npm run dev</code> in the backend folder
      </p>
    </div>
  );
}