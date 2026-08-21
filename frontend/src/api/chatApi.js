// ============================================================
//  JNEET+ AI — api/chatApi.js  (v3 — rename + pin added)
// ============================================================
import api from "./axiosInstance.js";
export const chatApi = {
  getSessions:     ()     => api.get("/chat/sessions"),
  searchChats:     (q)    => api.get("/chat/search", { params: { q } }),
  getSession:      (id)   => api.get(`/chat/session/${id}`),
  newSession:      ()     => api.post("/chat/session/new"),
  activateSession: (id)   => api.patch(`/chat/session/${id}/activate`),
  renameSession:   (id, title) => api.patch(`/chat/session/${id}/rename`, { title }),
  togglePin:       (id)   => api.patch(`/chat/session/${id}/pin`),
  deleteSession:   (id)   => api.delete(`/chat/session/${id}`),
  saveMessage:     (data) => api.post("/chat/message/save", data),
  toggleSaved:     (data) => api.patch("/chat/message/save-toggle", data),
  getSaved:        ()     => api.get("/chat/saved"),
};