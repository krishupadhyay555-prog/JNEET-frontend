// Re-accepting updated Terms / Privacy (founder decision 24 Nov 2026).
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import User from "../models/User.js";
import { clearMailbox } from "./mailbox.js";
import { connectTestDb, disconnectTestDb, signedInClient, client } from "./helpers.js";
import { TERMS_VERSION, PRIVACY_VERSION } from "../config/legal.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => { await User.deleteMany({}); clearMailbox(); });

describe("terms update", () => {
  it("a new student is on the current version (no prompt)", async () => {
    const { c } = await signedInClient();
    expect((await c.get("/api/auth/me")).body.student.termsUpdate).toBe(false);
  });

  it("an older acceptance → prompt; accept → current version, prompt gone", async () => {
    const { c, body } = await signedInClient();
    await User.updateOne({ email: body.email }, { $set: { "consent.termsVersion": "2026-11-14", "consent.privacyVersion": "2026-11-14" } });
    expect((await c.get("/api/auth/me")).body.student.termsUpdate).toBe(true);
    const r = await c.post("/api/user/accept-terms");
    expect(r.status).toBe(200);
    expect(r.body.student.termsUpdate).toBe(false);
    const u = await User.findOne({ email: body.email }).lean();
    expect(u.consent).toMatchObject({ termsVersion: TERMS_VERSION, privacyVersion: PRIVACY_VERSION });
  });

  it("needs a session", async () => {
    expect((await client().post("/api/user/accept-terms")).status).toBe(401);
  });
});
