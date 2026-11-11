// ============================================================
//  JNEET+ AI — pages/Register.jsx  (v5 — DOB, parent consent, A-grade OTP)
//  Step 1: details (name, email, date of birth, password with strength
//          meter, exam, parent e-mail when under 18, terms checkbox).
//  Step 2: six-box code entry with autofill/paste, auto-submit,
//          honest "we couldn't send it" handling and a resend timer
//          driven by the server's `resendAfter`.
// ============================================================

import { useRef, useState, useMemo }      from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast                              from "react-hot-toast";
import { useAuth }        from "../context/AuthContext.jsx";
import { authApi }        from "../api/authApi.js";
import { Captcha }        from "../components/security/Captcha.jsx";
import { withCaptcha, CAPTCHA_ERROR } from "../utils/turnstile.js";
import { FormField }      from "../components/auth/FormField.jsx";
import { OtpInput }       from "../components/auth/OtpInput.jsx";
import { PasswordStrength } from "../components/auth/PasswordStrength.jsx";
import { passwordMeetsPolicy } from "../utils/password.js";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { useCountdown }   from "../hooks/useCountdown.js";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ageFromDob(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split("-").map(Number);
  const born = new Date(Date.UTC(y, m - 1, d));
  if (born.getUTCFullYear() !== y || born.getUTCMonth() !== m - 1 || born.getUTCDate() !== d) return null;
  const now = new Date();
  if (born.getTime() > now.getTime()) return null;
  let age = now.getUTCFullYear() - y;
  const md = now.getUTCMonth() - (m - 1);
  if (md < 0 || (md === 0 && now.getUTCDate() < d)) age -= 1;
  return age;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function validate(form, age) {
  const errs = {};
  const name = form.name.trim();
  if (!name) errs.name = "Name is required";
  else if (name.length < 2) errs.name = "Name must be at least 2 characters";
  else if (name.length > 50) errs.name = "Name cannot exceed 50 characters";

  if (!form.email.trim()) errs.email = "Email is required";
  else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email address";

  if (!form.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
  else if (age === null) errs.dateOfBirth = "Enter a valid date of birth";
  else if (age < 13) errs.dateOfBirth = "JNEET+ AI is for students aged 13 and above";

  if (!form.password) errs.password = "Password is required";
  else if (!passwordMeetsPolicy(form.password)) errs.password = "Use at least 8 characters with a letter and a number";

  if (age !== null && age >= 13 && age < 18) {
    if (!form.parentEmail.trim()) errs.parentEmail = "A parent or guardian's email is required";
    else if (!EMAIL_RE.test(form.parentEmail.trim())) errs.parentEmail = "Enter a valid email address";
    else if (form.parentEmail.trim().toLowerCase() === form.email.trim().toLowerCase())
      errs.parentEmail = "This must be your parent or guardian's email, not yours";
  }

  if (!form.acceptTerms) errs.acceptTerms = "Please accept the Terms and Privacy Policy to continue";
  return errs;
}

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Login.jsx sends unverified accounts straight to the code screen.
  const arrived = location.state?.step === 2 && location.state?.email;

  const [step, setStep] = useState(arrived ? 2 : 1);
  const [form, setForm] = useState({
    name: "", email: arrived ? location.state.email : "", dateOfBirth: "",
    password: "", parentEmail: "", examMode: "NEET", acceptTerms: false,
  });
  const [otp,      setOtp]      = useState("");
  const [errors,   setErrors]   = useState({});
  const [formErr,  setFormErr]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [notice,   setNotice]   = useState(
    arrived ? { tone: "info", text: "Please verify your email to continue. Enter the code we sent, or request a new one below." } : null
  );
  const [resending, setResending] = useState(false);
  const captchaRef = useRef(null);
  const [cooldown,  startCooldown] = useCountdown(arrived ? 0 : 0);

  const age     = useMemo(() => ageFromDob(form.dateOfBirth), [form.dateOfBirth]);
  const isMinor = age !== null && age >= 13 && age < 18;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (formErr) setFormErr("");
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    const errs = validate(form, age);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({}); setFormErr("");
    try {
      const res = await authApi.register(await withCaptcha(captchaRef, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        examMode: form.examMode,
        dateOfBirth: form.dateOfBirth,
        acceptTerms: true,
        ...(isMinor ? { parentEmail: form.parentEmail.trim().toLowerCase() } : {}),
      }));

      const { emailSent, resendAfter } = res.data;
      setOtp("");
      if (emailSent) {
        setNotice({ tone: "success", text: "We've emailed you a 6-digit code. It can take a minute — check Spam or Promotions too." });
        startCooldown(resendAfter || 60);
      } else {
        setNotice({ tone: "warn", text: "Your account is created, but we couldn't send the code just now. Tap “Send a new code” below." });
        startCooldown(0);
      }
      setStep(2);
    } catch (err) {
      handleRegisterError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterError = (err) => {
    const status = err.response?.status;
    const fields = err.response?.data?.fieldErrors ?? [];
    if (err.isCaptchaError) {
      setFormErr(CAPTCHA_ERROR);
    } else if (err.isNetworkError || err.isTimeout) {
      setFormErr("Can't reach the server. Check your connection and try again.");
    } else if (fields.length) {
      setErrors(Object.fromEntries(fields.map(({ field, message }) => [field, message])));
    } else if (status === 429) {
      setFormErr("Too many attempts. Please wait a little and try again.");
    } else if (status === 400) {
      setFormErr(err.response?.data?.error || "Please check your details and try again.");
    } else {
      setFormErr("Something went wrong on our side. Please try again in a moment.");
    }
  };

  const verify = async (code) => {
    if (loading) return;
    if (!/^\d{6}$/.test(code)) { setErrors({ otp: "Enter the 6-digit code" }); return; }
    setLoading(true); setErrors({});
    try {
      const res = await authApi.verifyEmail({ email: form.email.trim().toLowerCase(), otp: code });
      login(res.data.student);
      if (res.data.parentRequestSent) {
        toast.success("We've emailed your parent/guardian for approval of the AI mentor.", { duration: 6000 });
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setOtp("");
      if (err.isNetworkError || err.isTimeout) setErrors({ otp: "Can't reach the server. Try again in a moment." });
      else if (status === 400 || status === 429 || status === 423) setErrors({ otp: err.response?.data?.error || "That code is incorrect or expired." });
      else setErrors({ otp: "Something went wrong on our side. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true); setErrors({});
    try {
      const res = await authApi.resendVerification(await withCaptcha(captchaRef, { email: form.email.trim().toLowerCase() }));
      setNotice({ tone: "success", text: "A new code is on its way. Check your inbox and Spam folder." });
      startCooldown(res.data?.resendAfter ?? 60);
      setOtp("");
    } catch (err) {
      const s = err.response?.status;
      if (err.isCaptchaError || err.response?.data?.code === "CAPTCHA_FAILED") {
        setErrors({ otp: err.isCaptchaError ? CAPTCHA_ERROR : (err.response.data.error || CAPTCHA_ERROR) });
      } else if (s === 429) {
        setErrors({ otp: err.response?.data?.error || "Please wait a moment before requesting another code." });
        startCooldown(err.response?.data?.retryAfter ?? 60);
      } else if (s === 502 || s === 503) {
        setErrors({ otp: err.response?.data?.error || "We couldn't send the email right now. Please try again in a few minutes." });
      } else {
        setErrors({ otp: "Couldn't resend the code. Please try again in a moment." });
      }
    } finally {
      setResending(false);
    }
  };

  // ── Step 2 ──────────────────────────────────────────────────
  if (step === 2) {
    return (
      <AuthShell
        title="Verify your email"
        subtitle={<>Code sent to <span className="font-medium text-[#2D2A32]">{form.email}</span></>}
        footer={<>Already verified? <Link to="/login" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Log in</Link></>}
      >
        {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

        <form onSubmit={(e) => { e.preventDefault(); verify(otp); }} noValidate className="space-y-4">
          <Captcha ref={captchaRef} />
          <OtpInput value={otp} onChange={setOtp} onComplete={verify} disabled={loading} error={errors.otp} />

          <SubmitButton loading={loading} loadingText="Verifying…" disabled={otp.length !== 6}>
            Verify &amp; continue
          </SubmitButton>

          <button
            type="button"
            onClick={resend}
            disabled={resending || loading || cooldown > 0}
            className="w-full text-center text-[#5B9FE8] hover:text-[#3D7DC9] text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:text-[#8B8594]"
          >
            {resending ? "Sending…" : cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
          </button>

          <button
            type="button"
            onClick={() => { setStep(1); setErrors({}); setNotice(null); }}
            className="w-full flex items-center justify-center gap-1.5 text-[#8B8594] hover:text-[#6B6572] text-xs transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Wrong email? Go back</span>
          </button>
        </form>
      </AuthShell>
    );
  }

  // ── Step 1 ──────────────────────────────────────────────────
  return (
    <AuthShell
      title="JNEET+ AI"
      subtitle="Create your account"
      footer={<>Already have an account? <Link to="/login" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Log in</Link></>}
    >
      {formErr ? <Notice tone="error">{formErr}</Notice> : null}

      <form onSubmit={submitDetails} noValidate className="space-y-4">
        <Captcha ref={captchaRef} />
        <FormField label="Full name" name="name" value={form.name} onChange={handleChange}
          error={errors.name} placeholder="Your name" autoComplete="name" disabled={loading} />

        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
          error={errors.email} placeholder="you@example.com" autoComplete="email" disabled={loading}
          autoCapitalize="none" spellCheck={false} inputMode="email" />

        <FormField label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth}
          onChange={handleChange} error={errors.dateOfBirth} disabled={loading}
          autoComplete="bday" max={todayIso()} min="1920-01-01"
          hint="We use this to keep younger students safe. It is never shown to anyone." />

        {isMinor ? (
          <div className="animate-fade-up">
            <Notice tone="info">
              You're under 18, so a parent or guardian needs to approve the AI mentor. Tests, revision and notes work right away.
            </Notice>
            <FormField label="Parent / guardian email" name="parentEmail" type="email"
              value={form.parentEmail} onChange={handleChange} error={errors.parentEmail}
              placeholder="parent@example.com" disabled={loading}
              autoCapitalize="none" spellCheck={false} inputMode="email"
              hint="We'll email them a one-time approval link after you verify your own email." />
          </div>
        ) : null}

        <div>
          <FormField label="Password" name="password" type={showPass ? "text" : "password"}
            value={form.password} onChange={handleChange} error={errors.password}
            placeholder="Create a password" autoComplete="new-password" disabled={loading}>
            <button type="button" onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B95A8] hover:text-[#6B6572] transition-colors p-0.5">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </FormField>
          <PasswordStrength password={form.password} />
        </div>

        <fieldset>
          <legend className="text-xs text-[#6B6572] block mb-1.5 font-medium">Which exam are you preparing for?</legend>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: "NEET", label: "🩺 NEET UG" }, { value: "JEE", label: "⚙️ JEE Mains" }].map(({ value, label }) => (
              <button key={value} type="button" aria-pressed={form.examMode === value}
                onClick={() => setForm((p) => ({ ...p, examMode: value }))}
                className={[
                  "py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border active:scale-[0.97]",
                  form.examMode === value
                    ? "bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8] border-transparent text-white shadow-[0_4px_14px_rgba(147,197,253,0.35)]"
                    : "bg-white border-[#EDE6F3] text-[#6B6572] hover:border-[#93C5FD]/50 hover:text-[#2D2A32]",
                ].join(" ")}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="flex items-start gap-2.5 text-xs text-[#6B6572] leading-relaxed cursor-pointer">
            <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange}
              disabled={loading} aria-invalid={errors.acceptTerms ? "true" : undefined}
              className="mt-0.5 h-4 w-4 rounded border-[#EDE6F3] accent-[#5B9FE8] shrink-0" />
            <span>
              I agree to the{" "}
              <Link to="/terms" target="_blank" rel="noopener" className="text-[#5B9FE8] hover:underline font-medium">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" target="_blank" rel="noopener" className="text-[#5B9FE8] hover:underline font-medium">Privacy Policy</Link>.
            </span>
          </label>
          {errors.acceptTerms ? <p role="alert" className="text-red-500 text-xs mt-1.5 animate-fade-in">{errors.acceptTerms}</p> : null}
        </div>

        <SubmitButton loading={loading} loadingText="Creating account…">Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}
