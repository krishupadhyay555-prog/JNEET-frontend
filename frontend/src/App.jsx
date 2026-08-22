// ============================================================
//  JNEET+ AI — App.jsx  (v7 — Analytics route added)
//  ADDED: /analytics (protected) → the new full Analytics page.
//  Everything else UNCHANGED from v6.
// ============================================================

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster }          from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ChatProvider }     from "./context/ChatContext.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import { ErrorBoundary }    from "./components/ui/ErrorBoundary.jsx";
import { ProtectedRoute }   from "./components/ProtectedRoute.jsx";
import Login                from "./pages/Login.jsx";
import Register             from "./pages/Register.jsx";
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

const LAST_PAGE_KEY = "jneet_last_page";
const VALID_LAST_PAGES = ["/dashboard", "/ask", "/profile", "/settings", "/wms", "/analytics", "/tests", "/revision", "/notes"];

function getLastPage() {
  try {
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
      } catch {
        // Non-critical — skip silently if storage isn't available.
      }
    }
  }, [location.pathname]);

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
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />

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

              <Route path="/"  element={<Navigate to={getLastPage()} replace />} />
              <Route path="*"  element={<Navigate to={getLastPage()} replace />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}