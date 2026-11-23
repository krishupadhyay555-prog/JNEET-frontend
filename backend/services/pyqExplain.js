// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/pyqExplain.js
//  "Explain with AI" for official PYQs. The AI reads NTA's question
//  image, solves it and must end with "FINAL: <answer>". We save the
//  explanation only if that answer matches NTA's final key; otherwise
//  we try once more with the deep model, and if it still disagrees we
//  show nothing (never a wrong solution). One explanation per question
//  and language is cached and shared by every student.
// ─────────────────────────────────────────────────────────────
import PyqExplanation from "../models/PyqExplanation.js";
import AiUsage from "../models/AiUsage.js";
import { env } from "../config/env.js";
import { createResponse } from "./ai/openaiClient.js";
import { estimateCost } from "./ai/prices.js";
import { istDayKey } from "./ai/quota.js";
import { pyqByRef, sameNumber } from "./pyqPool.js";

const RETRY_FAILED_AFTER_MS = 7 * 86_400_000;
const inflight = new Map();

export function finalAnswer(text) {
  const m = String(text || "").match(/FINAL\s*:\s*\(?\s*([-+]?\d+(?:\.\d+)?)\s*\)?\s*$/im);
  return m ? m[1] : null;
}

export function matchesKey(p, final) {
  if (final === null) return false;
  if (p.type === "numeric") return (p.answers ?? []).some((a) => sameNumber(final, a));
  const n = Number(final);
  return Number.isInteger(n) && n - 1 === p.correctIndex;
}

function keyText(p) {
  return p.type === "numeric" ? (p.answers ?? []).join(" or ") : `option (${p.correctIndex + 1})`;
}

export function buildInput(p, lang) {
  const abs = (u) => `${env.APP_URL}${u}`;
  const language = lang === "hinglish"
    ? "Write in simple Hinglish (Hindi words in Roman script mixed with English; keep all scientific terms in English)."
    : "Write in simple English.";
  const ask = p.type === "numeric"
    ? "This is a numerical-answer question. The very last line must be exactly: FINAL: <number>"
    : "The options are numbered 1, 2, 3, 4 in the order shown. The very last line must be exactly: FINAL: <option number>";
  const content = [{
    type: "input_text",
    text: `Official ${p.exam === "NEET" ? "NEET UG" : "JEE Main"} question (${p.label}, ${p.subject}, ${p.chapter}).\n` +
      `${p.text ? `Question text: ${p.text}\n` : ""}${(p.options ?? []).length ? `Options: ${p.options.map((o, i) => `(${i + 1}) ${o}`).join("  ")}\n` : ""}` +
      `Solve it step by step like a good teacher: key idea first, then short numbered steps, formulas in LaTeX ($...$). ` +
      `Keep it under 250 words. Mention one common trap if there is one. ${language}\n${ask}`,
  }];
  for (const u of [p.imageUrl, p.figUrl, ...(p.optionImages ?? [])]) if (u) content.push({ type: "input_image", image_url: abs(u) });
  return [{ role: "user", content }];
}

const INSTRUCTIONS = "You are an expert NEET/JEE teacher. Read the question image carefully. Be exact; never guess. If unsure, still give your best final answer.";

async function tryModel(p, lang, model, effort, userId, plan) {
  const started = Date.now();
  const r = await createResponse({ model, effort, instructions: INSTRUCTIONS, input: buildInput(p, lang), maxOutputTokens: 4000, userId });
  const cost = estimateCost(model, r.usage);
  AiUsage.create({
    userId, day: istDayKey(), kind: "explain", plan, model, effort, status: "ok",
    inputTokens: r.usage?.inputTokens ?? null, cachedTokens: r.usage?.cachedTokens ?? null,
    outputTokens: r.usage?.outputTokens ?? null, reasoningTokens: r.usage?.reasoningTokens ?? null,
    costUsd: cost.usd, costInr: cost.inr, latencyMs: Date.now() - started,
  }).catch(() => {});
  return r.text || "";
}

function finish(p, text) {
  const body = text.replace(/\n?\s*FINAL\s*:.*$/im, "").trim();
  return `${body}\n\n**Answer (NTA key): ${keyText(p)}**`;
}

/** Cached explanation or null. { status: "ok", text } | { status: "failed" } | null */
export async function cachedExplanation(ref, lang) {
  const doc = await PyqExplanation.findOne({ ref, lang }).lean();
  if (!doc) return null;
  if (doc.status === "failed" && Date.now() - new Date(doc.updatedAt).getTime() > RETRY_FAILED_AFTER_MS) return null;
  return doc;
}

/** Generate (deduped across concurrent requests). Returns { status, text }. */
export function generateExplanation(ref, lang, { userId, plan }) {
  const k = `${ref}|${lang}`;
  if (inflight.has(k)) return inflight.get(k);
  const job = (async () => {
    const p = pyqByRef(ref);
    if (!p) return { status: "missing" };
    const routes = [[env.AI_MODEL_ELITE, "medium"], [env.AI_MODEL_DEEP, "high"]];
    let tries = 0;
    for (const [model, effort] of routes) {
      tries += 1;
      const text = await tryModel(p, lang, model, effort, userId, plan);
      if (matchesKey(p, finalAnswer(text))) {
        const out = finish(p, text);
        await PyqExplanation.updateOne({ ref, lang }, { $set: { status: "ok", text: out, model, tries } }, { upsert: true });
        return { status: "ok", text: out };
      }
    }
    await PyqExplanation.updateOne({ ref, lang }, { $set: { status: "failed", text: "", model: null, tries } }, { upsert: true });
    return { status: "failed" };
  })().finally(() => inflight.delete(k));
  inflight.set(k, job);
  return job;
}
