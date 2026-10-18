// ============================================================
//  JNEET+ AI — App.jsx  (v9 — Forgot Password route added)
//  ADDED: import for ForgotPassword.jsx + its public route
//  "/forgot-password", placed alongside /login and /register since
//  it's a public, pre-login page.
//  Everything else — RootRedirect, staleness timeout, AccentSync,
//  all other routes — UNCHANGED from v8.
// ============================================================

import { lazy, Suspense, useEffect } from "react";
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
import Notes                from "./pages/Notes.jsx";
import NotFound             from "./pages/NotFound.jsx";
import { LoadingScreen }    from "./components/ui/LoadingScreen.jsx";


// Heavy / rarely-first pages load on demand so the first screen is fast on a
// weak network. Notes and Dashboard stay in the main bundle on purpose: they are
// what must open offline. After a new deploy an old tab can ask for a chunk that
// no longer exists — reload once to pick up the new version instead of crashing.
function lazyPage(factory) {
  return lazy(() => factory().catch((err) => {
    const key = "jneet_chunk_reload";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      window.location.reload();
      return new Promise(() => {});
    }
    sessionStorage.removeItem(key);
    throw err;
  }));
}
const AskAI           = lazyPage(() => import("./pages/AskAI.jsx"));
const Profile         = lazyPage(() => import("./pages/Profile.jsx"));
const Settings        = lazyPage(() => import("./pages/Settings.jsx"));
const WMS             = lazyPage(() => import("./pages/WMS.jsx"));
const Analytics       = lazyPage(() => import("./pages/Analytics.jsx"));
const Tests           = lazyPage(() => import("./pages/Tests.jsx"));
const TestAttempt     = lazyPage(() => import("./pages/TestAttempt.jsx"));
const TestResult      = lazyPage(() => import("./pages/TestResult.jsx"));
const Revision        = lazyPage(() => import("./pages/Revision.jsx"));
const RevisionSession = lazyPage(() => import("./pages/RevisionSession.jsx"));
const Legal           = lazyPage(() => import("./pages/Legal.jsx"));
const ParentConsent   = lazyPage(() => import("./pages/ParentConsent.jsx"));
const Landing         = lazyPage(() => import("./pages/Landing.jsx"));

// Soft page-to-page transition (keyed on the path so every navigation animates).
function PageTransition({ children }) {
  const { pathname } = useLocation();
  return <div key={pathname} className="page-enter">{children}</div>;
}

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

// "/" → public landing page for visitors, the app for signed-in students
function Home() {
  const { isLoggedIn, isInitializing } = useAuth();
  if (isInitializing) return <LoadingScreen />;
  return isLoggedIn ? <RootRedirect /> : <Landing />;
}

// Chat state belongs to ONE student in ONE exam. Keying the provider on both
// throws the old state away on logout/login (shared devices!) and on a
// NEET <-> JEE switch, so one account's chats can never show up in another.
function ChatScope({ children }) {
  const { user, examMode } = useAuth();
  return <ChatProvider key={`${user?._id ?? "anon"}:${examMode}`}>{children}</ChatProvider>;
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
        <>
          <AccentSync />
          <Toaster position="top-right" toastOptions={TOAST_CONFIG} />
          <BrowserRouter>
            <ChatScope>
            <RouteTracker />
            <PageTransition>
            <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login"           element={<Login />}          />
              <Route path="/register"        element={<Register />}       />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy"         element={<Legal doc="privacy" />} />
              <Route path="/terms"           element={<Legal doc="terms" />}   />
              <Route path="/refund"          element={<Legal doc="refund" />}  />
              <Route path="/parent-consent/revoke/:token" element={<ParentConsent revoke />} />
              <Route path="/parent-consent/:token"        element={<ParentConsent />} />

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

              <Route path="/"  element={<Home />} />
              <Route path="*"  element={<NotFound />} />
            </Routes>
            </Suspense>
            </PageTransition>
            </ChatScope>
          </BrowserRouter>
        </>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}