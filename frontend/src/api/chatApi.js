// ============================================================
//  JNEET+ AI — api/chatApi.js  (v2.2 — search added)
//  Matches backend v2.2 routes:
//    GET    /api/chat/sessions
//    GET    /api/chat/search?q=...            (NEW)
//    GET    /api/chat/session/:id
//    POST   /api/chat/session/new
//    PATCH  /api/chat/session/:id/activate
//    DELETE /api/chat/session/:id
//    POST   /api/chat/message/save
//    PATCH  /api/chat/message/save-toggle
//    GET    /api/chat/saved
// ============================================================
import api from "./axiosInstance.js";
export const chatApi = {
  getSessions:     ()     => api.get("/chat/sessions"),
  searchChats:     (q)    => api.get("/chat/search", { params: { q } }),
  getSession:      (id)   => api.get(`/chat/session/${id}`),
  newSession:      ()     => api.post("/chat/session/new"),
  activateSession: (id)   => api.patch(`/chat/session/${id}/activate`),
  deleteSession:   (id)   => api.delete(`/chat/session/${id}`),
  saveMessage:     (data) => api.post("/chat/message/save", data),
  toggleSaved:     (data) => api.patch("/chat/message/save-toggle", data),
  getSaved:        ()     => api.get("/chat/saved"),
};