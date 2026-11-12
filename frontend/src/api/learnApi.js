// ============================================================
//  JNEET+ AI — api/learnApi.js
//  OneShot chapter pages and "Pichli baar ka recap".
// ============================================================

import api from "./axiosInstance.js";

export const oneshotApi = {
  list: ()     => api.get("/oneshot"),
  get:  (slug) => api.get(`/oneshot/${encodeURIComponent(slug)}`),
};

export const recapApi = {
  get:   ()                     => api.get("/recap"),
  start: (sessionId, count = 5) => api.post("/recap/start", { sessionId, count }),
};
