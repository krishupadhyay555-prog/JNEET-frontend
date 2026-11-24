// ============================================================
//  JNEET+ AI — components/auth/TermsUpdateGate.jsx
//  Shown once after we update the Terms / Privacy Policy: the student
//  reads what changed and accepts to continue (or logs out).
// ============================================================
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { userApi } from "../../api/userApi.js";
import { SubmitButton, Notice } from "./AuthShell.jsx";

export function TermsUpdateGate() {
  const { user, setStudent, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!user || !user.termsUpdate || !user.hasDateOfBirth) return null;

  const accept = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await userApi.acceptTerms();
      setStudent(res.data.student);
    } catch (err) {
      setError(err.isNetworkError || err.isTimeout ? "Can't reach the server. Please try again." : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-fade-up">
        <h2 id="terms-title" className="text-lg font-bold text-[#2D2A32]">We&apos;ve updated our policies</h2>
        <p className="text-sm text-[#5F5B67] mt-2 leading-relaxed">What&apos;s new:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-[#5F5B67] marker:text-[#0D9488]">
          <li>Every plan has a monthly fair-use limit on AI.</li>
          <li>Early-bird prices apply only while seats are left.</li>
          <li>Listen (Elite) sends the answer text to our AI provider to make the audio.</li>
          <li>A lost card or bank chargeback removes the plan it paid for.</li>
        </ul>
        <p className="text-sm text-[#5F5B67] mt-3">
          Read the full{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#0F766E] font-semibold underline">Terms</a>,{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0F766E] font-semibold underline">Privacy Policy</a> and{" "}
          <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-[#0F766E] font-semibold underline">Refund Policy</a>.
        </p>
        {error ? <div className="mt-3"><Notice tone="error">{error}</Notice></div> : null}
        <form onSubmit={accept} className="mt-5">
          <SubmitButton loading={busy} loadingText="Saving…">I agree, continue</SubmitButton>
        </form>
        <button type="button" onClick={logout}
          className="w-full min-h-[44px] text-center text-[#6B6572] hover:text-[#2D2A32] text-xs mt-2 transition-colors">
          Log out
        </button>
      </div>
    </div>
  );
}
