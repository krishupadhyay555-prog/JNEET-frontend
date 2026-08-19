// ============================================================
//  JNEET+ AI — api/wmsApi.js  (v2 — read-only)
// ============================================================

import api from "./axiosInstance.js";

export const wmsApi = {
  getSummary: () => api.get("/wms/summary"),
};