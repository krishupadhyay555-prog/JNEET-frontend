// ============================================================
//  JNEET+ AI — pages/Login.jsx  (v5)
//  Two ways in, like Claude / Google:
//    - email + password
//    - "Email me a code" (passwordless, 6-box OTP)
//  Unverified accounts are sent to the code screen on /register.
// ============================================================

import { useState }          from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }           from "../context/AuthContext.jsx";
import { authApi }           from "../api/authApi.js";
import { FormField }         from "../components/auth/FormField.jsx";
import { OtpInput }          from "../components/auth/OtpInput.jsx";
import { AuthShell, SubmitButton, Notice } from "../components/auth/AuthShell.jsx";
import { useCountdown }      from "../hooks/useCountdown.js";
import { Eye, EyeOff, Mail, KeyRound, ArrowLeft } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  // "password" | "code-email" | "code-enter"
  const [mode,     setMode]     = useState("password");
  const [form,     setForm]     = useState({ email: "", password: "" });
  const [otp,      setOtp]      = useState("");
  const [errors,   setErrors]   = useState({});
  const [formErr,  setFormErr]  = useState("");
  const [notice,   setNotice]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cooldown, startCooldown] = useCountdown(0);

  const email = form.email.trim().toLowerCase();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (formErr) setFormErr("");
  };

  const switchMode = (next) => {
    setMode(next); setErrors({}); setFormErr(""); setNotice(null); setOtp("");
  };

  const goVerify = (mail) => navigate("/register", { state: { step: 2, email: mail || email } });

  // Shared handling of auth errors that mean the same thing on every path.
  const handleCommonError = (err, field) => {
    const status = err.response?.status;
    const data   = err.response?.data ?? {};
    if (err.isNetworkError || err.isTimeout) { setErrors({ [field]: "Can't reach the server. Check your connection and try again." }); return true; }
    if (status === 403 && data.requiresVerification) { goVerify(data.email); return true; }
    if (status === 403) { setErrors({ [field]: data.error || "This account is deactivated. Please contact support." }); return true; }
    if (status === 423) { setErrors({ [field]: data.error || "This account is temporarily locked. Please try again later." }); return true; }
    if (status === 429) {
      const mins = data.retryAfter ? Math.max(1, Math.ceil(data.retryAfter / 60)) : null;
      setErrors({ [field]: mins ? `Too many attempts. Try again in about ${mins} minute${mins === 1 ? "" : "s"}.` : "Too many attempts. Please try again later." });
      return true;
    }
    return false;
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!EMAIL_RE.test(email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({});
    try {
      const res = await authApi.login({ email, password: form.password });
      login(res.data.student);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (handleCommonError(err, "password")) return;
      const fields = err.response?.data?.fieldErrors ?? [];
      if (fields.length) setErrors(Object.fromEntries(fields.map(({ field, message }) => [field, message])));
      else if (err.response?.status === 401) setErrors({ password: "Incorrect email or password" });
      else setErrors({ password: "Something went wrong on our side. Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!email) { setErrors({ email: "Email is required" }); return; }
    if (!EMAIL_RE.test(email)) { setErrors({ email: "Enter a valid email address" }); return; }
    if (cooldown > 0 && mode === "code-enter") return;

    setLoading(true); setErrors({});
    try {
      const res = await authApi.requestLoginCode({ email });
      setNotice({ tone: "success", text: "If this email has an account, a 6-digit code is on its way. Check Spam too." });
      startCooldown(res.data?.resendAfter ?? 60);
      setOtp("");
      setMode("code-enter");
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        setErrors({ email: err.response?.data?.error || "Please wait a moment before requesting another code." });
        startCooldown(err.response?.data?.retryAfter ?? 60);
      } else if (status === 502 || status === 503) {
        setErrors({ email: err.response?.data?.error || "We couldn't send the email right now. Try again in a few minutes, or log in with your password." });
      } else if (!handleCommonError(err, "email")) {
        setErrors({ email: "Something went wrong on our side. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code) => {
    if (loading) return;
    if (!/^\d{6}$/.test(code)) { setErrors({ otp: "Enter the 6-digit code" }); return; }
    setLoading(true); setErrors({});
    try {
      const res = await authApi.verifyLoginCode({ email, otp: code });
      login(res.data.student);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setOtp("");
      if (handleCommonError(err, "otp")) return;
      if (err.response?.status === 400 || err.response?.status === 401) setErrors({ otp: err.response?.data?.error || "That code is incorrect or expired." });
      else setErrors({ otp: "Something went wrong on our side. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Enter the emailed code ───────────────────────────────────
  if (mode === "code-enter") {
    return (
      <AuthShell
        title="Check your email"
        subtitle={<>Enter the code sent to <span className="font-medium text-[#2D2A32]">{email}</span></>}
        footer={<>New here? <Link to="/register" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Register now</Link></>}
      >
        {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
        <form onSubmit={(e) => { e.preventDefault(); verifyCode(otp); }} noValidate className="space-y-4">
          <OtpInput value={otp} onChange={setOtp} onComplete={verifyCode} disabled={loading} error={errors.otp} idPrefix="login-otp" />
          <SubmitButton loading={loading} loadingText="Checking…" disabled={otp.length !== 6}>Log in</SubmitButton>
          <button type="button" onClick={sendCode} disabled={loading || cooldown > 0}
            className="w-full text-center text-[#5B9FE8] hover:text-[#3D7DC9] text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:text-[#8B8594]">
            {cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
          </button>
          <button type="button" onClick={() => switchMode("password")}
            className="w-full flex items-center justify-center gap-1.5 text-[#8B8594] hover:text-[#6B6572] text-xs transition-colors">
            <ArrowLeft size={12} /><span>Use password instead</span>
          </button>
        </form>
      </AuthShell>
    );
  }

  // ── Ask for email to send a code ─────────────────────────────
  if (mode === "code-email") {
    return (
      <AuthShell title="Log in with a code" subtitle="We'll email you a 6-digit code — no password needed"
        footer={<>New here? <Link to="/register" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Register now</Link></>}>
        <form onSubmit={sendCode} noValidate className="space-y-4">
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
            error={errors.email} placeholder="you@example.com" autoComplete="email" disabled={loading}
            autoCapitalize="none" spellCheck={false} inputMode="email" />
          <SubmitButton loading={loading} loadingText="Sending…">Email me a code</SubmitButton>
          <button type="button" onClick={() => switchMode("password")}
            className="w-full flex items-center justify-center gap-1.5 text-[#8B8594] hover:text-[#6B6572] text-xs transition-colors">
            <KeyRound size={12} /><span>Use password instead</span>
          </button>
        </form>
      </AuthShell>
    );
  }

  // ── Password login (default) ─────────────────────────────────
  return (
    <AuthShell title="JNEET+ AI" subtitle="Welcome back"
      footer={<>New here? <Link to="/register" className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium">Register now</Link></>}>
      {formErr ? <Notice tone="error">{formErr}</Notice> : null}
      <form onSubmit={submitPassword} noValidate className="space-y-4">
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
          error={errors.email} placeholder="you@example.com" autoComplete="username" disabled={loading}
          autoCapitalize="none" spellCheck={false} inputMode="email" />

        <div>
          <FormField label="Password" name="password" type={showPass ? "text" : "password"}
            value={form.password} onChange={handleChange} error={errors.password}
            placeholder="••••••••" autoComplete="current-password" disabled={loading}>
            <button type="button" onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B95A8] hover:text-[#6B6572] transition-colors p-0.5">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </FormField>
          <div className="text-right mt-1.5">
            <Link to="/forgot-password" className="text-[#8B8594] hover:text-[#5B9FE8] text-xs transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <SubmitButton loading={loading} loadingText="Logging in…">Log in</SubmitButton>

        <div className="flex items-center gap-3 text-[11px] text-[#B8B2C2]" aria-hidden="true">
          <span className="flex-1 h-px bg-[#EDE6F3]" />or<span className="flex-1 h-px bg-[#EDE6F3]" />
        </div>

        <button type="button" onClick={() => switchMode("code-email")}
          className="w-full flex items-center justify-center gap-2 border border-[#EDE6F3] hover:border-[#93C5FD]/60 hover:bg-[#F7FAFF] text-[#2D2A32] text-sm font-medium py-2.5 rounded-xl transition-all active:scale-[0.98]">
          <Mail size={14} /> Email me a login code
        </button>
      </form>
    </AuthShell>
  );
}
