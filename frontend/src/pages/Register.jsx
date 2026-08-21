// ============================================================
//  JNEET+ AI — pages/Register.jsx  (v3.3 — real logo)
//  CHANGED: the gradient-badge Sparkles icon replaced with the
//  app's own JN logo image — the badge now just frames the actual
//  logo instead of a generic sparkle. Everything else (validation,
//  layout, colors, animations) UNCHANGED from v3.2.
// ============================================================

import { useState }          from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }           from "../context/AuthContext.jsx";
import { authApi }           from "../api/authApi.js";
import { FormField }         from "../components/auth/FormField.jsx";
import { Spinner }           from "../components/ui/Spinner.jsx";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

function validate(form) {
  const errs = {};

  if (!form.name.trim())
    errs.name = "Name is required";
  else if (form.name.trim().length < 2)
    errs.name = "Name must be at least 2 characters";
  else if (form.name.trim().length > 50)
    errs.name = "Name cannot exceed 50 characters";

  if (!form.email.trim())
    errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email address";

  if (!form.password)
    errs.password = "Password is required";
  else if (form.password.length < 8)
    errs.password = "Password must be at least 8 characters";
  else if (form.password.length > 128)
    errs.password = "Password is too long";
  else if (!/[A-Za-z]/.test(form.password))
    errs.password = "Password must include at least one letter";
  else if (!/[0-9]/.test(form.password))
    errs.password = "Password must include at least one number";

  return errs;
}

export default function Register() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    examMode: "NEET",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientErrs = validate(form);
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await authApi.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        examMode: form.examMode,
      });

      login(res.data.student);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const status     = err.response?.status;
      const serverErrs = err.response?.data?.fieldErrors ?? [];
      const serverMsg  = err.response?.data?.error        ?? "";

      if (err.isNetworkError || err.isTimeout) {
        setErrors({ name: "Can't reach the server. Is the backend running?" });
        return;
      }

      if (serverErrs.length > 0) {
        const mapped = {};
        serverErrs.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setErrors(mapped);
        return;
      }

      if (status === 409) {
        setErrors({ email: "This email is already registered. Please log in instead." });
      } else if (status === 429) {
        setErrors({ name: "Too many attempts. Please try again later." });
      } else {
        setErrors({ name: serverMsg || "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFC] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Ambient gradient wash — soft blue + pink glows, very light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            <p className="text-[#6B6572] text-xs mt-0.5">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div className="animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
              <FormField
                label="Full Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="animate-fade-up" style={{ animationDelay: "120ms", animationFillMode: "backwards" }}>
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

            {/* Password */}
            <div className="animate-fade-up" style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>
              <FormField
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Min. 8 characters, letters + numbers"
                autoComplete="new-password"
                disabled={loading}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B95A8] hover:text-[#6B6572] transition-colors duration-150 p-0.5"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </FormField>
            </div>

            {/* Exam mode */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
              <label className="text-xs text-[#6B6572] block mb-1.5 font-medium">
                Which exam are you preparing for?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "NEET", label: "🩺 NEET UG"   },
                  { value: "JEE",  label: "⚙️ JEE Mains" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, examMode: value }))}
                    className={[
                      "py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border active:scale-[0.97]",
                      form.examMode === value
                        ? "bg-gradient-to-br from-[#93C5FD] to-[#F5A9C8] border-transparent text-white shadow-[0_4px_14px_rgba(147,197,253,0.35)]"
                        : "bg-white border-[#EDE6F3] text-[#6B6572] hover:border-[#93C5FD]/50 hover:text-[#2D2A32]",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#6B6572] text-xs mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#5B9FE8] hover:text-[#3D7DC9] font-medium transition-colors duration-150"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}