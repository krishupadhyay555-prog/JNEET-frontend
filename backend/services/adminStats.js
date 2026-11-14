// ============================================================
//  JNEET+ AI — services/adminStats.js
//  Live numbers for the founder's admin dashboard. Everything is
//  counted straight from MongoDB at request time (nothing estimated,
//  nothing cached) and returned as aggregates. The only per-person rows
//  are "recent signups" and "flagged payments", and those show a first
//  name and a masked email — never passwords, phone, DOB or chat text.
//  All "day" buckets use India time (Asia/Kolkata).
// ============================================================

import User from "../models/User.js";
import Payment from "../models/Payment.js";
import TestAttempt from "../models/TestAttempt.js";
import Question from "../models/Question.js";
import Chat from "../models/Chat.js";
import AiUsage from "../models/AiUsage.js";
import { listOneShots } from "./oneshot.js";
import { istDayKey } from "./ai/quota.js";

const DAY = 24 * 60 * 60 * 1000;
const TZ = "Asia/Kolkata";

export function maskEmail(email) {
  const [user = "", domain = ""] = String(email || "").split("@");
  if (!domain) return "—";
  const head = user.slice(0, Math.min(2, user.length));
  return `${head}${"*".repeat(Math.max(1, Math.min(6, user.length - head.length)))}@${domain}`;
}

const firstName = (name) => (String(name || "").trim().split(/\s+/)[0] || "—").slice(0, 20);

// Last N India-time days as YYYY-MM-DD keys, oldest first.
function lastDays(n, now) {
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) out.push(istDayKey(new Date(now.getTime() - i * DAY)));
  return out;
}

const countBy = (rows) => Object.fromEntries(rows.map((r) => [r._id ?? "unknown", r.n]));

export async function buildAdminStats(now = new Date()) {
  const since = (days) => new Date(now.getTime() - days * DAY);
  const todayKey = istDayKey(now);
  // Real students only: email verified, not deleted/deactivated.
  const real = { isEmailVerified: true, deletedAt: null, isActive: true };
  const paidNow = { ...real, plan: { $in: ["pro", "elite"] }, $or: [{ planExpiresAt: null }, { planExpiresAt: { $gt: now } }] };

  const [
    totalStudents, unverified, deleted,
    newToday, new7, new30,
    byExam, byAge, byParent, byTarget,
    dau, wau, mau,
    paidByTier, expiring7,
    signupDaily,
    lockedNow, pausedNow,
    recentSignups,
  ] = await Promise.all([
    User.countDocuments(real),
    User.countDocuments({ isEmailVerified: false, deletedAt: null }),
    User.countDocuments({ deletedAt: { $ne: null } }),
    User.countDocuments({ ...real, createdAt: { $gte: since(1) } }),
    User.countDocuments({ ...real, createdAt: { $gte: since(7) } }),
    User.countDocuments({ ...real, createdAt: { $gte: since(30) } }),
    User.aggregate([{ $match: real }, { $group: { _id: "$examMode", n: { $sum: 1 } } }]),
    User.aggregate([{ $match: real }, { $group: { _id: "$consent.ageGroup", n: { $sum: 1 } } }]),
    User.aggregate([{ $match: { ...real, "consent.ageGroup": "minor" } }, { $group: { _id: "$consent.parentStatus", n: { $sum: 1 } } }]),
    User.aggregate([{ $match: real }, { $group: { _id: "$targetExam", n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 8 }]),
    User.countDocuments({ ...real, lastLogin: { $gte: since(1) } }),
    User.countDocuments({ ...real, lastLogin: { $gte: since(7) } }),
    User.countDocuments({ ...real, lastLogin: { $gte: since(30) } }),
    User.aggregate([{ $match: paidNow }, { $group: { _id: { tier: "$plan", exam: "$examMode" }, n: { $sum: 1 } } }]),
    User.countDocuments({ ...paidNow, planExpiresAt: { $gt: now, $lte: new Date(now.getTime() + 7 * DAY) } }),
    User.aggregate([
      { $match: { ...real, createdAt: { $gte: since(30) } } },
      { $group: { _id: { day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, exam: "$examMode" }, n: { $sum: 1 } } },
    ]),
    User.countDocuments({ ...real, "policy.locked": true }),
    User.countDocuments({ ...real, "policy.pausedUntil": { $gt: now } }),
    User.find(real).sort({ createdAt: -1 }).limit(12)
      .select("name email examMode targetExam consent.ageGroup plan planExpiresAt createdAt lastLogin").lean(),
  ]);

  const [
    payTotals, pay30, payToday, payByPlan, payDaily, payStatus, flagged,
  ] = await Promise.all([
    Payment.aggregate([{ $match: { status: "paid", appliedAt: { $ne: null } } }, { $group: { _id: null, n: { $sum: 1 }, paise: { $sum: "$amount" }, buyers: { $addToSet: "$userId" } } }]),
    Payment.aggregate([{ $match: { status: "paid", appliedAt: { $ne: null }, paidAt: { $gte: since(30) } } }, { $group: { _id: null, n: { $sum: 1 }, paise: { $sum: "$amount" } } }]),
    Payment.aggregate([
      { $match: { status: "paid", appliedAt: { $ne: null }, paidAt: { $gte: since(2) } } },
      { $project: { amount: 1, day: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt", timezone: TZ } } } },
      { $match: { day: todayKey } },
      { $group: { _id: null, n: { $sum: 1 }, paise: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([{ $match: { status: "paid", appliedAt: { $ne: null } } }, { $group: { _id: "$planId", n: { $sum: 1 }, paise: { $sum: "$amount" } } }]),
    Payment.aggregate([
      { $match: { status: "paid", appliedAt: { $ne: null }, paidAt: { $gte: since(30) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt", timezone: TZ } }, n: { $sum: 1 }, paise: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Payment.find({ flag: { $ne: null } }).sort({ updatedAt: -1 }).limit(10)
      .select("orderId paymentId planId amount flag status createdAt userId").lean(),
  ]);

  const [
    attemptsTotal, attempts7, attemptsByMode, questionsByExam, chats, aiToday, ai30,
  ] = await Promise.all([
    TestAttempt.countDocuments({ status: "submitted" }),
    TestAttempt.countDocuments({ status: "submitted", submittedAt: { $gte: since(7) } }),
    TestAttempt.aggregate([{ $match: { status: "submitted" } }, { $group: { _id: { mode: "$mode", exam: "$examMode" }, n: { $sum: 1 } } }]),
    Question.aggregate([{ $group: { _id: { exam: "$examMode", type: "$type", level: "$level" }, n: { $sum: 1 } } }]),
    Chat.aggregate([{ $project: { s: { $size: { $ifNull: ["$sessions", []] } } } }, { $group: { _id: null, chats: { $sum: "$s" }, students: { $sum: 1 } } }]),
    AiUsage.aggregate([{ $match: { day: todayKey } }, { $group: { _id: null, n: { $sum: 1 }, inr: { $sum: { $ifNull: ["$costInr", 0] } }, students: { $addToSet: "$userId" } } }]),
    AiUsage.aggregate([{ $match: { createdAt: { $gte: since(30) } } }, { $group: { _id: null, n: { $sum: 1 }, inr: { $sum: { $ifNull: ["$costInr", 0] } } } }]),
  ]);

  // Signups per day (last 30, India time), split NEET / JEE, zeros filled.
  const days = lastDays(30, now);
  const signupMap = new Map(days.map((d) => [d, { day: d, NEET: 0, JEE: 0 }]));
  for (const r of signupDaily) {
    const row = signupMap.get(r._id.day);
    if (row && (r._id.exam === "NEET" || r._id.exam === "JEE")) row[r._id.exam] += r.n;
  }
  const payMap = new Map(payDaily.map((r) => [r._id, r]));

  const paid = { pro: { NEET: 0, JEE: 0 }, elite: { NEET: 0, JEE: 0 } };
  for (const r of paidByTier) if (paid[r._id.tier] && r._id.exam) paid[r._id.tier][r._id.exam] = r.n;
  const paidStudents = paid.pro.NEET + paid.pro.JEE + paid.elite.NEET + paid.elite.JEE;

  const exam = countBy(byExam);
  const t = payTotals[0] ?? { n: 0, paise: 0, buyers: [] };

  const qb = { NEET: { mcq: 0, fill_blank: 0 }, JEE: { mcq: 0, fill_blank: 0, advanced: 0 } };
  for (const r of questionsByExam) {
    const e = qb[r._id.exam];
    if (!e) continue;
    if (r._id.level === "advanced") e.advanced = (e.advanced ?? 0) + r.n;
    else e[r._id.type === "fill_blank" ? "fill_blank" : "mcq"] += r.n;
  }
  const modes = { NEET: { test: 0, revision: 0 }, JEE: { test: 0, revision: 0 } };
  for (const r of attemptsByMode) if (modes[r._id.exam]) modes[r._id.exam][r._id.mode === "test" ? "test" : "revision"] += r.n;

  return {
    generatedAt: now.toISOString(),
    students: {
      total: totalStudents,
      neet: exam.NEET ?? 0,
      jee: exam.JEE ?? 0,
      newToday, new7, new30,
      unverifiedSignups: unverified,
      deletedAccounts: deleted,
      adults: countBy(byAge).adult ?? 0,
      minors: countBy(byAge).minor ?? 0,
      minorsParent: countBy(byParent),
      targetExams: byTarget.map((r) => ({ target: r._id ?? "Not set", n: r.n })),
      activeToday: dau, active7: wau, active30: mau,
    },
    plans: {
      paidStudents,
      free: Math.max(0, totalStudents - paidStudents),
      paid,
      expiringIn7Days: expiring7,
      conversionPct: totalStudents ? Math.round((paidStudents / totalStudents) * 1000) / 10 : 0,
    },
    revenue: {
      allTime: { payments: t.n, rupees: t.paise / 100, buyers: t.buyers.length },
      last30: { payments: pay30[0]?.n ?? 0, rupees: (pay30[0]?.paise ?? 0) / 100 },
      today: { payments: payToday[0]?.n ?? 0, rupees: (payToday[0]?.paise ?? 0) / 100 },
      byPlan: payByPlan.map((r) => ({ planId: r._id, payments: r.n, rupees: r.paise / 100 })).sort((a, b) => b.rupees - a.rupees),
      statusCounts: countBy(payStatus),
      flagged: flagged.map((p) => ({
        orderId: p.orderId, paymentId: p.paymentId, planId: p.planId, rupees: p.amount / 100,
        flag: p.flag, status: p.status, createdAt: p.createdAt,
      })),
    },
    daily: days.map((d) => ({
      day: d,
      neetSignups: signupMap.get(d).NEET,
      jeeSignups: signupMap.get(d).JEE,
      payments: payMap.get(d)?.n ?? 0,
      rupees: (payMap.get(d)?.paise ?? 0) / 100,
    })),
    learning: {
      attemptsTotal, attempts7, attemptsByExam: modes,
      chats: chats[0]?.chats ?? 0,
      studentsWhoChatted: chats[0]?.students ?? 0,
      aiToday: { answers: aiToday[0]?.n ?? 0, students: aiToday[0]?.students?.length ?? 0, costInr: Math.round((aiToday[0]?.inr ?? 0) * 100) / 100 },
      ai30: { answers: ai30[0]?.n ?? 0, costInr: Math.round((ai30[0]?.inr ?? 0) * 100) / 100 },
      questionBank: qb,
      oneshots: { NEET: listOneShots("NEET").length, JEE: listOneShots("JEE").length },
    },
    safety: { lockedNow, pausedNow },
    recentSignups: recentSignups.map((u) => ({
      firstName: firstName(u.name),
      email: maskEmail(u.email),
      exam: u.examMode,
      target: u.targetExam ?? null,
      age: u.consent?.ageGroup ?? null,
      plan: u.plan && u.plan !== "free" && (!u.planExpiresAt || new Date(u.planExpiresAt) > now) ? u.plan : "free",
      joinedAt: u.createdAt,
      lastLogin: u.lastLogin ?? null,
    })),
  };
}
