// ============================================================
//  JNEET+ AI — components/ProtectedRoute.jsx  (v2)
//  CHANGED: the inline Sparkles-icon loading block replaced with
//  the new <LoadingScreen /> component — same purpose (shown
//  while /me is restoring the session, prevents a login-screen
//  flash on page reload), but branded with the real JN logo and
//  a small rotating caption instead of a generic sparkle+spinner.
//  Everything else (auth-check logic, redirect behavior) is
//  UNCHANGED.
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext.jsx";
import { LoadingScreen } from "./ui/LoadingScreen.jsx";

export function ProtectedRoute({ children }) {
  const { isLoggedIn, isInitializing } = useAuth();

  // While restoring session from /me, show a neutral loading screen
  // — not a redirect, which would cause a flicker on page reload
  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}