// ============================================================
//  JNEET+ AI — api/userApi.js  (v3)
//  ADDED: setDateOfBirth (existing students are asked once) and
//  updatePreferences (mentor / fun persona).
// ============================================================

import api from "./axiosInstance.js";

export const userApi = {
  updateProfile:     (data) => api.patch("/user/profile", data),
  changePassword:    (data) => api.patch("/user/password", data),
  deleteAccount:     (data) => api.delete("/user/account", { data }),
  setDateOfBirth:    (data) => api.patch("/user/date-of-birth", data),
  updatePreferences: (data) => api.patch("/user/preferences", data),
};
