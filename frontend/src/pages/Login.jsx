// ============================================================
//  JNEET+ AI — pages/Login.jsx  (v3.3 — Email Verification aware)
//  CHANGED: status 403 from the backend can now mean TWO different
//  things — a genuinely deactivated account, OR an unverified
//  signup (new requiresVerification flag added in authController
//  v7). Previously both showed "Account deactivated", which was
//  actively wrong for the second case. Now: if requiresVerification
//  is true, the user is redirected straight to Register.jsx's OTP
//  step (via navigation state) instead of seeing an error at all —
//  a genuinely deactivated account still shows the original message.
//  Everything else (Forgot password link, layout) UNCHANGED from v3.2.
// ============================================================

import { useState }           from "react";
import { useNavigate, Link }  from "react-router-dom";
import { useAuth }            from "../context/AuthContext.jsx";
import { authApi }            from "../api/authApi.js";
import { FormField }          from "../components/auth/FormField.jsx";
import { Spinner }            from "../components/ui/Spinner.jsx";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

function clientValidate(form) {
  const errs = {};
  if (!form.email.trim())
    errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email address";
  if (!form.password)
    errs.password = "Password is required";
  return errs;
}

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,     setForm]     = useState({ email: "", password: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientErrs = clientValidate(form);
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await authApi.login({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      login(res.data.student);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const status     = err.response?.status;
      const serverErrs = err.response?.data?.fieldErrors ?? [];

      if (err.isNetworkError || err.isTimeout) {
        setErrors({ password: "Can't reach the server. Please try again in a moment." });
        return;
      }

      if (serverErrs.length > 0) {
        const mapped = {};
        serverErrs.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
        return;
      }

      if (status === 401) {
        setErrors({ password: "Incorrect email or password" });
        return;
      }

      if (status === 403) {
        // Two different meanings for the same status code — check
        // the flag before assuming "deactivated".
        if (err.response?.data?.requiresVerification) {
          navigate("/register", {
            state: { step: 2, email: err.response.data.email || form.email.trim().toLowerCase() },
          });
          return;
        }
        setErrors({ email: "Account deactivated. Please contact support." });
        return;
      }

      if (status === 429) {
        setErrors({ password: "Too many attempts. Please try again in 15 minutes." });
      } else {
        // Never surface raw backend/route text for unexpected statuses.
        setErrors({ password: "Something went wrong on our end. Please try again in a moment." });
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

          {/* Logo — real JN icon */}
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
            <p className="text-[#6B6572] text-xs mt-0.5">Welcome back — please sign in</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email — staggered entrance */}
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

            {/* Password — staggered entrance */}
            <div className="animate-fade-up" style={{ animationDelay: "140ms", animationFillMode: "backwards" }}>
              <FormField
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                autoComplete="current-password"
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
              <div className="text-right mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-[#8B8594] hover:text-[#5B9FE8] text-xs transition-colors duration-150"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
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
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#6B6572] text-xs mt-5">
            New here?{" "}
            <Link
              to="/register"
              className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium transition-colors duration-150"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}