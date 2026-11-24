// ============================================================
//  JNEET+ AI — api/freeMockApi.js   (public Free Quick Mock)
//  The server keeps the guest attempt (httpOnly cookie); the answer
//  key never comes to the browser before signup.
// ============================================================
import api from "./axiosInstance.js";

export const freeMockApi = {
  start:  (data)        => api.post("/free-mock/start", data, { timeout: 30000 }),
  get:    (id)          => api.get(`/free-mock/${id}`, { timeout: 30000 }),
  submit: (id, answers) => api.post(`/free-mock/${id}/submit`, { answers }, { timeout: 30000 }),
  result: (id)          => api.get(`/free-mock/${id}/result`, { timeout: 30000 }),
  claim:  ()            => api.post("/free-mock/claim"),
};

// Local keys: the running sitting (resume after reload), a finished one
// waiting to be moved into a new account, and answers in progress.
export const FM_ACTIVE = "jn_fm_active";
export const FM_PENDING = "jn_fm_pending";
export const fmAnswersKey = (id) => `jn_fm_ans_${id}`;
export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

// Same format as utils/signupSource.js: first touch wins, 30 days.
export function rememberFreeMockSource() {
  try {
    const old = JSON.parse(localStorage.getItem("jn_src") || "null");
    if (old && Date.now() - old.at < 30 * 864e5) {
      // Keep the first-touch utm, but mark that the student came via the free mock.
      if (!old.v.src) { old.v.src = "free-mock"; localStorage.setItem("jn_src", JSON.stringify(old)); }
      return old.v;
    }
    const q = new URLSearchParams(window.location.search);
    const v = { src: "free-mock" };
    for (const f of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const x = (q.get(f) || "").trim().slice(0, 60);
      if (x && /^[\w.\-+ ]+$/.test(x)) v[f] = x;
    }
    localStorage.setItem("jn_src", JSON.stringify({ at: Date.now(), v }));
    return v;
  } catch { return { src: "free-mock" }; }
}
