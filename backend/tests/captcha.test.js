import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { env } from "../config/env.js";
import { verifyTurnstile, requireCaptcha } from "../middleware/captcha.js";
import { connectTestDb, disconnectTestDb, client, nextIp } from "./helpers.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const resp = (obj, ok = true) => async () => ({ ok, json: async () => obj });

describe("verifyTurnstile", () => {
  beforeEach(() => { env.TURNSTILE_SECRET_KEY = "secret"; });
  afterEach(() => { delete env.TURNSTILE_SECRET_KEY; vi.restoreAllMocks(); });

  it("accepts a good token", async () => {
    expect((await verifyTurnstile("good-token", "1.2.3.4", { fetchImpl: resp({ success: true }) })).ok).toBe(true);
  });
  it("rejects missing / junk tokens without calling Cloudflare", async () => {
    const f = vi.fn();
    for (const t of [undefined, null, "", "abc", 123, "x".repeat(3000)]) {
      expect((await verifyTurnstile(t, "1.1.1.1", { fetchImpl: f })).ok).toBe(false);
    }
    expect(f).not.toHaveBeenCalled();
  });
  it("rejects a token Cloudflare says is invalid or already used", async () => {
    const r = await verifyTurnstile("used-token", "1.1.1.1", { fetchImpl: resp({ success: false, "error-codes": ["timeout-or-duplicate"] }) });
    expect(r).toMatchObject({ ok: false, reason: "invalid" });
  });
  it("fails OPEN on outage, 5xx and our own bad secret (never locks students out)", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await verifyTurnstile("good-token", "1.1.1.1", { fetchImpl: async () => { throw new Error("net"); } })).ok).toBe(true);
    expect((await verifyTurnstile("good-token", "1.1.1.1", { fetchImpl: resp({}, false) })).ok).toBe(true);
    expect((await verifyTurnstile("good-token", "1.1.1.1", { fetchImpl: resp({ success: false, "error-codes": ["invalid-input-secret"] }) })).ok).toBe(true);
  });
});

describe("requireCaptcha on the auth routes", () => {
  const realFetch = globalThis.fetch;
  beforeAll(connectTestDb);
  afterAll(disconnectTestDb);
  afterEach(() => { delete env.TURNSTILE_SECRET_KEY; globalThis.fetch = realFetch; });

  const stubCloudflare = () => {
    globalThis.fetch = vi.fn(async (url, init) => {
      if (!String(url).includes("challenges.cloudflare.com")) return realFetch(url, init);
      const token = new URLSearchParams(init.body).get("response");
      return new Response(JSON.stringify({ success: token.startsWith("good") }), { status: 200 });
    });
  };
  const forgot = (extra = {}) => client().post("/api/auth/forgot-password").set("X-Forwarded-For", nextIp()).send({ email: "nobody@example.com", ...extra });

  it("is completely off when no secret is configured", async () => {
    const res = await forgot();
    expect(res.status).toBe(200);
  });
  it("blocks a request without a token, and with a bad one", async () => {
    env.TURNSTILE_SECRET_KEY = "secret"; stubCloudflare();
    const none = await forgot();
    expect(none.status).toBe(400);
    expect(none.body.code).toBe("CAPTCHA_FAILED");
    const bad = await forgot({ captchaToken: "bad-token-xx" });
    expect(bad.status).toBe(400);
    expect(bad.body.code).toBe("CAPTCHA_FAILED");
  });
  it("lets a request with a good token through on every protected route", async () => {
    env.TURNSTILE_SECRET_KEY = "secret"; stubCloudflare();
    expect((await forgot({ captchaToken: "good-token-1" })).status).toBe(200);
    for (const path of ["/api/auth/login", "/api/auth/login-code", "/api/auth/resend-verification", "/api/auth/register"]) {
      const withoutToken = await client().post(path).set("X-Forwarded-For", nextIp()).send({ email: "a@example.com" });
      expect(withoutToken.status, path).toBe(400);
      expect(withoutToken.body.code, path).toBe("CAPTCHA_FAILED");
    }
  });
  it("does not require a token for the code-verify / reset steps (they already need the e-mailed code)", async () => {
    env.TURNSTILE_SECRET_KEY = "secret"; stubCloudflare();
    const res = await client().post("/api/auth/verify-email").set("X-Forwarded-For", nextIp()).send({ email: "a@example.com", otp: "123456" });
    expect(res.body.code).not.toBe("CAPTCHA_FAILED");
  });
  it("middleware is a no-op without a secret", async () => {
    let called = false;
    await requireCaptcha({ body: {} }, {}, () => { called = true; });
    expect(called).toBe(true);
  });
});
