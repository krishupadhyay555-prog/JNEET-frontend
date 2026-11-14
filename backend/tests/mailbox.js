// Captures the OTPs / links our (mocked) email service "sends", so tests
// can complete the real verify-email → login flows.
export const mailbox = { verify: new Map(), reset: new Map(), login: new Map(), parent: new Map(), safetyLock: [], receipts: [], alerts: [] };
export function clearMailbox() {
  for (const m of Object.values(mailbox)) (Array.isArray(m) ? m.splice(0) : m.clear());
}
export const mailMock = async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isEmailConfigured: () => true,
    sendVerificationOtp: async (to, otp) => { mailbox.verify.set(to, otp); return { ok: true }; },
    sendPasswordResetOtp: async (to, otp) => { mailbox.reset.set(to, otp); return { ok: true }; },
    sendLoginOtp: async (to, otp) => { mailbox.login.set(to, otp); return { ok: true }; },
    sendParentConsentRequest: async (to, { approveUrl }) => { mailbox.parent.set(to, approveUrl); return { ok: true }; },
    sendParentConsentConfirmation: async () => ({ ok: true }),
    sendParentSafetyLock: async (to, { approveUrl }) => { mailbox.safetyLock.push({ to, approveUrl }); return { ok: true }; },
    sendPaymentReceipt: async (to, info) => { mailbox.receipts.push({ to, ...info }); return { ok: true }; },
    sendAdminAlert: async (subject, lines) => { mailbox.alerts.push({ subject, lines }); return { ok: true }; },
  };
};
