// Founder-only admin dashboard: hidden from everyone else, numbers are real.
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";

vi.hoisted(() => { process.env.ADMIN_EMAILS = "boss@example.com, Second.Admin@Example.com"; });

import User from "../models/User.js";
import Payment from "../models/Payment.js";
import { connectTestDb, disconnectTestDb, signedInClient, client } from "./helpers.js";
import { maskEmail } from "../services/adminStats.js";

vi.mock("../services/emailService.js", async (orig) => (await import("./mailbox.js")).mailMock(orig));

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => { await Promise.all([User.deleteMany({}), Payment.deleteMany({})]); });

const DAY = 86400000;

describe("admin dashboard", () => {
  it("is invisible to students and logged-out visitors", async () => {
    expect((await client().get("/api/admin/stats")).status).toBe(401);
    const { c, student } = await signedInClient();
    const r = await c.get("/api/admin/stats");
    expect(r.status).toBe(404);
    expect(JSON.stringify(r.body)).not.toMatch(/stats|students/);
    expect(student.isAdmin).toBeUndefined();
  });

  it("shows real counts to the admin (verified, active students only)", async () => {
    const { c } = await signedInClient({ email: "boss@example.com" });
    const admin = await User.findOne({ email: "boss@example.com" });
    await User.updateOne({ _id: admin._id }, { $set: { examMode: "JEE" } });
    // 3 more real students, 1 unverified, 1 deleted, 1 paid
    const base = { password: "Passw0rd!x", isEmailVerified: true, consent: { ageGroup: "adult" } };
    const [n1] = await User.create([
      { ...base, name: "Asha Rao", email: "asha@test.dev", examMode: "NEET", plan: "pro", planExpiresAt: new Date(Date.now() + 10 * DAY), lastLogin: new Date() },
      { ...base, name: "Ravi K", email: "ravi@test.dev", examMode: "NEET", consent: { ageGroup: "minor", parentStatus: "pending" } },
      { ...base, name: "Meera S", email: "meera@test.dev", examMode: "JEE", plan: "elite", planExpiresAt: new Date(Date.now() - DAY) }, // expired → free
      { ...base, name: "Unverified U", email: "u@test.dev", examMode: "JEE", isEmailVerified: false },
      { ...base, name: "Gone G", email: "g@test.dev", examMode: "JEE", deletedAt: new Date() },
    ]);
    await Payment.create({ userId: n1._id, payer: "student", planId: "pro_1m", tier: "pro", days: 30, amount: 19900, orderId: "order_ADMINTEST01", paymentId: "pay_ADMINTEST01", status: "paid", paidAt: new Date(), appliedAt: new Date() });

    const r = await c.get("/api/admin/stats");
    expect(r.status).toBe(200);
    expect(r.headers["cache-control"]).toBe("no-store");
    const s = r.body.stats;
    expect(s.students.total).toBe(4);            // admin + Asha + Ravi + Meera
    expect(s.students.neet).toBe(2);
    expect(s.students.jee).toBe(2);
    expect(s.students.unverifiedSignups).toBe(1);
    expect(s.students.deletedAccounts).toBe(1);
    expect(s.students.minors).toBe(1);
    expect(s.plans.paidStudents).toBe(1);        // Meera's pass expired
    expect(s.plans.paid.pro.NEET).toBe(1);
    expect(s.revenue.allTime).toEqual({ payments: 1, rupees: 199, buyers: 1 });
    expect(s.revenue.today.rupees).toBe(199);
    expect(s.daily).toHaveLength(30);
    expect(s.daily.at(-1).neetSignups + s.daily.at(-1).jeeSignups).toBe(4);
    const asha = s.recentSignups.find((x) => x.firstName === "Asha");
    expect(asha.email).toBe("as**@test.dev");
    expect(asha.plan).toBe("pro");
    expect(JSON.stringify(s)).not.toMatch(/password|Passw0rd|asha@test\.dev/);
  });

  it("admin emails are case-insensitive and the profile marks the admin", async () => {
    const { c, student } = await signedInClient({ email: "second.admin@example.com" });
    expect((await c.get("/api/admin/stats")).status).toBe(200);
    expect(student.isAdmin).toBe(true);
  });

  it("masks emails", () => {
    expect(maskEmail("krishna@gmail.com")).toBe("kr*****@gmail.com");
    expect(maskEmail("a@b.co")).toBe("a*@b.co");
    expect(maskEmail("bad")).toBe("—");
  });
});
