// ============================================================
//  JNEET+ AI — api/authApi.js  (v2 — Forgot Password added)
//  ADDED: forgotPassword, resetPassword — matching new backend
//  routes POST /api/auth/forgot-password and POST /api/auth/reset-password.
//  Everything else UNCHANGED.
// ============================================================

import api from "./axiosInstance.js";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  logout:   ()     => api.post("/auth/logout"),
  getMe:    ()     => api.get("/auth/me"),
  updateTargetExam: (data) => api.patch("/auth/me/target-exam", data),

  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword:  (data) => api.post("/auth/reset-password", data),
};