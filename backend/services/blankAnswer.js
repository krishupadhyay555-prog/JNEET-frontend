// ============================================================
//  JNEET+ AI — services/blankAnswer.js
//  Checks a typed fill-in-the-blank answer against the accepted
//  answers of a question. Forgiving about form, strict about meaning:
//    - case, spaces, dots, apostrophes, brackets and hyphens between
//      letters don't matter ("See-saw" = "see saw" = "seesaw"); a + or −
//      sign is kept (O₂⁻ ≠ O₂)
//    - subscript / superscript digits count as normal digits (SF₄ = SF4)
//    - Greek letters may be typed as names (π = pi, Δ = delta …)
//    - numbers are compared as numbers (0.50 = .5 = 1/2), within 0.5%
//  No typo tolerance on purpose: one letter changes the meaning in
//  science (ethanol / methanol, propanal / propanol). Common spelling
//  variants are listed in the question's `answers` instead.
// ============================================================

const SUB_SUP = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "₊": "+", "₋": "-",
};
const GREEK = {
  α: "alpha", β: "beta", γ: "gamma", δ: "delta", Δ: "delta", θ: "theta", λ: "lambda",
  μ: "mu", π: "pi", ρ: "rho", σ: "sigma", τ: "tau", φ: "phi", ω: "omega", Ω: "omega",
};

export function normalizeBlank(text) {
  let t = String(text ?? "").normalize("NFKC");
  t = t.replace(/[₀-₉⁰-⁹⁺⁻₊₋¹²³]/g, (c) => SUB_SUP[c] ?? c);
  t = t.replace(/[αβγδΔθλμπρστφωΩ]/g, (c) => GREEK[c]);
  t = t.toLowerCase();
  t = t.replace(/^(the|a|an)\s+/, "");
  // A hyphen BETWEEN letters is spelling ("see-saw"); anywhere else it
  // may be a charge or a minus sign ("O2-", "-3"), so it stays.
  t = t.replace(/(?<=\p{L})[-‐-―−](?=\p{L})/gu, "");
  t = t.replace(/[‐-―−]/g, "-");
  return t.replace(/[\s_.,'’"`()[\]{}:;!?·]/g, "");
}

function asNumber(text) {
  const t = String(text ?? "").normalize("NFKC").trim().replace(/[−‐-―]/g, "-").replace(/,/g, "").replace(/\s*(°|degrees?|deg)$/i, "");
  if (/^[-+]?\d+\s*\/\s*\d+$/.test(t)) {
    const [a, b] = t.split("/").map(Number);
    return b === 0 ? null : a / b;
  }
  if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return Number(t);
  return null;
}

export function isBlankCorrect(typed, accepted = []) {
  if (typeof typed !== "string" || !typed.trim() || !Array.isArray(accepted) || !accepted.length) return false;
  const n = asNumber(typed);
  const t = normalizeBlank(typed);
  if (!t) return false;
  return accepted.some((ans) => {
    const an = asNumber(ans);
    if (an !== null) {
      if (n === null) return false;
      return an === 0 ? Math.abs(n) < 1e-9 : Math.abs(n - an) / Math.abs(an) <= 0.005;
    }
    const a = normalizeBlank(ans);
    if (!a) return false;
    return t === a;
  });
}
