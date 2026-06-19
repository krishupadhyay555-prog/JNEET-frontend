// ============================================================
//  JNEET+ AI — context/AuthContext.jsx
//  Cookie-based auth. Zero localStorage. Zero next() calls.
//  Session restored on mount via /api/auth/me.
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authApi } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,           setUser]           = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const authEpochRef = useRef(0);

  // ── Restore session from httpOnly cookie on boot ─────────
  // Calls /api/auth/me. If the cookie is valid the backend returns
  // the user object. If not (expired / missing) it returns 401 and
  // we land in the catch block — user stays null, no crash.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const epoch = authEpochRef.current;
      try {
        const res = await authApi.getMe();
        if (!cancelled && epoch === authEpochRef.current) setUser(res.data.student);
      } catch {
        if (!cancelled && epoch === authEpochRef.current) setUser(null);
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── React to 401 events dispatched by axiosInstance ──────
  useEffect(() => {
    const handle = (event) => {
      const url = event.detail?.url ?? "";
      if (url.includes("/auth/me")) return;
      authEpochRef.current += 1;
      setUser(null);
    };
    window.addEventListener("jneet:unauthorized", handle);
    return () => window.removeEventListener("jneet:unauthorized", handle);
  }, []);

  // ── login: called by Register.jsx / Login.jsx after success ─
  // Accepts the `student` object returned by the backend.
  // The httpOnly cookie is already set by the browser at this point —
  // we only need to update React state.
  const login = useCallback((userData) => {
    authEpochRef.current += 1;
    setUser(userData);
  }, []);

  // ── logout: tells backend to clear the httpOnly cookie ───
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // If the server is unreachable we still clear local state
    }
    authEpochRef.current += 1;
    setUser(null);
  }, []);

  // ── refreshUser: re-sync from server (e.g. after profile edit) ─
  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.student);
    } catch {
      // silently ignore
    }
  }, []);

  const updateTargetExam = useCallback(async (targetExam, targetExamPromptDismissed = true) => {
    const res = await authApi.updateTargetExam({
      targetExam,
      targetExamPromptDismissed,
    });
    setUser(res.data.student);
    return res.data.student;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        isLoggedIn: !!user,
        examMode:   user?.examMode ?? "NEET",
        login,
        logout,
        refreshUser,
        updateTargetExam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
