// ============================================================
//  JNEET+ AI — api/notesApi.js  (NEW)
// ============================================================

import api from "./axiosInstance.js";

export const notesApi = {
  list:   (q)        => api.get("/notes", { params: q ? { q } : {} }),
  get:    (id)        => api.get(`/notes/${id}`),
  create: (data)       => api.post("/notes", data),
  update: (id, data)   => api.patch(`/notes/${id}`, data),
  remove: (id)         => api.delete(`/notes/${id}`),
};