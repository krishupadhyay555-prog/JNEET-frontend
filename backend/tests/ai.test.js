import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";

vi.hoisted(() => {
  process.env.OPENAI_API_KEY = "sk-test-not-real";
  process.env.AI_MODEL_FALLBACK = "";
});

import User from "../models/User.js";
import AiUsage from "../models/AiUsage.js";
import AiDaily from "../models/AiDaily.js";
import { mailbox, clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient, client, registerBody, uniqueEmail } from "./helpers.js";
import { reserveDoubt } from "../services/ai/quota.js";
import { _resetBudgetCache } from "../services/ai/budget.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const realFetch = globalThis.fetch;
let calls;
let mode; // "ok" | "fail"

function sse(events) {
  const enc = new TextEncoder();
  return new Response(new ReadableStream({
    start(c) { for (const e of events) c.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`)); c.close(); },
  }), { status: 200, headers: { "Content-Type": "text/event-stream" } });
}

function stubOpenAI() {
  globalThis.fetch = vi.fn(async (url, init) => {
    if (!String(url).includes("/responses")) return realFetch(url, init);
    const body = JSON.parse(init.body);
    calls.push(body);
    if (mode === "fail") return new Response(JSON.stringify({ error: { message: "boom" } }), { status: 500 });
    return sse([
      { type: "response.output_text.delta", delta: "Hello " },
      { type: "response.output_text.delta", delta: "student" },
      { type: "response.completed", response: { usage: { input_tokens: 100, output_tokens: 50 } } },
    ]);
  });
}

function parseSse(text) {
  return text.split("\n\n").map((b) => b.replace(/^data: /, "")).filter((b) => b.startsWith("{")).map((b) => JSON.parse(b));
}

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), AiUsage.deleteMany({}), AiDaily.deleteMany({})]);
  clearMailbox(); _resetBudgetCache(); calls = []; mode = "ok"; stubOpenAI();
});
afterEach(() => { globalThis.fetch = realFetch; });

const ask = (c, prompt, extra = {}) => c.post("/api/ai/ask").send({ prompt, ...extra }).buffer(true).parse((res, cb) => {
  let d = ""; res.on("data", (x) => (d += x)); res.on("end", () => cb(null, d));
});

describe("POST /api/ai/ask", () => {
  it("requires login", async () => {
    expect((await client().post("/api/ai/ask").send({ prompt: "hi" })).status).toBe(401);
  });

  it("streams tokens then a done event with remaining quota; ledger has no text", async () => {
    const { c } = await signedInClient();
    const res = await ask(c, "Explain Newton's second law");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/event-stream/);
    const evts = parseSse(res.body);
    expect(evts.filter((e) => e.token).map((e) => e.token).join("")).toBe("Hello student");
    const done = evts.find((e) => e.done);
    expect(done.fullText).toBe("Hello student");
    expect(done.usage).toMatchObject({ limit: 5, remaining: 4 });
    const row = await AiUsage.findOne().lean();
    expect(row.status).toBe("ok");
    expect(row.inputTokens).toBe(100);
    expect(JSON.stringify(row)).not.toContain("Newton");
  });

  it("sends mentor instructions, store:false and a hashed safety identifier", async () => {
    const { c, student } = await signedInClient();
    await ask(c, "What is osmosis?");
    const body = calls[0];
    expect(body.store).toBe(false);
    expect(body.instructions).toContain("JNEET+ AI Mentor");
    expect(body.safety_identifier).toBeTruthy();
    expect(body.safety_identifier).not.toContain(student.email);
    expect(JSON.stringify(body)).not.toContain(student.email);
  });

  it("enforces the free daily limit (5) with a clear 429", async () => {
    const { c } = await signedInClient();
    for (let i = 0; i < 5; i++) expect((await ask(c, `question ${i}`)).status).toBe(200);
    const sixth = await c.post("/api/ai/ask").send({ prompt: "one more" });
    expect(sixth.status).toBe(429);
    expect(sixth.body.code).toBe("DAILY_LIMIT");
    expect(sixth.body.limit).toBe(5);
    expect(sixth.body.resetsAt).toBeTruthy();
    expect(calls.length).toBe(5); // 6th never reached the provider
    const usage = await c.get("/api/ai/usage");
    expect(usage.body).toMatchObject({ daily: { used: 5, remaining: 0 } });
  });

  it("never blocks or counts a message that signals distress", async () => {
    const { c } = await signedInClient();
    for (let i = 0; i < 5; i++) await ask(c, `question ${i}`);
    const res = await ask(c, "I want to die, I can't take this exam pressure");
    expect(res.status).toBe(200);
    expect(calls.at(-1).instructions).toMatch(/distress|crisis|safety|helpline/i);
    const usage = await c.get("/api/ai/usage");
    expect(usage.body.daily.used).toBe(5);
  });

  it("gives the doubt back when the provider fails, and shows a friendly error", async () => {
    mode = "fail";
    const { c } = await signedInClient();
    const res = await ask(c, "any question");
    const evts = parseSse(res.body);
    const err = evts.find((e) => e.error);
    expect(err).toBeTruthy();
    expect(err.error).not.toMatch(/boom|500|openai/i);
    expect((await c.get("/api/ai/usage")).body.daily.used).toBe(0);
    expect((await AiUsage.findOne().lean()).status).toBe("error");
  });

  // Uses the positional "sessions.$" projection, which the local FerretDB stand-in
  // does not implement; real MongoDB (CI) does.
  it.skipIf(!!process.env.TEST_MONGO_URI)("includes earlier turns of the same chat as context", async () => {
    const { c } = await signedInClient();
    const s = await c.post("/api/chat/session/new");
    const saved = await c.post("/api/chat/message/save").send({
      sessionId: s.body.sessionId,
      userMessage: { content: "What is inertia?" },
      aiMessage: { content: "Inertia is resistance to change in motion." },
    });
    expect(saved.status).toBe(200);
    await ask(c, "and what about momentum?", { sessionId: s.body.sessionId });
    const input = calls[0].input;
    expect(JSON.stringify(input)).toContain("What is inertia?");
    expect(input.at(-1)).toMatchObject({ role: "user", content: "and what about momentum?" });
  });

  it("rejects empty or oversized prompts", async () => {
    const { c } = await signedInClient();
    expect((await c.post("/api/ai/ask").send({ prompt: "" })).status).toBe(400);
    expect((await c.post("/api/ai/ask").send({ prompt: "x".repeat(5001) })).status).toBe(400);
  });

  it("keeps the AI locked for a minor until the parent approves", async () => {
    const c = client();
    const year = new Date().getFullYear() - 15;
    const parentEmail = uniqueEmail("parent");
    const body = registerBody({ dateOfBirth: `${year}-03-03`, parentEmail });
    await c.post("/api/auth/register").send(body);
    await c.post("/api/auth/verify-email").send({ email: body.email, otp: mailbox.verify.get(body.email) });
    const locked = await c.post("/api/ai/ask").send({ prompt: "hi there" });
    expect(locked.status).toBe(403);
    expect(locked.body.code).toBe("PARENT_CONSENT_REQUIRED");
    expect(calls.length).toBe(0);
    const token = mailbox.parent.get(parentEmail).split("/").pop();
    await client().post(`/api/consent/parent/${token}/approve`).send({ isAdult: true, agree: true });
    expect((await ask(c, "hi there")).status).toBe(200);
  });
});

describe("quota", () => {
  it("allows exactly the plan limit, then refuses (sequential)", async () => {
    const { student } = await signedInClient();
    const results = [];
    for (let i = 0; i < 8; i++) results.push(await reserveDoubt(student._id, "free"));
    expect(results.filter((r) => r.ok).length).toBe(5);
    expect(results[4].remaining).toBe(0);
    await results[4].release();
    expect((await reserveDoubt(student._id, "free")).ok).toBe(true);
  });

  // Needs a real MongoDB (atomic findOneAndUpdate). The local FerretDB/SQLite
  // stand-in is not atomic under concurrency, so this only runs in CI.
  it.skipIf(!!process.env.TEST_MONGO_URI)("20 concurrent requests never exceed the limit", async () => {
    const { student } = await signedInClient();
    const results = await Promise.all(Array.from({ length: 20 }, () => reserveDoubt(student._id, "free")));
    expect(results.filter((r) => r.ok).length).toBe(5);
  });
});
