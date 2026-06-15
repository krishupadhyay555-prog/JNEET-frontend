// ============================================================
//  JNEET+ AI — api/aiApi.js
//  SSE streaming for /api/ai/ask
//  Matches backend v2 SSE route.
// ============================================================

import api from "./axiosInstance.js";

export const aiApi = {
  ping: () => api.get("/ai/ping"),
};

export function streamAsk(prompt, sessionId, { onToken, onDone, onError }) {
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

        // ✅ SIRF YE LINE CHANGE KI HAI
        body: JSON.stringify({ prompt, ...(sessionId && { sessionId }) }),

        signal:      controller.signal,
      });

      if (!response.ok) {
        let errMsg = `Server error: ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch { }
        onError?.(errMsg);
        return;
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);

            if (data.error) {
              onError?.(data.error);
              return;
            }

            if (data.token) {
              fullText += data.token;
              onToken?.(data.token, fullText);
            }

            if (data.done) {
              onDone?.(data.fullText ?? fullText);
              return;
            }
          } catch { }
        }
      }

      if (fullText) onDone?.(fullText);

    } catch (err) {
      if (err.name === "AbortError") return;
      onError?.(err.message || "Connection lost");
    }
  })();

  return controller;
}