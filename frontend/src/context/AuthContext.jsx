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
import { bindOfflineUser, clearOfflineData } from "../api/notesApi.js";

// The signed-in student is remembered on this device so the app (and the
// offline notes) still open with no network. It is cleared on logout and
// whenever the server says the session is no longer valid.
const CACHE_KEY = "jneet.student.v1";
const readCached = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; } };
const writeCached = (u) => { try { u ? localStorage.setItem(CACHE_KEY, JSON.stringify(u)) : localStorage.removeItem(CACHE_KEY); } catch { /* storage blocked */ } };

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
      } catch (err) {
        if (!cancelled && epoch === authEpochRef.current) {
          // No network / server asleep (not an auth failure): stay signed in
          // from the remembered student so notes etc. still open.
          const unreachable = !err.response || err.response.status >= 502;
          const cached = unreachable ? readCached() : null;
          setUser(cached);
          if (!unreachable) writeCached(null);
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the device copy in sync and bind the offline notes cache to this student.
  useEffect(() => {
    if (!user) return;               // clearing happens explicitly on logout / invalid session
    writeCached(user);
    if (user._id || user.id) bindOfflineUser(user._id || user.id);
  }, [user]);

  useEffect(() => {
    const handle = (event) => {
      const url = event.detail?.url ?? "";
      if (url.includes("/auth/me")) return;
      authEpochRef.current += 1;
      setUser(null);
      writeCached(null);
      clearOfflineData();
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
    writeCached(null);
    clearOfflineData();
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

  // Switch between NEET and JEE (each keeps its own chats, tests and progress).
  const switchExamMode = useCallback(async (examMode) => {
    const res = await userApi.updateExamMode(examMode);
    setUser(res.data.student);
    return res.data.student;
  }, []);

  // Replace the cached student with a fresh payload returned by an endpoint
  const setStudent = useCallback((student) => {
    if (student) setUser(student);
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
    writeCached(null);
    clearOfflineData();
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
        setStudent,
        updateTargetExam,
        switchExamMode,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}