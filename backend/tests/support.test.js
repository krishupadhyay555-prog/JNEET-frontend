// Contact form, founder inbox, "download my data" and public stats.
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";

vi.hoisted(() => { process.env.ADMIN_EMAILS = "boss@example.com"; });

import User from "../models/User.js";
import SupportMessage from "../models/SupportMessage.js";
import { connectTestDb, disconnectTestDb, signedInClient, client } from "./helpers.js";
import { mailbox, clearMailbox } from "./mailbox.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => { await Promise.all([User.deleteMany({}), SupportMessage.deleteMany({})]); clearMailbox(); });

const msg = { name: "Asha Rao", email: "asha@example.com", topic: "payment", message: "I paid but my plan still shows Free." };

describe("contact form", () => {
  it("accepts a message without login, returns a reference, alerts founder and acks the sender", async () => {
    const r = await client().post("/api/support/contact").send(msg);
    expect(r.status).toBe(201);
    expect(r.body.ref).toMatch(/^JN-[A-Z2-9]{5}$/);
    expect(await SupportMessage.countDocuments()).toBe(1);
    expect(mailbox.alerts.filter((a) => a.area === "support")).toHaveLength(1);
    expect(mailbox.acks).toMatchObject([{ to: "asha@example.com", ref: r.body.ref }]);
  });

  it("validates input and caps 5 messages per email per day", async () => {
    expect((await client().post("/api/support/contact").send({ ...msg, message: "short" })).status).toBe(400);
    expect((await client().post("/api/support/contact").send({ ...msg, topic: "spam" })).status).toBe(400);
    expect((await client().post("/api/support/contact").send({ ...msg, extra: 1 })).status).toBe(400);
    for (let i = 0; i < 5; i++) await SupportMessage.create({ ref: `JN-AAAA${i}`, ...msg });
    expect((await client().post("/api/support/contact").send(msg)).status).toBe(429);
  });

  it("only the admin sees the inbox and can close messages", async () => {
    await client().post("/api/support/contact").send(msg);
    const s = await signedInClient();
    expect((await s.c.get("/api/admin/support")).status).toBe(404);
    const boss = await signedInClient({ email: "boss@example.com" });
    const list = await boss.c.get("/api/admin/support");
    expect(list.status).toBe(200);
    expect(list.body.items[0]).toMatchObject({ name: "Asha Rao", topic: "payment" });
    const id = list.body.items[0].id;
    expect((await boss.c.patch(`/api/admin/support/${id}`).send({ status: "closed" })).status).toBe(200);
    expect((await boss.c.get("/api/admin/support")).body.counts).toEqual({ open: 0, closed: 1 });
  });
});

describe("download my data", () => {
  it("returns a JSON attachment with no secrets", async () => {
    const s = await signedInClient();
    const r = await s.c.get("/api/user/export");
    expect(r.status).toBe(200);
    expect(r.headers["content-disposition"]).toMatch(/attachment; filename="jneet-my-data-/);
    const text = r.text;
    const data = JSON.parse(text);
    expect(data.account.email).toBe(s.body.email);
    expect(Array.isArray(data.testAttempts)).toBe(true);
    expect(text).not.toMatch(/"password"|OtpHash|TokenHash/);
    expect((await client().get("/api/user/export")).status).toBe(401);
  });
});

describe("public stats", () => {
  it("is public and returns counts", async () => {
    const r = await client().get("/api/public/stats");
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ success: true, exams: ["NEET UG", "JEE Main"] });
    expect(typeof r.body.questions).toBe("number");
    expect(r.body.oneshots).toBeGreaterThan(0);
    expect(r.body.pyqs).toBeGreaterThan(10000);   // official PYQs from content/pyq
  });
});
