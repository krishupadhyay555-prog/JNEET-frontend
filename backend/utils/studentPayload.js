// ============================================================
//  JNEET+ AI — utils/studentPayload.js
//  The ONE shape of "student" every endpoint returns. Previously the
//  same object literal was copy-pasted in five places and one copy
//  returned a field (wmsData) that no longer exists.
// ============================================================

import { env } from "../config/env.js";
import { getTargetExamOption } from "../config/targetExams.js";
import { effectivePlan } from "./plan.js";

// True when the AI mentor must stay locked for this user: an under-18
// whose parent hasn't approved yet (or has withdrawn approval).
export function isAiLocked(user) {
  if (!env.REQUIRE_PARENT_CONSENT_FOR_AI) return false;
  const c = user?.consent;
  if (!c || c.ageGroup !== "minor") return false;
  return c.parentStatus !== "granted";
}

export function toStudent(user) {
  const c = user.consent ?? {};
  // A target that no longer exists (e.g. a removed JEE Advanced date) is
  // reported as "not chosen", so the app asks the student to pick again.
  const targetValid = !!(user.targetExam && getTargetExamOption(user.targetExam, user.examMode));
  return {
    _id:        user._id,
    name:       user.name,
    email:      user.email,
    examMode:   user.examMode,
    targetExam: targetValid ? user.targetExam : null,
    targetExamPromptDismissed: targetValid || (!user.targetExam && !!user.targetExamPromptDismissed),
    plan:       effectivePlan(user),
    planExpiresAt: effectivePlan(user) === "free" ? null : (user.planExpiresAt ?? null),
    persona:    user.persona ?? "mentor",
    hasDateOfBirth: !!user.dateOfBirth,
    consent: {
      ageGroup:     c.ageGroup ?? null,
      parentStatus: c.parentStatus ?? "not_required",
      parentEmailMasked: c.parentEmail ? maskParent(c.parentEmail) : null,
    },
    aiLocked:   isAiLocked(user),
    lastLogin:  user.lastLogin,
    createdAt:  user.createdAt,
  };
}

function maskParent(email) {
  const [local, domain] = String(email).split("@");
  if (!domain) return null;
  return `${local.slice(0, 2)}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}
