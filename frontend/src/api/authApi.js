// ============================================================
//  JNEET+ AI — api/authApi.js  (v4)
//  ADDED: requestLoginCode / verifyLoginCode (passwordless "email me a
//  code" login) and the parent-consent endpoints.
// ============================================================

import api from "./axiosInstance.js";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  logout:   ()     => api.post("/auth/logout"),
  getMe:    ()     => api.get("/auth/me", { timeout: 8000 }),
  updateTargetExam: (data) => api.patch("/auth/me/target-exam", data),

  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword:  (data) => api.post("/auth/reset-password", data),

  verifyEmail:        (data) => api.post("/auth/verify-email", data),
  resendVerification: (data) => api.post("/auth/resend-verification", data),

  requestLoginCode: (data) => api.post("/auth/login-code", data),
  verifyLoginCode:  (data) => api.post("/auth/login-code/verify", data),
};

export const consentApi = {
  // student side
  status:       ()     => api.get("/consent/status"),
  resend:       ()     => api.post("/consent/resend"),
  changeParent: (data) => api.patch("/consent/parent-email", data),
  // parent side (public, token in the e-mailed link)
  describeApprove: (token)       => api.get(`/consent/parent/${encodeURIComponent(token)}`),
  approve:         (token, data) => api.post(`/consent/parent/${encodeURIComponent(token)}/approve`, data),
  describeRevoke:  (token)       => api.get(`/consent/parent/revoke/${encodeURIComponent(token)}`),
  revoke:          (token, data) => api.post(`/consent/parent/revoke/${encodeURIComponent(token)}`, data),
};
