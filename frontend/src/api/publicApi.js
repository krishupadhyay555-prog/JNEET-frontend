import api from "./axiosInstance.js";

export const publicApi = {
  stats:   () => api.get("/public/stats"),
  contact: (data) => api.post("/support/contact", data),
};
