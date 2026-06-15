// ============================================================
//  JNEET+ AI — pages/Login.jsx  (Production v2.0)
//  Gmail-style: persistent inline red errors below each field.
//  No toasts for form validation. Cookie-based auth.
// ============================================================

import { useState }           from "react";
import { useNavigate, Link }  from "react-router-dom";
import { useAuth }            from "../context/AuthContext.jsx";
import { authApi }            from "../api/authApi.js";
import { FormField }          from "../components/auth/FormField.jsx";
import { Spinner }            from "../components/ui/Spinner.jsx";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

function clientValidate(form) {
  const errs = {};
  if (!form.email.trim())
    errs.email = "Email daalo";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Valid email chahiye";
  if (!form.password)
    errs.password = "Password daalo";
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
    // Clear the error for this field as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation first — persistent inline, no toasts
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

      // Backend sets httpOnly cookie — just update React state
      login(res.data.student);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const status     = err.response?.status;
      const serverErrs = err.response?.data?.fieldErrors ?? [];
      const serverMsg  = err.response?.data?.error ?? "";

      if (err.isNetworkError || err.isTimeout) {
        setErrors({ password: "Server se connect nahi ho raha. Backend chal raha hai?" });
        return;
      }

      if (serverErrs.length > 0) {
        // Map field-level errors from backend Zod validation
        const mapped = {};
        serverErrs.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
        return;
      }

      // Generic backend errors — place on most relevant field
      if (status === 401) {
        setErrors({ password: "Email ya password galat hai" });
      } else if (status === 403) {
        setErrors({ email: "Account deactivated. Support se contact karo." });
      } else if (status === 429) {
        setErrors({ password: "Bahut zyada attempts. 15 minute baad try karo." });
      } else {
        setErrors({ password: serverMsg || "Kuch galat ho gaya. Dobara try karo." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[500px] bg-violet-700/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative animate-fade-up">
        <div className="bg-bg-surface border border-bg-border rounded-2xl p-7 shadow-card">

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-11 h-11 bg-violet-600 rounded-xl flex items-center
              justify-center mb-3 shadow-glow-violet">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">JNEET+ AI</h1>
            <p className="text-gray-600 text-xs mt-0.5">Welcome back — login karein</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="apna@email.com"
              autoComplete="email"
              disabled={loading}
            />

            {/* Password */}
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
                  text-gray-600 hover:text-gray-400 transition p-0.5"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </FormField>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold py-2.5 rounded-xl transition
                flex items-center justify-center gap-2 text-sm mt-1
                shadow-glow-sm active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Spinner size={15} />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-700 text-xs mt-5">
            Naya account?{" "}
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition"
            >
              Register karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}