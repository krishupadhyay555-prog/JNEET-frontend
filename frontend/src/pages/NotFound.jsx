// ============================================================
//  JNEET+ AI — pages/NotFound.jsx
//  Real 404 instead of silently redirecting every unknown URL.
// ============================================================

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthShell } from "../components/auth/AuthShell.jsx";

export default function NotFound() {
  const { isLoggedIn } = useAuth();
  return (
    <AuthShell title="Page not found" subtitle="404">
      <p className="text-sm text-[#6B6572] text-center leading-relaxed mb-5">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to={isLoggedIn ? "/dashboard" : "/login"}
        className="block w-full text-center bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8] text-white font-semibold py-2.5 rounded-xl text-sm"
      >
        {isLoggedIn ? "Go to dashboard" : "Go to login"}
      </Link>
    </AuthShell>
  );
}
