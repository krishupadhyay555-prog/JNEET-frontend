import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import { mailbox, clearMailbox } from "./mailbox.js";
import {
  connectTestDb, disconnectTestDb, client, registerBody, signedInClient,
  uniqueEmail, STRONG_PASSWORD,
} from "./helpers.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => { await User.deleteMany({}); clearMailbox(); });

describe("Register", () => {
  it("creates an unverified account and sends a code (no session yet)", async () => {
    const c = client();
    const body = registerBody();
    const res = await c.post("/api/auth/register").send(body);
    expect(res.status).toBe(201);
    expect(res.body.requiresVerification).toBe(true);
    expect(res.body.emailSent).toBe(true);
    expect(res.body.resendAfter).toBeGreaterThan(0);
    expect(res.headers["set-cookie"]).toBeUndefined();
    expect(mailbox.verify.get(body.email)).toMatch(/^\d{6}$/);
    const me = await c.get("/api/auth/me");
    expect(me.status).toBe(401);
  });

  it("rejects weak / common passwords, bad exam, missing consent", async () => {
    const c = client();
    expect((await c.post("/api/auth/register").send(registerBody({ password: "Password123" }))).status).toBe(400);
    expect((await c.post("/api/auth/register").send(registerBody({ password: "short1" }))).status).toBe(400);
    expect((await c.post("/api/auth/register").send(registerBody({ examMode: "UPSC" }))).status).toBe(400);
    expect((await c.post("/api/auth/register").send(registerBody({ acceptTerms: false }))).status).toBe(400);
  });

  it("rejects under-13 and impossible dates of birth", async () => {
    const c = client();
    const year = new Date().getFullYear() - 10;
    expect((await c.post("/api/auth/register").send(registerBody({ dateOfBirth: `${year}-01-01` }))).status).toBe(400);
    expect((await c.post("/api/auth/register").send(registerBody({ dateOfBirth: "2001-02-30" }))).status).toBe(400);
    expect((await c.post("/api/auth/register").send(registerBody({ dateOfBirth: "not-a-date" }))).status).toBe(400);
  });

  it("requires a different parent email for under-18s", async () => {
    const c = client();
    const year = new Date().getFullYear() - 15;
    const base = registerBody({ dateOfBirth: `${year}-01-01` });
    expect((await c.post("/api/auth/register").send(base)).status).toBe(400);
    expect((await c.post("/api/auth/register").send({ ...base, parentEmail: base.email })).status).toBe(400);
    const ok = await c.post("/api/auth/register").send({ ...base, parentEmail: uniqueEmail("parent") });
    expect(ok.status).toBe(201);
  });

  it("blocks duplicate emails, including Gmail dot/plus tricks", async () => {
    const { body } = await signedInClient({ email: "farm.er@gmail.com" });
    const c = client();
    expect((await c.post("/api/auth/register").send({ ...body })).status).toBe(409);
    expect((await c.post("/api/auth/register").send({ ...body, email: "farmer@gmail.com" })).status).toBe(409);
    expect((await c.post("/api/auth/register").send({ ...body, email: "f.a.r.m.e.r+x@gmail.com" })).status).toBe(409);
  });

  it("re-registering an unverified email resumes verification instead of failing", async () => {
    const c = client();
    const body = registerBody();
    await c.post("/api/auth/register").send(body);
    const again = await client().post("/api/auth/register").send(body);
    expect(again.status).toBe(200);
    expect(again.body.requiresVerification).toBe(true);
  });
});

describe("Verify email", () => {
  it("wrong code fails; right code signs in with an httpOnly cookie", async () => {
    const c = client();
    const body = registerBody();
    await c.post("/api/auth/register").send(body);
    const wrong = await c.post("/api/auth/verify-email").send({ email: body.email, otp: "000000" });
    expect([400, 401]).toContain(wrong.status);
    const right = await c.post("/api/auth/verify-email").send({ email: body.email, otp: mailbox.verify.get(body.email) });
    expect(right.status).toBe(200);
    expect(right.body.student.email).toBe(body.email);
    expect(right.body.student.password).toBeUndefined();
    const cookie = right.headers["set-cookie"].join(";");
    expect(cookie).toMatch(/jneet_token=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect((await c.get("/api/auth/me")).status).toBe(200);
  });

  it("locks the code after 5 wrong attempts", async () => {
    const c = client();
    const body = registerBody();
    await c.post("/api/auth/register").send(body);
    const real = mailbox.verify.get(body.email);
    const bad = real === "111111" ? "222222" : "111111";
    for (let i = 0; i < 5; i++) await c.post("/api/auth/verify-email").send({ email: body.email, otp: bad });
    const after = await c.post("/api/auth/verify-email").send({ email: body.email, otp: real });
    expect(after.status).not.toBe(200);
  });

  it("stores only a hash of the code", async () => {
    const c = client();
    const body = registerBody();
    await c.post("/api/auth/register").send(body);
    const u = await User.findOne({ email: body.email }).select("+emailOtpHash");
    expect(u.emailOtpHash).toBeTruthy();
    expect(u.emailOtpHash).not.toContain(mailbox.verify.get(body.email));
  });
});

describe("Login", () => {
  it("logs in with the right password, rejects the wrong one with a generic message", async () => {
    const { body } = await signedInClient();
    const ok = await client().post("/api/auth/login").send({ email: body.email, password: body.password });
    expect(ok.status).toBe(200);
    const bad = await client().post("/api/auth/login").send({ email: body.email, password: "Wrong-pass-1" });
    const unknown = await client().post("/api/auth/login").send({ email: uniqueEmail("nobody"), password: "Wrong-pass-1" });
    expect(bad.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(bad.body.error).toBe(unknown.body.error);
  });

  it("locks the account after repeated failures", async () => {
    const { body } = await signedInClient();
    let last;
    for (let i = 0; i < 5; i++) {
      last = await client().post("/api/auth/login").send({ email: body.email, password: "Wrong-pass-1" });
    }
    expect(last.status).toBe(423);
    const correctButLocked = await client().post("/api/auth/login").send({ email: body.email, password: body.password });
    expect(correctButLocked.status).toBe(423);
  });

  it("refuses unverified accounts and says verification is needed", async () => {
    const c = client();
    const body = registerBody();
    await c.post("/api/auth/register").send(body);
    const res = await client().post("/api/auth/login").send({ email: body.email, password: body.password });
    expect(res.status).toBe(403);
    expect(res.body.requiresVerification).toBe(true);
  });

  it("logout clears the session", async () => {
    const { c } = await signedInClient();
    expect((await c.get("/api/auth/me")).status).toBe(200);
    await c.post("/api/auth/logout");
    expect((await c.get("/api/auth/me")).status).toBe(401);
  });
});

describe("Passwordless login code", () => {
  it("emails a code that logs the student in once", async () => {
    const { body } = await signedInClient();
    const c = client();
    const req = await c.post("/api/auth/login-code").send({ email: body.email });
    expect(req.status).toBe(200);
    const code = mailbox.login.get(body.email);
    expect(code).toMatch(/^\d{6}$/);
    const ok = await c.post("/api/auth/login-code/verify").send({ email: body.email, otp: code });
    expect(ok.status).toBe(200);
    expect((await c.get("/api/auth/me")).status).toBe(200);
    const replay = await client().post("/api/auth/login-code/verify").send({ email: body.email, otp: code });
    expect(replay.status).not.toBe(200);
  });

  it("does not reveal whether an email is registered", async () => {
    const res = await client().post("/api/auth/login-code").send({ email: uniqueEmail("ghost") });
    expect(res.status).toBe(200);
  });
});

describe("Forgot / reset password", () => {
  it("resets the password, invalidates old sessions, works the same second", async () => {
    const { c, body } = await signedInClient();
    const f = await client().post("/api/auth/forgot-password").send({ email: body.email });
    expect(f.status).toBe(200);
    const otp = mailbox.reset.get(body.email);
    const next = "Fresh-Mango-77";
    const r = await client().post("/api/auth/reset-password").send({ email: body.email, otp, newPassword: next });
    expect(r.status).toBe(200);
    expect((await c.get("/api/auth/me")).status).toBe(401); // old session dead
    expect((await client().post("/api/auth/login").send({ email: body.email, password: body.password })).status).toBe(401);
    expect((await client().post("/api/auth/login").send({ email: body.email, password: next })).status).toBe(200);
  });

  it("unknown email gets the same generic answer", async () => {
    const res = await client().post("/api/auth/forgot-password").send({ email: uniqueEmail("ghost") });
    expect(res.status).toBe(200);
  });
});

describe("Change password", () => {
  it("enforces the strong-password rule and keeps this session alive", async () => {
    const { c, body } = await signedInClient();
    expect((await c.patch("/api/user/password").send({ currentPassword: body.password, newPassword: "abc123" })).status).toBe(400);
    const ok = await c.patch("/api/user/password").send({ currentPassword: body.password, newPassword: "Another-Pear-42" });
    expect(ok.status).toBe(200);
    expect((await c.get("/api/auth/me")).status).toBe(200);
  });
});

describe("Hardening", () => {
  it("rejects state-changing requests from an untrusted Origin", async () => {
    const res = await request(app).post("/api/auth/logout").set("Origin", "https://evil.example");
    expect(res.status).toBe(403);
  });

  it("rejects NoSQL operator injection", async () => {
    const res = await client().post("/api/auth/login").send({ email: { $gt: "" }, password: "x" });
    expect(res.status).toBe(400);
  });

  it("sends security headers and hides the stack", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-request-id"]).toBeTruthy();
    expect(res.body).toEqual({ status: "ok" });
  });

  it("rejects an oversized body and malformed JSON cleanly", async () => {
    const big = await client().post("/api/auth/login").send({ email: "a@b.co", password: "x".repeat(300_000) });
    expect(big.status).toBe(413);
    const bad = await request(app).post("/api/auth/login").set("Content-Type", "application/json").send("{oops");
    expect(bad.status).toBe(400);
  });

  it("protected routes need a session; upload route is gone", async () => {
    expect((await client().get("/api/chat/sessions")).status).toBe(401);
    expect((await client().get("/api/test/history")).status).toBe(401);
    expect((await client().post("/api/upload/image").send({})).status).toBe(404);
  });
});

describe("Parent consent", () => {
  async function minor() {
    const c = client();
    const year = new Date().getFullYear() - 15;
    const parentEmail = uniqueEmail("parent");
    const body = registerBody({ dateOfBirth: `${year}-03-03`, parentEmail });
    await c.post("/api/auth/register").send(body);
    const v = await c.post("/api/auth/verify-email").send({ email: body.email, otp: mailbox.verify.get(body.email) });
    return { c, body, parentEmail, student: v.body.student };
  }

  it("locks the AI for a minor until the parent approves, then unlocks; revoke relocks", async () => {
    const { c, parentEmail } = await minor();
    expect((await c.get("/api/auth/me")).body.student.aiLocked).toBe(true);
    const ask = await c.post("/api/ai/ask").send({ prompt: "What is Newton's second law?" });
    expect([403, 503]).toContain(ask.status);

    const link = mailbox.parent.get(parentEmail);
    expect(link).toBeTruthy();
    const token = link.split("/").pop();
    const p = client();
    expect((await p.get(`/api/consent/parent/${token}`)).status).toBe(200);
    expect((await p.post(`/api/consent/parent/${token}/approve`).send({ isAdult: false, agree: true })).status).toBe(400);
    expect((await p.post(`/api/consent/parent/${token}/approve`).send({ isAdult: true, agree: true })).status).toBe(200);
    expect((await c.get("/api/auth/me")).body.student.aiLocked).toBe(false);
    // single use
    expect((await p.post(`/api/consent/parent/${token}/approve`).send({ isAdult: true, agree: true })).status).not.toBe(200);
    expect((await p.get(`/api/consent/parent/${"0".repeat(48)}`)).status).toBeGreaterThanOrEqual(400);
  });
});

describe("Preferences and date of birth", () => {
  it("switches the AI persona and rejects unknown values", async () => {
    const { c } = await signedInClient();
    const ok = await c.patch("/api/user/preferences").send({ persona: "fun" });
    expect(ok.status).toBe(200);
    expect(ok.body.student.persona).toBe("fun");
    expect((await c.get("/api/auth/me")).body.student.persona).toBe("fun");
    expect((await c.patch("/api/user/preferences").send({ persona: "evil" })).status).toBe(400);
  });

  it("legacy account without DOB can set it once; minors then need a parent", async () => {
    const { c, body } = await signedInClient();
    await User.updateOne({ email: body.email }, { $unset: { dateOfBirth: 1 } });
    expect((await c.get("/api/auth/me")).body.student.hasDateOfBirth).toBe(false);
    const year = new Date().getFullYear() - 15;
    const noParent = await c.patch("/api/user/date-of-birth").send({ dateOfBirth: `${year}-02-02` });
    expect(noParent.status).toBe(400);
    const ok = await c.patch("/api/user/date-of-birth").send({ dateOfBirth: `${year}-02-02`, parentEmail: uniqueEmail("p") });
    expect(ok.status).toBe(200);
    expect(ok.body.student.aiLocked).toBe(true);
    expect((await c.patch("/api/user/date-of-birth").send({ dateOfBirth: "1999-01-01" })).status).toBe(409);
  });
});

describe("Session length", () => {
  it("sessions last 15 days", async () => {
    const { body } = await signedInClient();
    const res = await client().post("/api/auth/login").send({ email: body.email, password: body.password });
    const cookie = res.headers["set-cookie"].join(";");
    const maxAge = Number(/Max-Age=(\d+)/i.exec(cookie)[1]);
    expect(maxAge).toBe(15 * 24 * 60 * 60);
  });
});
