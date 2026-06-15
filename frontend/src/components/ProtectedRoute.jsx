// ============================================================
//  JNEET+ AI — components/ProtectedRoute.jsx
//  Waits for auth initialization before redirecting.
//  Prevents flash of login screen on cookie-based session restore.
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext.jsx";
import { Spinner }  from "./ui/Spinner.jsx";
import { Sparkles } from "lucide-react";

export function ProtectedRoute({ children }) {
  const { isLoggedIn, isInitializing } = useAuth();

  // While restoring session from /me, show a neutral loading screen
  // — not a redirect, which would cause a flicker on page reload
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center
          justify-center shadow-glow-violet">
          <Sparkles size={18} className="text-white" />
        </div>
        <Spinner size={20} />
        <p className="text-xs text-gray-700 animate-pulse-soft">Loading your session...</p>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}