// ============================================================
//  JNEET+ AI — components/auth/DobGate.jsx
//  Students who signed up before the age check existed are asked for
//  their date of birth once. Under-18s must also give a parent/guardian
//  email (the AI mentor then waits for approval; everything else keeps
//  working). Shown as a modal over the app until completed.
// ============================================================

import { useMemo, useState } from "react";
import { useAuth }   from "../../context/AuthContext.jsx";
import { userApi }   from "../../api/userApi.js";
import { FormField } from "./FormField.jsx";
import { SubmitButton, Notice } from "./AuthShell.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ageOf(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split("-").map(Number);
  const born = new Date(Date.UTC(y, m - 1, d));
  if (born.getUTCFullYear() !== y || born.getUTCMonth() !== m - 1 || born.getUTCDate() !== d) return null;
  const now = new Date();
  if (born > now) return null;
  let age = now.getUTCFullYear() - y;
  const md = now.getUTCMonth() - (m - 1);
  if (md < 0 || (md === 0 && now.getUTCDate() < d)) age -= 1;
  return age;
}

export function DobGate() {
  const { user, setStudent, logout } = useAuth();
  const [dob, setDob] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);

  const age = useMemo(() => ageOf(dob), [dob]);
  const isMinor = age !== null && age >= 13 && age < 18;

  if (!user || user.hasDateOfBirth) return null;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!dob) errs.dateOfBirth = "Date of birth is required";
    else if (age === null) errs.dateOfBirth = "Enter a valid date of birth";
    else if (age < 13) errs.dateOfBirth = "JNEET+ AI is for students aged 13 and above";
    if (isMinor) {
      const pe = parentEmail.trim().toLowerCase();
      if (!pe) errs.parentEmail = "A parent or guardian's email is required";
      else if (!EMAIL_RE.test(pe)) errs.parentEmail = "Enter a valid email address";
      else if (pe === user.email.toLowerCase()) errs.parentEmail = "This must be your parent or guardian's email, not yours";
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({}); setFormErr("");
    try {
      const res = await userApi.setDateOfBirth({
        dateOfBirth: dob,
        ...(isMinor ? { parentEmail: parentEmail.trim().toLowerCase() } : {}),
      });
      setStudent(res.data.student);
    } catch (err) {
      const fields = err.response?.data?.fieldErrors ?? [];
      if (fields.length) setErrors(Object.fromEntries(fields.map(({ field, message }) => [field, message])));
      else if (err.isNetworkError || err.isTimeout) setFormErr("Can't reach the server. Please try again.");
      else setFormErr(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog" aria-modal="true" aria-labelledby="dob-title">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-fade-up">
        <h2 id="dob-title" className="text-lg font-bold text-[#2D2A32]">One quick thing</h2>
        <p className="text-xs text-[#6B6572] mt-1 mb-4 leading-relaxed">
          We've added age checks to keep students safe. Please enter your date of birth to continue. It's private and never shown to anyone.
        </p>
        {formErr ? <Notice tone="error">{formErr}</Notice> : null}
        <form onSubmit={submit} noValidate className="space-y-4">
          <FormField label="Date of birth" name="dateOfBirth" type="date" value={dob}
            onChange={(e) => { setDob(e.target.value); setErrors({}); }} error={errors.dateOfBirth}
            max={new Date().toISOString().slice(0, 10)} min="1920-01-01" disabled={loading} autoComplete="bday" />
          {isMinor ? (
            <div className="animate-fade-up space-y-3">
              <Notice tone="info">
                You're under 18, so a parent or guardian needs to approve the AI mentor. Tests, revision and notes keep working.
              </Notice>
              <FormField label="Parent / guardian email" name="parentEmail" type="email" value={parentEmail}
                onChange={(e) => { setParentEmail(e.target.value); setErrors({}); }} error={errors.parentEmail}
                placeholder="parent@example.com" disabled={loading} autoCapitalize="none" spellCheck={false} inputMode="email" />
            </div>
          ) : null}
          <SubmitButton loading={loading} loadingText="Saving…">Continue</SubmitButton>
        </form>
        <button type="button" onClick={logout}
          className="w-full text-center text-[#8B8594] hover:text-[#6B6572] text-xs mt-3 transition-colors">
          Log out
        </button>
      </div>
    </div>
  );
}
