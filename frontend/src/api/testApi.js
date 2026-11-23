// ============================================================
//  JNEET+ AI — api/testApi.js  (v3 — answerQuestion added)
// ============================================================

import api from "./axiosInstance.js";

export const testApi = {
  getChapters:    (subject) => api.get("/test/chapters", { params: subject ? { subject } : {} }),
  start:          (data)    => api.post("/test/start", data),
  startFull:      ()        => api.post("/test/start-full"),
  answerQuestion: (attemptId, data) => api.post(`/test/${attemptId}/answer`, data),
  submit:         (attemptId, data) => api.post(`/test/${attemptId}/submit`, data),
  getAttempt:     (attemptId) => api.get(`/test/${attemptId}`),
  getHistory:     () => api.get("/test/history"),
};
// Weekly All-India Mock (backend/services/allIndiaMock.js)
export const allIndiaApi = {
  get:         ()       => api.get("/all-india"),
  start:       (mockId) => api.post(`/all-india/${mockId}/start`),
  leaderboard: (mockId) => api.get(`/all-india/${mockId}/leaderboard`),
};

export const reportApi = {
  report:      (data) => api.post("/test/report", data),
  list:        (status = "open") => api.get("/admin/reports", { params: { status } }),
  setStatus:   (questionId, status) => api.patch(`/admin/reports/${questionId}`, { status }),
};

export const supportAdminApi = {
  list:      (status = "open") => api.get("/admin/support", { params: { status } }),
  setStatus: (id, status) => api.patch(`/admin/support/${id}`, { status }),
};

export const mistakesApi = {
  summary: ()                => api.get("/mistakes/summary"),
  list:    (params)          => api.get("/mistakes", { params }),
  answer:  (id, data)        => api.post(`/mistakes/${id}/answer`, data),
  master:  (id)              => api.post(`/mistakes/${id}/master`),
};

export const learnApi = {
  explainPyq: (questionId)   => api.post("/pyq-explain", { questionId: String(questionId) }),
  analysis:   (attemptId)    => api.get(`/test/${attemptId}/analysis`),
};
