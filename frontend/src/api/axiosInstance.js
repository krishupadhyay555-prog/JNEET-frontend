// ============================================================
//  JNEET+ AI — api/axiosInstance.js  (Production v2.0)
//  KEY CHANGES:
//    - withCredentials: true  → sends httpOnly cookies on every request
//    - NO localStorage token read/write — backend manages auth via cookies
//    - Vite proxy handles /api → http://localhost:5000 in development
//    - Graceful 401 handling: fires custom event instead of hard redirect
// ============================================================

import axios from "axios";

// In development, Vite proxy routes /api → http://localhost:5000
// In production, set VITE_API_BASE_URL to your backend origin
const baseURL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL || "/api");

const api = axios.create({
  baseURL,
  timeout: 90000,  // 90s — generous for SSE-adjacent calls
  withCredentials: true,  // MANDATORY: sends httpOnly cookie jneet_token
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Tag network/timeout errors for consumer components
    if (!error.response) {
      error.isTimeout      = error.code === "ECONNABORTED";
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 401: session expired or invalid cookie — dispatch event so
    // AuthContext can react without a hard import cycle
    if (status === 401) {
      window.dispatchEvent(new CustomEvent("jneet:unauthorized", {
        detail: { url: error.config?.url ?? "" },
      }));
    }

    return Promise.reject(error);
  }
);

export default api;
