// ============================================================
//  JNEET+ AI — api/authApi.js  (v3 — Email Verification added)
//  ADDED: verifyEmail, resendVerification — matching new backend
//  routes POST /api/auth/verify-email and POST /api/auth/resend-verification.
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

  verifyEmail:        (data) => api.post("/auth/verify-email", data),
  resendVerification: (data) => api.post("/auth/resend-verification", data),
};