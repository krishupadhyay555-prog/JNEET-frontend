// ============================================================
//  JNEET+ AI — api/learnApi.js
//  OneShot chapter pages and the "Last time you studied" recap.
// ============================================================

import api from "./axiosInstance.js";

export const oneshotApi = {
  list: ()           => api.get("/oneshot"),
  // lang: "english" | "hinglish" | undefined (= the saved study language)
  get:  (slug, lang) => api.get(`/oneshot/${encodeURIComponent(slug)}`, { params: lang ? { lang } : {} }),
};

export const recapApi = {
  get:   ()                     => api.get("/recap"),
  start: (sessionId, count = 5) => api.post("/recap/start", { sessionId, count }),
};
