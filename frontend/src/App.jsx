// ============================================================
//  JNEET+ AI — App.jsx  (v9 — Forgot Password route added)
//  ADDED: import for ForgotPassword.jsx + its public route
//  "/forgot-password", placed alongside /login and /register since
//  it's a public, pre-login page.
//  Everything else — RootRedirect, staleness timeout, AccentSync,
//  all other routes — UNCHANGED from v8.
// ============================================================

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster }          from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ChatProvider }     from "./context/ChatContext.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import { ErrorBoundary }    from "./components/ui/ErrorBoundary.jsx";
import { ProtectedRoute }   from "./components/ProtectedRoute.jsx";
import Login                from "./pages/Login.jsx";
import Register             from "./pages/Register.jsx";
import ForgotPassword       from "./pages/ForgotPassword.jsx";
import Dashboard            from "./pages/Dashboard.jsx";
import AskAI                from "./pages/AskAI.jsx";
import Profile              from "./pages/Profile.jsx";
import Settings             from "./pages/Settings.jsx";
import WMS                  from "./pages/WMS.jsx";
import Analytics            from "./pages/Analytics.jsx";
import Tests                from "./pages/Tests.jsx";
import TestAttempt          from "./pages/TestAttempt.jsx";
import TestResult           from "./pages/TestResult.jsx";
import Revision             from "./pages/Revision.jsx";
import RevisionSession      from "./pages/RevisionSession.jsx";
import Notes                from "./pages/Notes.jsx";

const TOAST_CONFIG = {
  duration: 3000,
  style: {
    background:  "#141428",
    color:       "#e8e8f0",
    border:      "1px solid #1e1e38",
    fontSize:    "13px",
    fontFamily:  "'DM Sans', system-ui, sans-serif",
    borderRadius: "12px",
    padding:     "10px 14px",
  },
  success: {
    iconTheme: { primary: "#8248fe", secondary: "#fff" },
  },
  error: {
    style: { border: "1px solid rgba(239,68,68,0.4)" },
    iconTheme: { primary: "#ef4444", secondary: "#fff" },
  },
};

// ── Resume-last-page feature ────────────────────────────────
const LAST_PAGE_KEY = "jneet_last_page";
const LAST_ACTIVE_AT_KEY = "jneet_last_active_at";
const STALE_AFTER_MS = 8 * 60 * 60 * 1000; // 8 hours of inactivity
const VALID_LAST_PAGES = ["/dashboard", "/ask", "/profile", "/settings", "/wms", "/analytics", "/tests", "/revision", "/notes"];

function getLastPage() {
  try {
    const lastActiveAt = Number(localStorage.getItem(LAST_ACTIVE_AT_KEY) || 0);
    const isStale = !lastActiveAt || (Date.now() - lastActiveAt) > STALE_AFTER_MS;
    if (isStale) return "/dashboard";

    const saved = localStorage.getItem(LAST_PAGE_KEY);
    return VALID_LAST_PAGES.includes(saved) ? saved : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (VALID_LAST_PAGES.includes(location.pathname)) {
      try {
        localStorage.setItem(LAST_PAGE_KEY, location.pathname);
        localStorage.setItem(LAST_ACTIVE_AT_KEY, String(Date.now()));
      } catch {
        // Non-critical — skip silently if storage isn't available.
      }
    }
  }, [location.pathname]);

  return null;
}

// ── two-step redirect so Dashboard always gets its own
// history entry, and back-button behaves correctly. ────────────
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastPage = getLastPage();
    navigate("/dashboard", { replace: true });
    if (lastPage !== "/dashboard") {
      navigate(lastPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function AccentSync() {
  const { examMode }      = useAuth();
  const { accentOverride } = useTheme();

  useEffect(() => {
    let resolved;
    if (accentOverride === "normal") {
      resolved = "normal";
    } else if (examMode === "JEE") {
      resolved = "jee";
    } else {
      resolved = "neet";
    }
    document.documentElement.setAttribute("data-accent", resolved);
  }, [examMode, accentOverride]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary resetOnRetry>
      <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <AccentSync />
          <Toaster position="top-right" toastOptions={TOAST_CONFIG} />
          <BrowserRouter>
            <RouteTracker />
            <Routes>
              <Route path="/login"           element={<Login />}          />
              <Route path="/register"        element={<Register />}       />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/ask"       element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/wms"       element={<ProtectedRoute><WMS /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/tests"     element={<ProtectedRoute><Tests /></ProtectedRoute>} />
              <Route path="/revision"  element={<ProtectedRoute><Revision /></ProtectedRoute>} />
              <Route path="/notes"     element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route
                path="/test/attempt/:attemptId"
                element={<ProtectedRoute><TestAttempt /></ProtectedRoute>}
              />
              <Route
                path="/test/result/:attemptId"
                element={<ProtectedRoute><TestResult /></ProtectedRoute>}
              />
              <Route
                path="/revision/attempt/:attemptId"
                element={<ProtectedRoute><RevisionSession /></ProtectedRoute>}
              />

              <Route path="/"  element={<RootRedirect />} />
              <Route path="*"  element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}