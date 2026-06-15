// ============================================================
//  JNEET+ AI — api/chatApi.js
//  Matches backend v2 routes:
//    GET    /api/chat/sessions
//    GET    /api/chat/session/:id
//    POST   /api/chat/session/new
//    DELETE /api/chat/session/:id
//    POST   /api/chat/message/save
//    PATCH  /api/chat/message/save-toggle   (renamed from /bookmark)
//    GET    /api/chat/saved                 (renamed from /bookmarks)
// ============================================================

import api from "./axiosInstance.js";

export const chatApi = {
  getSessions:    ()         => api.get("/chat/sessions"),
  getSession:     (id)       => api.get(`/chat/session/${id}`),
  newSession:     ()         => api.post("/chat/session/new"),
  deleteSession:  (id)       => api.delete(`/chat/session/${id}`),
  saveMessage:    (data)     => api.post("/chat/message/save", data),
  toggleSaved:    (data)     => api.patch("/chat/message/save-toggle", data),
  getSaved:       ()         => api.get("/chat/saved"),
};