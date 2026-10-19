// ============================================================
//  JNEET+ AI — api/aiApi.js  (v3)
//  SSE streaming for /api/ai/ask.
//  - onError(message, info): info = { code, status, limit, resetsAt, plan }
//    so the UI can show a proper "daily limit reached" / "ask your parent
//    to approve" state instead of a generic error.
//  - onDone(fullText, usage, policy): usage = { remaining, limit, resetsAt } | null;
//    policy = { level, strikes, pausedUntil } | null (set when the message broke the 18+ policy)
// ============================================================

import api from "./axiosInstance.js";

export const aiApi = {
  ping:  () => api.get("/ai/ping"),
  usage: () => api.get("/ai/usage"),
  policy: () => api.get("/ai/policy"),
};

export function streamAsk(prompt, sessionId, { onToken, onDone, onError }, { replaceFromMessageId = null } = {}) {
  const controller = new AbortController();

  const baseURL = import.meta.env.DEV
    ? "/api"
    : (import.meta.env.VITE_API_BASE_URL || "/api");

  (async () => {
    try {
      const response = await fetch(`${baseURL}/ai/ask`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ prompt, ...(sessionId && { sessionId }), ...(sessionId && replaceFromMessageId && { replaceFromMessageId }) }),
        signal:      controller.signal,
      });

      if (!response.ok) {
        let data = {};
        try { data = await response.json(); } catch { /* non-JSON error body */ }
        onError?.(data.error || "Something went wrong. Please try again.", {
          status: response.status,
          code: data.code ?? null,
          limit: data.limit ?? null,
          resetsAt: data.resetsAt ?? null,
          plan: data.plan ?? null,
          resumesAt: data.resumesAt ?? null,
        });
        return;
      }

      const reader   = response.body.getReader();
      const decoder  = new TextDecoder();
      let   buffer   = "";
      let   fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          if (!evt.startsWith("data: ")) continue; // heartbeat comments start with ":"
          const jsonStr = evt.slice(6).trim();
          if (!jsonStr) continue;

          let data;
          try { data = JSON.parse(jsonStr); } catch { continue; }

          if (data.error) {
            onError?.(data.error, { status: 200, code: data.code ?? null });
            return;
          }
          if (data.token) {
            fullText += data.token;
            onToken?.(data.token, fullText);
          }
          if (data.done) {
            onDone?.(data.fullText ?? fullText, data.usage ?? null, data.policy ?? null);
            return;
          }
        }
      }

      if (fullText) onDone?.(fullText, null);
      else onError?.("The connection closed before an answer arrived. Please try again.", { code: "STREAM_CLOSED" });

    } catch (err) {
      if (err.name === "AbortError") return;
      onError?.("Connection lost. Check your internet and try again.", { code: "NETWORK" });
    }
  })();

  return controller;
}
