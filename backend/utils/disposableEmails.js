// ============================================================
//  JNEET+ AI — utils/disposableEmails.js  (NEW)
//  Blocks the most common disposable/temporary email providers at
//  registration. This isn't about being exhaustive (new disposable
//  services appear constantly) — it's about stopping the obvious,
//  extremely common ones that would otherwise let someone create
//  throwaway accounts to abuse trials/limits or dodge accountability.
//  A short, high-value blocklist like this is exactly what most
//  production signup forms use — full disposable-email-detection
//  APIs exist but are unnecessary overhead at this stage.
// ============================================================

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "getnada.com",
  "sharklasers.com",
  "maildrop.cc",
  "mintemail.com",
  "dispostable.com",
]);

export function isDisposableEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}