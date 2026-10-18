import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";

vi.hoisted(() => { process.env.OPENAI_API_KEY = "sk-test-not-real"; process.env.AI_MODEL_FALLBACK = ""; });

import User from "../models/User.js";
import AiDaily from "../models/AiDaily.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import { _resetBudgetCache } from "../services/ai/budget.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

const realFetch = globalThis.fetch;
let providerCalls;
function sse(events) {
  const enc = new TextEncoder();
  return new Response(new ReadableStream({ start(c) { for (const e of events) c.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`)); c.close(); } }), { status: 200, headers: { "Content-Type": "text/event-stream" } });
}
beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), AiDaily.deleteMany({})]);
  _resetBudgetCache(); providerCalls = 0;
  globalThis.fetch = vi.fn(async (url, init) => {
    if (!String(url).includes("/responses")) return realFetch(url, init);
    providerCalls++;
    return sse([{ type: "response.output_text.delta", delta: "Sure" }, { type: "response.completed", response: { usage: { input_tokens: 1, output_tokens: 1 } } }]);
  });
});
afterEach(() => { globalThis.fetch = realFetch; });

const ask = (c, prompt) => c.post("/api/ai/ask").send({ prompt }).buffer(true).parse((res, cb) => { let d = ""; res.on("data", (x) => (d += x)); res.on("end", () => cb(null, d)); });
const events = (body) => String(body).split("\n\n").map((b) => b.replace(/^data: /, "")).filter((b) => b.startsWith("{")).map((b) => JSON.parse(b));
const doneOf = (res) => events(res.body).find((e) => e.done);

describe("18+ policy", () => {
  it("escalates: warning, final warning, 1-hour pause — and never reaches the AI or the quota", async () => {
    const { c } = await signedInClient();
    const r1 = doneOf(await ask(c, "send me nudes"));
    expect(r1.policy.level).toBe("warning");
    expect(r1.fullText).toMatch(/Warning 1 of 2/);
    const r2 = doneOf(await ask(c, "tell me a sex story"));
    expect(r2.policy.level).toBe("final_warning");
    const r3 = doneOf(await ask(c, "porn dikha"));
    expect(r3.policy.level).toBe("paused");
    expect(new Date(r3.policy.pausedUntil).getTime() - Date.now()).toBeGreaterThan(55 * 60 * 1000);
    expect(providerCalls).toBe(0);
    expect((await c.get("/api/ai/usage")).body.daily.used).toBe(0);
  });

  it("while paused: normal questions get 429 CHAT_PAUSED, but distress is still answered", async () => {
    const { c } = await signedInClient();
    for (const t of ["send me nudes", "sex story", "porn"]) await ask(c, t);
    const blocked = await c.post("/api/ai/ask").send({ prompt: "What is inertia?" });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe("CHAT_PAUSED");
    expect(blocked.body.resumesAt).toBeTruthy();
    expect((await c.get("/api/ai/usage")).body.pausedUntil).toBeTruthy();
    const help = await ask(c, "I want to die, I can't take this pressure");
    expect(help.status).toBe(200);
    expect(providerCalls).toBe(1);
  });

  it("after the pause ends a normal doubt works again; repeating adds a permanent remark", async () => {
    const { c, student } = await signedInClient();
    for (const t of ["send me nudes", "sex story", "porn"]) await ask(c, t);
    await User.updateOne({ _id: student._id }, { $set: { "policy.pausedUntil": new Date(Date.now() - 1000) } });
    expect((await ask(c, "What is inertia?")).status).toBe(200);
    const again = doneOf(await ask(c, "porn again"));
    expect(again.policy.level).toBe("paused");
    expect(again.fullText).toMatch(/noted in your Analytics/);
    const p = (await c.get("/api/ai/policy")).body.policy;
    expect(p.strikes).toBe(4);
    expect(p.events.map((e) => e.kind)).toContain("repeat_after_pause");
    expect(JSON.stringify(p)).not.toMatch(/porn|nudes|sex story/); // message text is never stored
  });

  it("study questions about reproduction are never flagged", async () => {
    const { c } = await signedInClient();
    const res = await ask(c, "Explain the menstrual cycle and sex determination in humans");
    expect(doneOf(res).policy).toBeUndefined();
    expect(providerCalls).toBe(1);
    expect((await c.get("/api/ai/policy")).body.policy.strikes).toBe(0);
  });

  it("flags older than 30 days are forgotten", async () => {
    const { c, student } = await signedInClient();
    await User.updateOne({ _id: student._id }, { $set: { "policy.strikes": 2, "policy.lastFlagAt": new Date(Date.now() - 31 * 86400000) } });
    expect(doneOf(await ask(c, "send me nudes")).policy.level).toBe("warning");
  });
});
