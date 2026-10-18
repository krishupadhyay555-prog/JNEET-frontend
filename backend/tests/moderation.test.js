import { describe, it, expect } from "vitest";
import { detectAdultContent, moderateWithProvider, normalizeForModeration } from "../services/ai/moderation.js";
import { levelFor } from "../services/ai/policy.js";

describe("18+ detector — flags explicit requests", () => {
  it.each([
    "send me nudes",
    "tell me a sex story",
    "porn dikha",
    "p0rn links please",
    "let's do sexting",
    "n.u.d.e.s",
    "chudai ki kahani suna",
    "i want to have sex with you",
    "pornnnn",
    "roleplay as my girlfriend for a sexual chat",
    "नंगी फोटो भेजो",
    "dirty talk karo",
    "send 18+ video",
    "p\u200born dikha",
  ])("flags: %s", (t) => expect(detectAdultContent(t)).toBe(true));
});

describe("18+ detector — never flags real syllabus language", () => {
  it.each([
    "Explain sexual reproduction in flowering plants",
    "How is sex determined in humans? XX-XY system",
    "What are sex hormones and what do testes secrete?",
    "Describe the menstrual cycle phases and hormones involved",
    "Gymnosperms have naked seeds, explain",
    "Measure it with the naked eye or a vernier caliper?",
    "Explain fertilisation, zygote and implantation",
    "What are STDs and how can they be prevented? contraception methods",
    "cockroach digestive system diagram",
    "Sex-linked inheritance and haemophilia",
    "gametogenesis: spermatogenesis vs oogenesis",
    "mujhe chod do, ye chapter samajh nahi aa raha",
    "Newton's third law: action and reaction, doubt hai",
  ])("clean: %s", (t) => expect(detectAdultContent(t)).toBe(false));

  it("empty / non-string input is clean", () => {
    expect(detectAdultContent("")).toBe(false);
    expect(detectAdultContent(null)).toBe(false);
    expect(detectAdultContent(undefined)).toBe(false);
  });
});

describe("normalizeForModeration", () => {
  it("de-obfuscates common tricks", () => {
    expect(normalizeForModeration("P0RN")).toBe("porn");
    expect(normalizeForModeration("pornnnn")).toBe("pornn");
  });
});

describe("provider moderation (fails open)", () => {
  const withKey = async (fn) => {
    const { env } = await import("../config/env.js");
    const old = env.OPENAI_API_KEY; env.OPENAI_API_KEY = "sk-test";
    try { return await fn(); } finally { env.OPENAI_API_KEY = old; }
  };
  const resp = (obj, ok = true) => async () => ({ ok, json: async () => obj });

  it("flags high sexual score", () => withKey(async () => {
    const r = await moderateWithProvider("x", { fetchImpl: resp({ results: [{ categories: { sexual: true }, category_scores: { sexual: 0.97 } }] }) });
    expect(r).toBe(true);
  }));
  it("ignores a low score", () => withKey(async () => {
    const r = await moderateWithProvider("x", { fetchImpl: resp({ results: [{ categories: { sexual: true }, category_scores: { sexual: 0.4 } }] }) });
    expect(r).toBe(false);
  }));
  it("always flags sexual/minors", () => withKey(async () => {
    const r = await moderateWithProvider("x", { fetchImpl: resp({ results: [{ categories: { "sexual/minors": true }, category_scores: {} }] }) });
    expect(r).toBe(true);
  }));
  it("fails open on error, bad status and timeouts", () => withKey(async () => {
    expect(await moderateWithProvider("x", { fetchImpl: async () => { throw new Error("net"); } })).toBe(false);
    expect(await moderateWithProvider("x", { fetchImpl: resp({}, false) })).toBe(false);
    expect(await moderateWithProvider("x", { fetchImpl: resp({ results: [] }) })).toBe(false);
  }));
});

describe("policy levels", () => {
  it("escalates warning → final → paused", () => {
    expect([1, 2, 3, 4, 9].map(levelFor)).toEqual(["warning", "final_warning", "paused", "paused", "paused"]);
  });
});
