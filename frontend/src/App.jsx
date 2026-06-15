// ============================================================
//  JNEET+ AI — App.jsx  (Production v2.0)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster }          from "react-hot-toast";
import { AuthProvider }     from "./context/AuthContext.jsx";
import { ChatProvider }     from "./context/ChatContext.jsx";
import { ErrorBoundary }    from "./components/ui/ErrorBoundary.jsx";
import { ProtectedRoute }   from "./components/ProtectedRoute.jsx";
import Login                from "./pages/Login.jsx";
import Register             from "./pages/Register.jsx";
import Dashboard            from "./pages/Dashboard.jsx";
import AskAI                from "./pages/AskAI.jsx";

// Toast config — dark theme, no validation toasts (those are inline)
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

export default function App() {
  return (
    <ErrorBoundary resetOnRetry>
      <AuthProvider>
        <ChatProvider>
          <Toaster position="top-right" toastOptions={TOAST_CONFIG} />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ask"
                element={
                  <ProtectedRoute>
                    <AskAI />
                  </ProtectedRoute>
                }
              />

              {/* Redirects */}
              <Route path="/"  element={<Navigate to="/dashboard" replace />} />
              <Route path="*"  element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}