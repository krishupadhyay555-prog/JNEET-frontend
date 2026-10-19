// Mirrors the backend password policy (8+ chars, a letter, a number; the
// server additionally rejects very common passwords).
export function passwordChecks(pw) {
  return [
    { id: "len",    ok: pw.length >= 8,      label: "At least 8 characters" },
    { id: "letter", ok: /[A-Za-z]/.test(pw), label: "A letter" },
    { id: "num",    ok: /[0-9]/.test(pw),    label: "A number" },
  ];
}

export function passwordMeetsPolicy(pw) {
  return pw.length <= 128 && passwordChecks(pw).every((c) => c.ok);
}
