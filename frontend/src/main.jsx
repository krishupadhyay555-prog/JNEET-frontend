import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { detectAppShell } from "./utils/appShell.js";

detectAppShell(); // before the first render: hides every payment UI inside the Play Store app

// After a new deploy, an open tab may ask for an old page chunk that no
// longer exists ("Failed to fetch dynamically imported module"). Reload
// once to pick up the new version instead of showing an error screen.
window.addEventListener("vite:preloadError", (event) => {
  try {
    const last = Number(sessionStorage.getItem("jn_chunk_reload") || 0);
    if (Date.now() - last < 60_000) return; // already tried — let the error screen show
    sessionStorage.setItem("jn_chunk_reload", String(Date.now()));
  } catch { /* storage blocked: still reload once */ }
  event.preventDefault();
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Offline support: the service worker keeps the app shell available with no
// or a very weak network (production only, so dev hot-reload is unaffected).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => { /* unsupported / blocked: app still works online */ });
  });
}
