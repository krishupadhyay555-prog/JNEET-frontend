import { describe, it, expect } from "vitest";
import { normalizeEmail, maskEmail } from "../utils/email.js";
import { parseDob, calcAge, isMinor } from "../utils/age.js";
import { detectDistress, buildSystemPrompt, normalizePersona } from "../services/ai/persona.js";
import { shapeHistory } from "../services/ai/history.js";
import { estimateCost } from "../services/ai/prices.js";
import { istDayKey, nextIstMidnight } from "../services/ai/quota.js";
import { hashOtp, cooldownRemainingSec } from "../services/otpService.js";
import { escapeHtml } from "../services/emailService.js";
import { passwordSchema, dobSchema } from "../schemas/common.js";

describe("normalizeEmail", () => {
  it("collapses gmail dots, plus tags and googlemail", () => {
    expect(normalizeEmail("Jo.Hn+neet@Gmail.com")).toBe("john@gmail.com");
    expect(normalizeEmail("john@googlemail.com")).toBe("john@gmail.com");
  });
  it("drops +tag only on known providers, leaves others alone", () => {
    expect(normalizeEmail("a+b@outlook.com")).toBe("a@outlook.com");
    expect(normalizeEmail("a.b+c@company.in")).toBe("a.b+c@company.in");
  });
  it("is safe on junk", () => {
    expect(normalizeEmail(null)).toBe("");
    expect(normalizeEmail("nonsense")).toBe("nonsense");
  });
  it("masks addresses", () => {
    expect(maskEmail("john@gmail.com")).toMatch(/^jo\*+@gmail\.com$/);
    expect(maskEmail("x")).toBe("");
  });
});

describe("age", () => {
  const now = new Date("2026-10-18T10:00:00Z");
  it("parses strictly", () => {
    expect(parseDob("2010-02-31", now)).toBeNull();
    expect(parseDob("2027-01-01", now)).toBeNull();
    expect(parseDob("1800-01-01", now)).toBeNull();
    expect(parseDob("10-02-2010", now)).toBeNull();
    expect(parseDob("2008-10-18", now)).toBeInstanceOf(Date);
  });
  it("computes completed years around the birthday", () => {
    expect(calcAge("2008-10-18", now)).toBe(18);
    expect(calcAge("2008-10-19", now)).toBe(17);
    expect(isMinor("2008-10-19", now)).toBe(true);
    expect(isMinor("2008-10-18", now)).toBe(false);
  });
});

describe("schemas", () => {
  it("password policy", () => {
    expect(passwordSchema.safeParse("Zx9-Quartz-Lamp").success).toBe(true);
    for (const bad of ["short1", "allletters!!", "12345678900", "Password123", "NEET2027"]) {
      expect(passwordSchema.safeParse(bad).success).toBe(false);
    }
  });
  it("dob must be real and 13+", () => {
    expect(dobSchema.safeParse("2000-01-01").success).toBe(true);
    expect(dobSchema.safeParse("2999-01-01").success).toBe(false);
  });
});

describe("persona + distress", () => {
  it("detects distress in English, Hinglish and Devanagari", () => {
    for (const t of ["I want to die", "mujhe marna chahta hu", "sab khatam kar dunga", "मुझे आत्महत्या के ख्याल आते हैं"]) {
      expect(detectDistress(t)).toBe(true);
    }
  });
  it("does not trip on study talk", () => {
    for (const t of ["this chapter is killing me, explain torque", "I'll die of boredom, give me a trick for mitosis", "kinetic theory ka formula batao"]) {
      expect(detectDistress(t)).toBe(false);
    }
  });
  it("fun persona keeps the same teaching and safety rules; distress forces serious tone", () => {
    const mentor = buildSystemPrompt({ examMode: "NEET", persona: "mentor" });
    const fun = buildSystemPrompt({ examMode: "NEET", persona: "fun" });
    expect(fun).not.toBe(mentor);
    expect(fun).toContain("HOW YOU TEACH");
    expect(fun).toContain("NCERT");
    const funDistress = buildSystemPrompt({ examMode: "NEET", persona: "fun", distress: true });
    expect(funDistress).not.toContain(fun.slice(mentor.length)); // fun style not applied
    expect(normalizePersona("nonsense")).toBe("mentor");
  });
  it("exam mode switches syllabus", () => {
    expect(buildSystemPrompt({ examMode: "JEE" })).toContain("JEE");
  });
});

describe("history shaping", () => {
  it("keeps the newest turns, starts with a student turn, maps ai→assistant", () => {
    const msgs = [
      { role: "ai", content: "old answer" },
      { role: "user", content: "q1" },
      { role: "ai", content: "a1" },
      { role: "user", content: "q2" },
    ];
    const out = shapeHistory(msgs);
    expect(out[0].role).toBe("user");
    expect(out.map((m) => m.role)).toEqual(["user", "assistant", "user"]);
  });
  it("respects the character budget but always keeps the latest message", () => {
    const msgs = Array.from({ length: 10 }, (_, i) => ({ role: i % 2 ? "ai" : "user", content: "x".repeat(2000) }));
    const out = shapeHistory(msgs, { maxTotalChars: 4500 });
    expect(out.reduce((n, m) => n + m.content.length, 0)).toBeLessThanOrEqual(4500);
    expect(out.length).toBeGreaterThan(0);
  });
  it("ignores junk rows", () => {
    expect(shapeHistory([{ role: "system", content: "x" }, { role: "user" }, null])).toEqual([]);
  });
});

describe("cost + time helpers", () => {
  it("estimates cost, null for unknown model", () => {
    const c = estimateCost("gpt-6-luna", { inputTokens: 1_000_000, cachedTokens: 0, outputTokens: 1_000_000 });
    expect(c.usd).toBeCloseTo(0.6, 5);
    expect(estimateCost("mystery", { inputTokens: 1 }).usd).toBeNull();
  });
  it("IST day rolls over at 18:30 UTC", () => {
    expect(istDayKey(new Date("2026-10-18T18:29:00Z"))).toBe("2026-10-18");
    expect(istDayKey(new Date("2026-10-18T18:31:00Z"))).toBe("2026-10-19");
    expect(nextIstMidnight(new Date("2026-10-18T10:00:00Z"))).toBe("2026-10-18T18:30:00.000Z");
  });
});

describe("otp + email helpers", () => {
  it("hash is bound to purpose and user", () => {
    const a = hashOtp("verify", "u1", "123456");
    expect(a).toBe(hashOtp("verify", "u1", "123456"));
    expect(a).not.toBe(hashOtp("reset", "u1", "123456"));
    expect(a).not.toBe(hashOtp("verify", "u2", "123456"));
  });
  it("cooldown derives from expiry", () => {
    expect(cooldownRemainingSec(null)).toBe(0);
    const now = Date.now();
    expect(cooldownRemainingSec(new Date(now + 10 * 60 * 1000 - 20_000), now)).toBeGreaterThan(30);
    expect(cooldownRemainingSec(new Date(now + 5 * 60 * 1000), now)).toBe(0);
  });
  it("escapes html", () => {
    expect(escapeHtml(`<img src=x onerror="a()">`)).not.toContain("<");
  });
});
