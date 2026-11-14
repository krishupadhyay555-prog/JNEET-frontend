// ============================================================
//  JNEET+ AI — api/paymentApi.js  (B4, web only)
// ============================================================

import api from "./axiosInstance.js";

const t = (token) => encodeURIComponent(token);

export const paymentApi = {
  plans:      ()              => api.get("/payments/plans"),
  mine:       ()              => api.get("/payments/me"),
  order:      (planId)        => api.post("/payments/order", { planId }),
  verify:     (data)          => api.post("/payments/verify", data),
  parentLink: ()              => api.post("/payments/parent-link"),
  // parent side (public, token in the shared link)
  parentInfo:   (token)         => api.get(`/payments/parent/${t(token)}`),
  parentOrder:  (token, planId) => api.post(`/payments/parent/${t(token)}/order`, { planId, isParent: true }),
  parentVerify: (token, data)   => api.post(`/payments/parent/${t(token)}/verify`, data),
};
