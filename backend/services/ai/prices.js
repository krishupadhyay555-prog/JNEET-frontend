// ============================================================
//  JNEET+ AI — services/ai/prices.js
//  USD per 1M tokens, used ONLY for the usage ledger (cost visibility)
//  — it never affects what a user is charged. Reasoning tokens are
//  billed as output tokens. Unknown model → cost is recorded as null
//  rather than guessed.
//  Update these when provider prices change (see provider pricing
//  page); AI_USD_INR converts to rupees.
// ============================================================

import { env } from "../../config/env.js";

export const PRICES_USD_PER_M = {
  "gpt-6-luna":  { input: 0.10, cachedInput: 0.01, output: 0.50 },
  "gpt-6.1-sol": { input: 2.00, cachedInput: 0.20, output: 10.00 },
  "gpt-6-astra": { input: 10.00, cachedInput: 1.00, output: 50.00 },
};

export function estimateCost(model, usage) {
  const p = PRICES_USD_PER_M[model];
  if (!p || !usage) return { usd: null, inr: null };

  const input = usage.inputTokens ?? 0;
  const cached = Math.min(usage.cachedTokens ?? 0, input);
  const output = usage.outputTokens ?? 0; // includes reasoning tokens

  const usd =
    ((input - cached) * p.input + cached * p.cachedInput + output * p.output) / 1_000_000;

  return { usd, inr: usd * env.AI_USD_INR };
}
