// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/ai/tts.js
//  "Listen" for AI answers (Elite). Text → speech with OpenAI
//  (gpt-4o-mini-tts), only when the student taps the button. The mp3
//  is cached for 3 days by a hash of the text, so replaying the same
//  answer costs nothing.
// ─────────────────────────────────────────────────────────────
import crypto from "crypto";
import mongoose from "mongoose";
import { env } from "../../config/env.js";
import AiUsage from "../../models/AiUsage.js";
import { istDayKey } from "./quota.js";

const MODEL = "gpt-4o-mini-tts";
const VOICE = "coral";
const USD_PER_MIN = 0.015;            // approx. gpt-4o-mini-tts audio price
const MAX_CHARS = 3800;

const ttsSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  audio: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3 * 86_400 },   // 3 days: keeps the DB small (Atlas Flex = 5 GB)
});
const TtsAudio = mongoose.models.TtsAudio || mongoose.model("TtsAudio", ttsSchema);

/** Markdown/LaTeX → plain sentences that read well aloud. */
export function speakable(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")                 // images / diagrams
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")               // links → text
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1 by $2")
    .replace(/\\sqrt\{([^}]*)\}/g, "root of $1")
    .replace(/\^\{?2\}?/g, " squared").replace(/\^\{?3\}?/g, " cubed")
    .replace(/\\times|×/g, " times ").replace(/\\cdot/g, " into ")
    .replace(/\\(?:left|right|mathrm|text|displaystyle)/g, "")
    .replace(/\\([a-zA-Z]+)/g, "$1")                       // \alpha → alpha
    .replace(/[$*_#>`|{}]/g, " ")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CHARS);
}

export const ttsHash = (text) => crypto.createHash("sha256").update(`${MODEL}|${VOICE}|${text}`).digest("hex");

export async function speak(text, { userId, plan }) {
  const clean = speakable(text);
  if (clean.length < 2) return null;
  const hash = ttsHash(clean);
  const hit = await TtsAudio.findOne({ hash }).lean();
  if (hit) return { audio: Buffer.from(hit.audio.buffer ?? hit.audio), cached: true };

  const started = Date.now();
  const r = await fetch(`${env.OPENAI_BASE_URL}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, voice: VOICE, input: clean, response_format: "mp3",
      instructions: "You are a warm Indian teacher. Read Hinglish words with natural Hindi pronunciation and English science terms clearly. Read formulas the way a teacher says them aloud.",
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!r.ok) {
    const err = new Error(`tts ${r.status}`);
    err.name = "AiProviderError";
    throw err;
  }
  const audio = Buffer.from(await r.arrayBuffer());
  const minutes = clean.split(/\s+/).length / 150;
  const usd = minutes * USD_PER_MIN;
  AiUsage.create({ userId, day: istDayKey(), kind: "voice", plan, model: MODEL, effort: "none", status: "ok",
    costUsd: usd, costInr: usd * env.AI_USD_INR, latencyMs: Date.now() - started }).catch(() => {});
  if (audio.length < 2_500_000) await TtsAudio.updateOne({ hash }, { $setOnInsert: { hash, audio } }, { upsert: true }).catch(() => {});
  return { audio, cached: false };
}
