import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";

vi.hoisted(() => { process.env.OPENAI_API_KEY = "sk-test-not-real"; process.env.AI_MODEL_FALLBACK = ""; });

import User from "../models/User.js";
import AiDaily from "../models/AiDaily.js";
import { connectTestDb, disconnectTestDb, signedInClient } from "./helpers.js";
import { mailbox, clearMailbox } from "./mailbox.js";
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
  _resetBudgetCache(); providerCalls = 0; clearMailbox();
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

const setConsent = (id, consent) => User.updateOne({ _id: id }, { $set: Object.fromEntries(Object.entries(consent).map(([k, v]) => [`consent.${k}`, v])) });
const strikeTo = async (c, n) => { for (let i = 0; i < n; i++) await ask(c, `send me nudes ${i}`); };
const unpause = (id) => User.updateOne({ _id: id }, { $set: { "policy.pausedUntil": new Date(Date.now() - 1000) } });

describe("chat-rules ladder", () => {
  it("escalates: warning, final warning, 1-hour pause — and never reaches the AI or the quota", async () => {
    const { c } = await signedInClient();
    const r1 = doneOf(await ask(c, "send me nudes"));
    expect(r1.policy.level).toBe("warning");
    expect(r1.fullText).toMatch(/Warning 1 of 2/);
    expect(r1.fullText).toMatch(/5th → chat lock/); // the student is told every next step
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
    await strikeTo(c, 3);
    const blocked = await c.post("/api/ai/ask").send({ prompt: "What is inertia?" });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe("CHAT_PAUSED");
    expect(blocked.body.resumesAt).toBeTruthy();
    expect((await c.get("/api/ai/usage")).body.pausedUntil).toBeTruthy();
    const help = await ask(c, "I want to die, I can't take this pressure");
    expect(help.status).toBe(200);
    expect(providerCalls).toBe(1);
  });

  it("4th strike: 24-hour pause + remark; 5th strike: chat locked", async () => {
    const { c, student } = await signedInClient();
    await strikeTo(c, 3);
    await unpause(student._id);
    expect((await ask(c, "What is inertia?")).status).toBe(200);
    const fourth = doneOf(await ask(c, "porn again"));
    expect(fourth.policy.level).toBe("paused_24h");
    expect(new Date(fourth.policy.pausedUntil).getTime() - Date.now()).toBeGreaterThan(23 * 3600 * 1000);
    expect(fourth.fullText).toMatch(/remark/);
    await unpause(student._id);
    const fifth = doneOf(await ask(c, "porn once more"));
    expect(fifth.policy.level).toBe("locked");
    expect(fifth.policy.locked).toBe(true);
    expect(fifth.policy.lock.unlockVia).toBe("self");

    const blocked = await c.post("/api/ai/ask").send({ prompt: "What is inertia?" });
    expect(blocked.status).toBe(403);
    expect(blocked.body.code).toBe("CHAT_LOCKED");
    expect((await c.get("/api/ai/usage")).body.chatLock.unlockVia).toBe("self");

    const p = (await c.get("/api/ai/policy")).body.policy;
    expect(p.strikes).toBe(5);
    expect(p.lock).toBeTruthy();
    expect(p.events.map((e) => e.kind)).toEqual(expect.arrayContaining(["paused_24h", "locked"]));
    expect(p.events[0].category).toBe("adult");
    expect(JSON.stringify(p)).not.toMatch(/porn|nudes|sex story/); // message text is never stored
  });

  it("locked: distress is still answered", async () => {
    const { c, student } = await signedInClient();
    await User.updateOne({ _id: student._id }, { $set: { "policy.locked": true, "policy.lockedAt": new Date(), "policy.strikes": 5, "policy.lastFlagAt": new Date() } });
    expect((await c.post("/api/ai/ask").send({ prompt: "Explain osmosis" })).status).toBe(403);
    const help = await ask(c, "mujhe marna chahta hoon, sab khatam kar dunga");
    expect(help.status).toBe(200);
    expect(providerCalls).toBe(1);
  });

  it("18+ student: unlock only after 24 hours and only with the rules ticked; one more strike locks again", async () => {
    const { c, student } = await signedInClient();
    await User.updateOne({ _id: student._id }, { $set: { "policy.locked": true, "policy.lockedAt": new Date(), "policy.strikes": 5, "policy.lastFlagAt": new Date() } });
    expect((await c.post("/api/ai/policy/unlock").send({})).body.code).toBe("ACK_REQUIRED");
    const early = await c.post("/api/ai/policy/unlock").send({ acknowledge: true });
    expect(early.status).toBe(409);
    expect(early.body.code).toBe("UNLOCK_NOT_YET");
    await User.updateOne({ _id: student._id }, { $set: { "policy.lockedAt": new Date(Date.now() - 25 * 3600 * 1000) } });
    const ok = await c.post("/api/ai/policy/unlock").send({ acknowledge: true });
    expect(ok.status).toBe(200);
    expect(ok.body.unlocked).toBe(true);
    expect((await ask(c, "What is inertia?")).status).toBe(200);
    const again = doneOf(await ask(c, "send me nudes"));
    expect(again.policy.level).toBe("locked");
    const p = (await c.get("/api/ai/policy")).body.policy;
    expect(p.events.map((e) => e.kind)).toContain("unlocked");
    expect(mailbox.safetyLock).toHaveLength(0); // adults' parents are never emailed
  });

  it("under-18 student: parent gets ONE email at lock; unlock needs the parent link; resend at most once a day", async () => {
    const { c, student } = await signedInClient();
    await setConsent(student._id, { ageGroup: "minor", parentEmail: "parent@example.com", parentStatus: "granted" });
    await User.updateOne({ _id: student._id }, { $set: { "policy.strikes": 4, "policy.lastFlagAt": new Date() } });
    const locked = doneOf(await ask(c, "send me nudes"));
    expect(locked.policy.level).toBe("locked");
    expect(locked.policy.lock.unlockVia).toBe("parent");
    expect(locked.fullText).toMatch(/parent\/guardian/);
    expect(mailbox.safetyLock).toHaveLength(1);
    expect(mailbox.safetyLock[0].to).toBe("parent@example.com");

    // The student cannot unlock it alone, and cannot spam the parent.
    const resend = await c.post("/api/ai/policy/unlock").send({ acknowledge: true });
    expect(resend.status).toBe(429);
    expect(resend.body.code).toBe("PARENT_ALREADY_EMAILED");
    expect(mailbox.safetyLock).toHaveLength(1);
    await User.updateOne({ _id: student._id }, { $set: { "policy.parentEmailedAt": new Date(Date.now() - 25 * 3600 * 1000) } });
    const second = await c.post("/api/ai/policy/unlock").send({ acknowledge: true });
    expect(second.body.sentToParent).toBe(true);
    expect(mailbox.safetyLock).toHaveLength(2);

    // Old link no longer works; the newest one does.
    const oldToken = mailbox.safetyLock[0].approveUrl.split("/").pop();
    const token = mailbox.safetyLock[1].approveUrl.split("/").pop();
    expect((await c.get(`/api/consent/unlock/${oldToken}`)).status).toBe(404);
    const desc = await c.get(`/api/consent/unlock/${token}`);
    expect(desc.body.state).toBe("ready");
    expect((await c.post(`/api/consent/unlock/${token}`).send({ isAdult: true })).status).toBe(400);
    const ok = await c.post(`/api/consent/unlock/${token}`).send({ isAdult: true, agree: true });
    expect(ok.status).toBe(200);
    expect((await ask(c, "What is inertia?")).status).toBe(200);
    expect((await c.get(`/api/consent/unlock/${token}`)).status).toBe(404); // single use
    const p = (await c.get("/api/ai/policy")).body.policy;
    expect(p.events.map((e) => e.kind)).toContain("unlocked_by_parent");
  });

  it("an expired parent link does not unlock", async () => {
    const { c, student } = await signedInClient();
    await setConsent(student._id, { ageGroup: "minor", parentEmail: "parent@example.com", parentStatus: "granted" });
    await User.updateOne({ _id: student._id }, { $set: { "policy.strikes": 4, "policy.lastFlagAt": new Date() } });
    await ask(c, "send me nudes");
    const token = mailbox.safetyLock.at(-1).approveUrl.split("/").pop();
    await User.updateOne({ _id: student._id }, { $set: { "policy.unlockTokenExpiresAt": new Date(Date.now() - 1000) } });
    expect((await c.get(`/api/consent/unlock/${token}`)).body.state).toBe("expired");
    expect((await c.post(`/api/consent/unlock/${token}`).send({ isAdult: true, agree: true })).status).toBe(410);
    expect((await c.post("/api/ai/ask").send({ prompt: "What is inertia?" })).status).toBe(403);
  });

  it("study questions about reproduction and maths are never flagged", async () => {
    const { c } = await signedInClient();
    for (const q of ["Explain the menstrual cycle and sex determination in humans", "Show that the sum equals 18 + 4√2"]) {
      expect(doneOf(await ask(c, q)).policy).toBeUndefined();
    }
    expect(providerCalls).toBe(2);
    expect((await c.get("/api/ai/policy")).body.policy.strikes).toBe(0);
  });

  it("gaali without the judge: polite refusal, NO strike, not counted", async () => {
    const { c } = await signedInClient();
    const r = doneOf(await ask(c, "tu madarchod hai"));
    expect(r.refused).toBe(true);
    expect(r.policy).toBeUndefined();
    expect(providerCalls).toBe(0);
    expect((await c.get("/api/ai/policy")).body.policy.strikes).toBe(0);
    expect((await c.get("/api/ai/usage")).body.daily.used).toBe(0);
  });

  it("flags older than 30 days are forgotten", async () => {
    const { c, student } = await signedInClient();
    await User.updateOne({ _id: student._id }, { $set: { "policy.strikes": 2, "policy.lastFlagAt": new Date(Date.now() - 31 * 86400000) } });
    expect(doneOf(await ask(c, "send me nudes")).policy.level).toBe("warning");
  });
});
