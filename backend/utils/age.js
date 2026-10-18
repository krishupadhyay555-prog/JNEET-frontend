// ============================================================
//  JNEET+ AI — utils/age.js
//  Age helpers used by signup (DOB age gate) and parental consent.
// ============================================================

export const MIN_AGE   = 13; // JNEET+ is for students 13+
export const ADULT_AGE = 18; // DPDP Act 2023: under 18 = child

// Parses "YYYY-MM-DD" (or a Date) into a UTC-midnight Date.
// Returns null for anything invalid (impossible dates like 2010-02-31,
// future dates, or implausibly old dates).
export function parseDob(input, now = new Date()) {
  let y, m, d;

  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    y = input.getUTCFullYear(); m = input.getUTCMonth() + 1; d = input.getUTCDate();
  } else if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
    if (!match) return null;
    y = Number(match[1]); m = Number(match[2]); d = Number(match[3]);
  } else {
    return null;
  }

  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null; // e.g. 2010-02-31 rolled over
  }
  if (dt.getTime() > now.getTime()) return null;           // future
  if (y < now.getUTCFullYear() - 100) return null;         // > 100 years old

  return dt;
}

// Completed years at `now`.
export function calcAge(dob, now = new Date()) {
  const birth = parseDob(dob, now);
  if (!birth) return null;

  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function isMinor(dob, now = new Date()) {
  const age = calcAge(dob, now);
  return age !== null && age < ADULT_AGE;
}
