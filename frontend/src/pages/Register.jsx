// ============================================================
//  JNEET+ AI — pages/Register.jsx
//  Pure React state machine. Zero next() calls. Zero middleware.
//  Cookie auth: login(userData) sets React state only —
//  the httpOnly cookie is written by the browser from the response.
// ============================================================

import { useState }          from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }           from "../context/AuthContext.jsx";
import { authApi }           from "../api/authApi.js";
import { FormField }         from "../components/auth/FormField.jsx";
import { Spinner }           from "../components/ui/Spinner.jsx";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

// ── Client-side validation — returns { fieldName: errorMsg } ──
// Called before the network request. On failure we setErrors() and
// return early — no server call made, no next(), no middleware.
function validate(form) {
  const errs = {};

  if (!form.name.trim())
    errs.name = "Naam required hai";
  else if (form.name.trim().length < 2)
    errs.name = "Naam 2+ characters ka hona chahiye";
  else if (form.name.trim().length > 50)
    errs.name = "Naam 50 characters se zyada nahi ho sakta";

  if (!form.email.trim())
    errs.email = "Email required hai";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Valid email daalo";

  if (!form.password)
    errs.password = "Password required hai";
  else if (form.password.length < 6)
    errs.password = "Password 6+ characters ka hona chahiye";
  else if (form.password.length > 128)
    errs.password = "Password bahut lamba hai";

  return errs;
}

export default function Register() {
  const { login }   = useAuth();      // (userData) => void — sets React state
  const navigate    = useNavigate();  // () => void — React Router navigation

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    examMode: "NEET",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ── Field change: update form state, clear that field's error ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Form submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client validation — bail early with inline errors, no network call
    const clientErrs = validate(form);
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 2. POST to backend — withCredentials handled by axiosInstance
      const res = await authApi.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        examMode: form.examMode,
      });

      // 3. Backend set httpOnly cookie automatically.
      //    We only need to update React state with the returned user object.
      login(res.data.student);

      // 4. Navigate to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const status     = err.response?.status;
      const serverErrs = err.response?.data?.fieldErrors ?? [];
      const serverMsg  = err.response?.data?.error        ?? "";

      // Network / timeout — no response object
      if (err.isNetworkError || err.isTimeout) {
        setErrors({ name: "Server se connect nahi ho raha. Backend chal raha hai?" });
        return;
      }

      // Backend returned structured field errors (Zod validation)
      if (serverErrs.length > 0) {
        const mapped = {};
        serverErrs.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setErrors(mapped);
        return;
      }

      // Known HTTP status codes
      if (status === 409) {
        setErrors({ email: "Yeh email already registered hai. Login karo." });
      } else if (status === 429) {
        setErrors({ name: "Bahut zyada attempts. Kuch der baad try karo." });
      } else {
        setErrors({ name: serverMsg || "Kuch galat ho gaya. Dobara try karo." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-8">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-700/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative animate-fade-up">
        <div className="bg-bg-surface border border-bg-border rounded-2xl p-7 shadow-card">

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-11 h-11 bg-violet-600 rounded-xl flex items-center justify-center mb-3 shadow-glow-violet">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">JNEET+ AI</h1>
            <p className="text-gray-600 text-xs mt-0.5">Apna account banao</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Tumhara naam"
              autoComplete="name"
              disabled={loading}
            />

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
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              disabled={loading}
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition p-0.5"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </FormField>

            {/* Exam mode */}
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">
                Konsa exam de rahe ho?
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
                      "py-2.5 rounded-xl font-semibold text-sm transition border active:scale-[0.97]",
                      form.examMode === value
                        ? "bg-violet-600 border-violet-600 text-white shadow-glow-sm"
                        : "bg-transparent border-bg-border text-gray-500 hover:border-violet-500/50 hover:text-white",
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
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-1 shadow-glow-sm active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Spinner size={15} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-700 text-xs mt-5">
            Already account hai?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition"
            >
              Login karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}