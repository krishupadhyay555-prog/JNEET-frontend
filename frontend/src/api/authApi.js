// ============================================================
//  JNEET+ AI — api/authApi.js
//  Matches backend v2 routes:
//    POST /api/auth/register
//    POST /api/auth/login
//    POST /api/auth/logout
//    GET  /api/auth/me
// ============================================================

import api from "./axiosInstance.js";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  logout:   ()     => api.post("/auth/logout"),
  getMe:    ()     => api.get("/auth/me"),
  updateTargetExam: (data) => api.patch("/auth/me/target-exam", data),
};
