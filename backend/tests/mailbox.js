// Captures the OTPs / links our (mocked) email service "sends", so tests
// can complete the real verify-email → login flows.
export const mailbox = { verify: new Map(), reset: new Map(), login: new Map(), parent: new Map() };
export function clearMailbox() {
  for (const m of Object.values(mailbox)) m.clear();
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
  };
};
