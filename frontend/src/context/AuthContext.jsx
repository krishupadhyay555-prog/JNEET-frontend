// ============================================================
//  JNEET+ AI — context/AuthContext.jsx  (v2 — updateLanguage removed)
//  REMOVED: updateLanguage(). It called userApi.updateLanguage(),
//  which pointed at a backend route that never existed in
//  authRoutes.js — this function would have 404'd if it had ever
//  been triggered. Now that the Language section in Settings.jsx
//  (its only caller) is gone too, there's no reason to keep it
//  around as dead code.
//  Everything else — login/logout/refreshUser/updateTargetExam/
//  updateProfile/changePassword/deleteAccount, the auth-epoch
//  guard against stale async responses, the unauthorized-event
//  listener — is UNCHANGED.
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
import { userApi } from "../api/userApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,           setUser]           = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const authEpochRef = useRef(0);

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

  const login = useCallback((userData) => {
    authEpochRef.current += 1;
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // If the server is unreachable we still clear local state
    }
    authEpochRef.current += 1;
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.student);
    } catch {
      // silently ignore
    }
  }, []);

  const updateTargetExam = useCallback(async (targetExam, targetExamPromptDismissed = true) => {
    const res = await authApi.updateTargetExam({ targetExam, targetExamPromptDismissed });
    setUser(res.data.student);
    return res.data.student;
  }, []);

  // ── Profile — update name ──────────────────────────────────
  const updateProfile = useCallback(async (data) => {
    const res = await userApi.updateProfile(data);
    setUser(res.data.student);
    return res.data.student;
  }, []);

  // ── Change password (no user-state change needed) ─────────
  const changePassword = useCallback(async (data) => {
    await userApi.changePassword(data);
  }, []);

  // ── Delete (deactivate) own account ────────────────────────
  const deleteAccount = useCallback(async (password) => {
    await userApi.deleteAccount({ password });
    authEpochRef.current += 1;
    setUser(null);
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
        updateProfile,
        changePassword,
        deleteAccount,
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