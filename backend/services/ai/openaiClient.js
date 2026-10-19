// ============================================================
//  JNEET+ AI — services/ai/openaiClient.js
//  Minimal, dependency-free client for the OpenAI Responses API
//  (POST /v1/responses) — streaming and non-streaming.
//
//  Why hand-rolled: no SDK version churn, easy to unit-test with a
//  mocked fetch, and we only need ~3 event types.
//
//  Streaming events used:
//    response.output_text.delta   -> text chunk
//    response.completed           -> final usage
//    response.incomplete          -> hit max_output_tokens (still has text)
//    response.failed / error      -> failure
//
//  Defensive behaviour:
//    - Optional request fields (reasoning, safety_identifier) are
//      stripped and the request retried once if the API rejects them
//      with HTTP 400 — so a model that doesn't support `reasoning`
//      degrades to a normal call instead of failing.
//    - connect timeout and idle (between-chunk) timeout.
//    - the caller's AbortSignal cancels the upstream request, so a
//      student closing the tab stops the spend.
// ============================================================

import crypto from "crypto";
import { env } from "../../config/env.js";

const CONNECT_TIMEOUT_MS = 20_000;
const IDLE_TIMEOUT_MS = 40_000;
const NON_STREAM_TIMEOUT_MS = 30_000;

export class AiProviderError extends Error {
  constructor(message, { status = null, code = null, retryable = false, timeout = false } = {}) {
    super(message);
    this.name = "AiProviderError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
    this.timeout = timeout;
  }
}

// Stable, non-reversible per-user id for the provider's abuse tooling.
export function safetyIdentifier(userId) {
  return crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`openai-safety|${String(userId)}`)
    .digest("hex")
    .slice(0, 32);
}

function buildBody({ model, instructions, input, effort, maxOutputTokens, userId, stream }) {
  const body = {
    model,
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    store: false, // don't keep students' conversations on the provider side
  };
  if (stream) body.stream = true;
  if (effort) body.reasoning = { effort };
  if (userId) body.safety_identifier = safetyIdentifier(userId);
  return body;
}

function stripOptional(body) {
  const copy = { ...body };
  delete copy.reasoning;
  delete copy.safety_identifier;
  return copy;
}

async function parseError(response) {
  let message = `OpenAI error ${response.status}`;
  let code = null;
  try {
    const data = await response.json();
    message = data?.error?.message || message;
    code = data?.error?.code || data?.error?.type || null;
  } catch { /* body wasn't JSON */ }
  const retryable = response.status === 429 || response.status >= 500;
  return new AiProviderError(message, { status: response.status, code, retryable });
}

async function post(body, signal, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new AiProviderError("Connect timeout", { timeout: true, retryable: true })), timeoutMs);
  const onAbort = () => controller.abort(signal.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    let response = await fetch(`${env.OPENAI_BASE_URL}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (response.status === 400) {
      // Maybe a model that doesn't accept an optional field. Retry once without them.
      const err = await parseError(response);
      const stripped = stripOptional(body);
      if (Object.keys(stripped).length !== Object.keys(body).length) {
        console.warn("[AI] 400 from provider, retrying without optional fields:", err.message);
        response = await fetch(`${env.OPENAI_BASE_URL}/responses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(stripped),
          signal: controller.signal,
        });
      } else {
        throw err;
      }
    }

    if (!response.ok) throw await parseError(response);
    return { response, controller, cleanup: () => { clearTimeout(timer); signal?.removeEventListener("abort", onAbort); } };
  } catch (err) {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
    if (err instanceof AiProviderError) throw err;
    if (signal?.aborted) throw err; // caller cancelled — surface as-is
    if (err?.name === "AbortError" || err?.cause instanceof AiProviderError) {
      throw err.cause instanceof AiProviderError ? err.cause : new AiProviderError("Timed out", { timeout: true, retryable: true });
    }
    throw new AiProviderError(`Network error: ${err?.message}`, { retryable: true });
  }
}

function normalizeUsage(u) {
  if (!u) return null;
  return {
    inputTokens: u.input_tokens ?? null,
    cachedTokens: u.input_tokens_details?.cached_tokens ?? 0,
    outputTokens: u.output_tokens ?? null,
    reasoningTokens: u.output_tokens_details?.reasoning_tokens ?? 0,
  };
}

// ── Streaming: async generator ────────────────────────────────────
// Yields { type: "delta", text } ... then { type: "done", usage, status, incompleteReason }
export async function* streamResponse(params, signal) {
  const body = buildBody({ ...params, stream: true });
  const { response, cleanup } = await post(body, signal, CONNECT_TIMEOUT_MS);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let usage = null;
  let status = "ok";
  let incompleteReason = null;
  let finished = false;

  try {
    while (true) {
      const readPromise = reader.read();
      let idleTimer;
      const idle = new Promise((_, reject) => {
        idleTimer = setTimeout(
          () => reject(new AiProviderError("Stream stalled", { timeout: true, retryable: true })),
          IDLE_TIMEOUT_MS
        );
      });

      let chunk;
      try {
        chunk = await Promise.race([readPromise, idle]);
      } finally {
        clearTimeout(idleTimer);
      }

      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });

      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";

      for (const raw of events) {
        const dataLines = raw
          .split(/\r?\n/)
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trim());
        if (dataLines.length === 0) continue;
        const dataStr = dataLines.join("\n");
        if (dataStr === "[DONE]") { finished = true; continue; }

        let evt;
        try { evt = JSON.parse(dataStr); } catch { continue; }

        switch (evt.type) {
          case "response.output_text.delta":
            if (typeof evt.delta === "string" && evt.delta) yield { type: "delta", text: evt.delta };
            break;
          case "response.completed":
            usage = normalizeUsage(evt.response?.usage);
            finished = true;
            break;
          case "response.incomplete":
            usage = normalizeUsage(evt.response?.usage);
            status = "incomplete";
            incompleteReason = evt.response?.incomplete_details?.reason ?? null;
            finished = true;
            break;
          case "response.failed": {
            const e = evt.response?.error;
            throw new AiProviderError(e?.message || "Response failed", { code: e?.code ?? null, retryable: true });
          }
          case "error":
            throw new AiProviderError(evt.message || evt.error?.message || "Stream error", {
              code: evt.code ?? evt.error?.code ?? null,
              retryable: true,
            });
          default:
            break;
        }
      }
    }
  } catch (err) {
    if (err instanceof AiProviderError) throw err;
    if (signal?.aborted) throw err;
    throw new AiProviderError(`Stream error: ${err?.message}`, { retryable: true });
  } finally {
    cleanup();
    try { await reader.cancel(); } catch { /* already closed */ }
  }

  if (!finished && status === "ok") {
    // Connection ended without a terminal event.
    throw new AiProviderError("Stream ended unexpectedly", { retryable: true });
  }

  yield { type: "done", usage, status, incompleteReason };
}

// ── Non-streaming (titles etc.) ───────────────────────────────────
function extractText(data) {
  if (typeof data?.output_text === "string") return data.output_text;
  const parts = [];
  for (const item of data?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c?.type === "output_text" && typeof c.text === "string") parts.push(c.text);
    }
  }
  return parts.join("");
}

export async function createResponse(params, signal) {
  const body = buildBody({ ...params, stream: false });
  const { response, cleanup } = await post(body, signal, NON_STREAM_TIMEOUT_MS);
  try {
    const data = await response.json();
    return { text: extractText(data), usage: normalizeUsage(data?.usage) };
  } finally {
    cleanup();
  }
}
