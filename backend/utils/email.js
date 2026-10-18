// ============================================================
//  JNEET+ AI — utils/email.js
//  normalizeEmail(): one canonical form per real mailbox, so one
//  person can't farm free-tier quota by signing up as
//  john.doe@gmail.com, johndoe@gmail.com, john+1@gmail.com, ...
//
//  Rules (conservative — only providers where the behaviour is
//  documented):
//    - always: trim + lowercase
//    - gmail.com / googlemail.com: remove dots in the local part,
//      drop everything after "+", googlemail.com -> gmail.com
//    - outlook/hotmail/live/msn, icloud/me/mac, proton: drop "+tag"
//  Everything else is only trimmed + lowercased (a "+" can be a
//  legitimate part of the address on other providers).
//
//  The ORIGINAL (typed) address is still what we store in `email`
//  and send mail to; the normalized form is only used to detect
//  duplicates.
// ============================================================

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);
const PLUS_TAG_DOMAINS = new Set([
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me",
]);

export function normalizeEmail(raw) {
  if (typeof raw !== "string") return "";
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return email;

  let local = email.slice(0, at);
  let domain = email.slice(at + 1);

  if (GMAIL_DOMAINS.has(domain)) {
    local = local.split("+")[0].replace(/\./g, "");
    domain = "gmail.com";
  } else if (PLUS_TAG_DOMAINS.has(domain)) {
    local = local.split("+")[0];
  }

  return `${local}@${domain}`;
}

// Masks an address for logs / UI: jo****@gmail.com
export function maskEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(2, local.length - visible.length))}@${domain}`;
}
