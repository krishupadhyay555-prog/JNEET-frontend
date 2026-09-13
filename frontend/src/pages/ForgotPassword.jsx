// ============================================================
//  JNEET+ AI — pages/ForgotPassword.jsx  (NEW)
//  Two-step flow on a single page:
//    Step 1: enter email -> request OTP (authApi.forgotPassword)
//    Step 2: enter the 6-digit OTP + new password -> reset
//            (authApi.resetPassword). On success, the backend logs
//            the user straight in (same response shape as login),
//            so we reuse useAuth().login() + navigate to dashboard,
//            exactly like Login.jsx does.
//  Styling/layout intentionally mirrors Login.jsx exactly (same
//  card, gradient background, FormField component, button style)
//  so it feels like part of the same auth flow, not a bolted-on page.
// ============================================================

import { useState }           from "react";
import { useNavigate, Link }  from "react-router-dom";
import { useAuth }            from "../context/AuthContext.jsx";
import { authApi }            from "../api/authApi.js";
import { FormField }          from "../components/auth/FormField.jsx";
import { Spinner }            from "../components/ui/Spinner.jsx";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

function validateEmailStep(form) {
  const errs = {};
  if (!form.email.trim())
    errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email address";
  return errs;
}

function validateResetStep(form) {
  const errs = {};
  if (!form.otp.trim())
    errs.otp = "Enter the code from your email";
  else if (!/^\d{6}$/.test(form.otp.trim()))
    errs.otp = "Code must be 6 digits";

  if (!form.newPassword)
    errs.newPassword = "New password is required";
  else if (form.newPassword.length < 8)
    errs.newPassword = "Password must be at least 8 characters";
  else if (!/[A-Za-z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword))
    errs.newPassword = "Password must include a letter and a number";

  if (!form.confirmPassword)
    errs.confirmPassword = "Please confirm your new password";
  else if (form.newPassword !== form.confirmPassword)
    errs.confirmPassword = "Passwords don't match";

  return errs;
}

export default function ForgotPassword() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  // step 1 = requesting the OTP, step 2 = entering OTP + new password
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [infoMsg,  setInfoMsg]  = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    const clientErrs = validateEmailStep(form);
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setLoading(true);
    setErrors({});
    setInfoMsg("");

    try {
      await authApi.forgotPassword({ email: form.email.trim().toLowerCase() });
      setInfoMsg("If an account exists with this email, a 6-digit code has been sent. Check your inbox (and spam folder).");
      setStep(2);
    } catch (err) {
      const status    = err.response?.status;
      const serverMsg = err.response?.data?.error ?? "";

      if (err.isNetworkError || err.isTimeout) {
        setErrors({ email: "Can't reach the server. Is the backend running?" });
      } else if (status === 429) {
        setErrors({ email: "Too many attempts. Please try again in 15 minutes." });
      } else {
        setErrors({ email: serverMsg || "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const clientErrs = validateResetStep(form);
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await authApi.resetPassword({
        email:       form.email.trim().toLowerCase(),
        otp:         form.otp.trim(),
        newPassword: form.newPassword,
      });

      // Backend logs the user in immediately on successful reset —
      // same response shape as login, so we can reuse it directly.
      login(res.data.student);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const status    = err.response?.status;
      const serverMsg = err.response?.data?.error ?? "";

      if (err.isNetworkError || err.isTimeout) {
        setErrors({ otp: "Can't reach the server. Is the backend running?" });
      } else if (status === 429) {
        setErrors({ otp: serverMsg || "Too many incorrect attempts. Please request a new code." });
      } else {
        setErrors({ otp: serverMsg || "Invalid or expired code. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFC] flex items-center justify-center px-4 relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#93C5FD]/25 rounded-full blur-[110px] animate-pulse-soft" />
        <div
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-[#F5A9C8]/25 rounded-full blur-[110px] animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-sm relative animate-fade-up">
        <div className="bg-white border border-[#EDE6F3] rounded-2xl p-7 shadow-[0_1px_3px_rgba(45,42,50,0.06),0_12px_32px_rgba(45,42,50,0.08)]
          transition-shadow duration-300 hover:shadow-[0_1px_3px_rgba(45,42,50,0.08),0_16px_40px_rgba(147,197,253,0.16)]">

          <div
            className="flex flex-col items-center mb-7 animate-fade-up"
            style={{ animationDelay: "40ms", animationFillMode: "backwards" }}
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden mb-3
              shadow-[0_6px_18px_rgba(147,197,253,0.4)]
              transition-transform duration-300 hover:scale-105 hover:-rotate-3">
              <img
                src="/icon-192.png"
                alt="JNEET+ AI"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2D2A32]">JNEET+ AI</h1>
            <p className="text-[#6B6572] text-xs mt-0.5">
              {step === 1 ? "Reset your password" : "Enter your reset code"}
            </p>
          </div>

          {infoMsg && step === 2 && (
            <div className="bg-[#EBF5FF] border border-[#93C5FD]/40 text-[#2D6CB0] text-xs rounded-xl px-3.5 py-2.5 mb-4 animate-fade-in">
              {infoMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
              <div className="animate-fade-up" style={{ animationDelay: "90ms", animationFillMode: "backwards" }}>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8]
                  hover:shadow-[0_8px_24px_rgba(147,197,253,0.45)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white font-semibold py-2.5 rounded-xl
                  transition-all duration-200
                  flex items-center justify-center gap-2 text-sm mt-1
                  active:scale-[0.98] hover:-translate-y-0.5 group"
              >
                {loading ? (
                  <>
                    <Spinner size={15} />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} noValidate className="space-y-4">
              <div className="animate-fade-up" style={{ animationDelay: "40ms", animationFillMode: "backwards" }}>
                <FormField
                  label="6-digit code"
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  error={errors.otp}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  disabled={loading}
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "90ms", animationFillMode: "backwards" }}>
                <FormField
                  label="New password"
                  name="newPassword"
                  type={showPass ? "text" : "password"}
                  value={form.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={loading}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-[#9B95A8] hover:text-[#6B6572] transition-colors duration-150 p-0.5"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </FormField>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "140ms", animationFillMode: "backwards" }}>
                <FormField
                  label="Confirm new password"
                  name="confirmPassword"
                  type={showPass ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8]
                  hover:shadow-[0_8px_24px_rgba(147,197,253,0.45)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white font-semibold py-2.5 rounded-xl
                  transition-all duration-200
                  flex items-center justify-center gap-2 text-sm mt-1
                  active:scale-[0.98] hover:-translate-y-0.5 group"
              >
                {loading ? (
                  <>
                    <Spinner size={15} />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}); setInfoMsg(""); }}
                className="w-full flex items-center justify-center gap-1.5 text-[#8B8594] hover:text-[#6B6572] text-xs mt-1 transition-colors duration-150"
              >
                <ArrowLeft size={12} />
                <span>Use a different email</span>
              </button>
            </form>
          )}

          <p className="text-center text-[#6B6572] text-xs mt-5">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium transition-colors duration-150"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}