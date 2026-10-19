// ============================================================
//  JNEET+ AI — pages/ForgotPassword.jsx  (v4)
//  Step 1: enter email → code is emailed (answer never reveals whether
//          the account exists).
//  Step 2: six-box code + new password (strength meter) → backend logs
//          the student in on success and every other device is signed out.
// ============================================================

import { useRef, useState }  from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }           from "../context/AuthContext.jsx";
import { authApi }           from "../api/authApi.js";
import { Captcha }           from "../components/security/Captcha.jsx";
import { withCaptcha, CAPTCHA_ERROR } from "../utils/turnstile.js";
import { FormField }         from "../components/auth/FormField.jsx";
import { OtpInput }          from "../components/auth/OtpInput.jsx";
import { PasswordStrength } from "../components/auth/PasswordStrength.jsx";
import { passwordMeetsPolicy } from "../utils/password.js";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { useCountdown }      from "../hooks/useCountdown.js";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const captchaRef = useRef(null);
  const [step,     setStep]     = useState(1);
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});
  const [notice,   setNotice]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cooldown, startCooldown] = useCountdown(0);

  const clean = email.trim().toLowerCase();

  const requestCode = async (e) => {
    e?.preventDefault();
    if (!clean) { setErrors({ email: "Email is required" }); return; }
    if (!EMAIL_RE.test(clean)) { setErrors({ email: "Enter a valid email address" }); return; }
    if (step === 2 && cooldown > 0) return;

    setLoading(true); setErrors({});
    try {
      const res = await authApi.forgotPassword(await withCaptcha(captchaRef, { email: clean }));
      setNotice({ tone: "success", text: "If an account exists for this email, a reset code is on its way. Check Spam too." });
      startCooldown(res.data?.resendAfter ?? 60);
      setOtp(""); setStep(2);
    } catch (err) {
      const status = err.response?.status;
      if (err.isCaptchaError) setErrors({ email: CAPTCHA_ERROR });
      else if (err.response?.data?.code === "CAPTCHA_FAILED") setErrors({ email: err.response.data.error || CAPTCHA_ERROR });
      else if (err.isNetworkError || err.isTimeout) setErrors({ email: "Can't reach the server. Check your connection and try again." });
      else if (status === 429) {
        setErrors({ email: err.response?.data?.error || "Too many requests. Please try again later." });
        startCooldown(err.response?.data?.retryAfter ?? 60);
      } else if (status === 502 || status === 503) setErrors({ email: err.response?.data?.error || "We couldn't send the email right now. Please try again in a few minutes." });
      else if (status === 400) setErrors({ email: err.response?.data?.error || "Please check the email and try again." });
      else setErrors({ email: "Something went wrong on our side. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\d{6}$/.test(otp)) errs.otp = "Enter the 6-digit code";
    if (!password) errs.password = "New password is required";
    else if (!passwordMeetsPolicy(password)) errs.password = "Use at least 8 characters with a letter and a number";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({});
    try {
      const res = await authApi.resetPassword({ email: clean, otp, newPassword: password });
      login(res.data.student);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const fields = err.response?.data?.fieldErrors ?? [];
      if (err.isNetworkError || err.isTimeout) setErrors({ otp: "Can't reach the server. Try again in a moment." });
      else if (fields.length) {
        const mapped = Object.fromEntries(fields.map(({ field, message }) => [field === "newPassword" ? "password" : field, message]));
        setErrors(mapped);
      } else if (status === 400 || status === 429 || status === 423) {
        setOtp("");
        setErrors({ otp: err.response?.data?.error || "That code is incorrect or expired." });
      } else setErrors({ otp: "Something went wrong on our side. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const footer = <>Remembered it? <Link to="/login" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Log in</Link></>;

  if (step === 1) {
    return (
      <AuthShell title="Reset your password" subtitle="We'll email you a 6-digit code" footer={footer}>
        <form onSubmit={requestCode} noValidate className="space-y-4">
        <Captcha ref={captchaRef} />
          <FormField label="Email" name="email" type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            error={errors.email} placeholder="you@example.com" autoComplete="email" disabled={loading}
            autoCapitalize="none" spellCheck={false} inputMode="email" />
          <SubmitButton loading={loading} loadingText="Sending…">Send reset code</SubmitButton>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Enter your reset code"
      subtitle={<>Sent to <span className="font-medium text-[#2D2A32]">{clean}</span></>}
      footer={footer}
    >
      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
      <form onSubmit={resetPassword} noValidate className="space-y-4">
        <Captcha ref={captchaRef} />
        <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }}
          disabled={loading} error={errors.otp} idPrefix="reset-otp" />

        <div>
          <FormField label="New password" name="password" type={showPass ? "text" : "password"}
            value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
            error={errors.password} placeholder="Create a new password" autoComplete="new-password" disabled={loading}>
            <button type="button" onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B95A8] hover:text-[#6B6572] transition-colors p-0.5">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </FormField>
          <PasswordStrength password={password} />
        </div>

        <SubmitButton loading={loading} loadingText="Resetting…" disabled={otp.length !== 6}>Reset password</SubmitButton>

        <button type="button" onClick={requestCode} disabled={loading || cooldown > 0}
          className="w-full text-center text-[#5B9FE8] hover:text-[#3D7DC9] text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:text-[#8B8594]">
          {cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
        </button>
        <button type="button" onClick={() => { setStep(1); setErrors({}); setNotice(null); }}
          className="w-full flex items-center justify-center gap-1.5 text-[#8B8594] hover:text-[#6B6572] text-xs transition-colors">
          <ArrowLeft size={12} /><span>Use a different email</span>
        </button>
      </form>
    </AuthShell>
  );
}
