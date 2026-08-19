// ============================================================
//  JNEET+ AI — api/userApi.js  (v2 — dead language endpoint removed)
//  REMOVED: updateLanguage — pointed at a backend route that was
//  already deleted (language feature removed entirely earlier).
//  Nothing calls this anymore; kept it around before only because
//  this file hadn't been touched yet.
//  Everything else UNCHANGED.
// ============================================================

import api from "./axiosInstance.js";

export const userApi = {
  updateProfile:  (data) => api.patch("/user/profile", data),
  changePassword: (data) => api.patch("/user/password", data),
  deleteAccount:  (data) => api.delete("/user/account", { data }),
};