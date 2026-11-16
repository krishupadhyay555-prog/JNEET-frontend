// ============================================================
//  JNEET+ AI — api/pyqApi.js
//  Previous-year question papers (official NTA papers, answers checked
//  against NTA's final answer keys).
// ============================================================

import api from "./axiosInstance.js";

export const pyqApi = {
  list:     ()                   => api.get("/pyq"),
  chapters: ()                   => api.get("/pyq/chapters"),
  chapter:  (subject, chapter)   => api.get("/pyq/chapter", { params: { subject, chapter } }),
  paper:    (id)                 => api.get(`/pyq/${encodeURIComponent(id)}`),
};
