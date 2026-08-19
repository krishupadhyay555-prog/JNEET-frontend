// ============================================================
//  JNEET+ AI — api/testApi.js  (v2 — startFull added)
// ============================================================

import api from "./axiosInstance.js";

export const testApi = {
  getChapters: (subject) => api.get("/test/chapters", { params: subject ? { subject } : {} }),
  start:       (data)    => api.post("/test/start", data),
  startFull:   ()        => api.post("/test/start-full"),
  submit:      (attemptId, data) => api.post(`/test/${attemptId}/submit`, data),
  getAttempt:  (attemptId) => api.get(`/test/${attemptId}`),
  getHistory:  () => api.get("/test/history"),
};