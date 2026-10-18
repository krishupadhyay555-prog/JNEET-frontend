// ============================================================
//  JNEET+ AI — components/settings/ChangePasswordSettings.jsx
//  Changing the password signs every OTHER device out (this one stays in).
// ============================================================

import { useState } from "react";
import toast        from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth }  from "../../context/AuthContext.jsx";
import { PasswordStrength } from "../auth/PasswordStrength.jsx";
import { passwordMeetsPolicy } from "../../utils/password.js";
import { Spinner }  from "../ui/Spinner.jsx";

const inputCls =
  "w-full bg-bg-panel border border-bg-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-fg-primary placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition";

export function ChangePasswordSettings() {
  const { changePassword } = useAuth();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const reset = () => { setOpen(false); setCurrent(""); setNext(""); setErrors({}); setShow(false); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!current) errs.currentPassword = "Enter your current password";
    if (!passwordMeetsPolicy(next)) errs.newPassword = "Use at least 8 characters with a letter and a number";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setBusy(true); setErrors({});
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      toast.success("Password updated. Other devices were logged out.");
      reset();
    } catch (err) {
      const fields = err.response?.data?.fieldErrors ?? [];
      if (fields.length) setErrors(Object.fromEntries(fields.map(({ field, message }) => [field, message])));
      else setErrors({ currentPassword: err.response?.data?.error || "Couldn't update the password. Please try again." });
    } finally { setBusy(false); }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="border border-bg-border hover:bg-bg-hover text-fg-primary text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-95">
        Change password
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 animate-fade-up" noValidate>
      <div>
        <input type={show ? "text" : "password"} value={current} autoComplete="current-password"
          onChange={(e) => { setCurrent(e.target.value); setErrors({}); }} placeholder="Current password"
          aria-label="Current password" className={inputCls} />
        {errors.currentPassword ? <p role="alert" className="text-red-400 text-xs mt-1">{errors.currentPassword}</p> : null}
      </div>
      <div>
        <div className="relative">
          <input type={show ? "text" : "password"} value={next} autoComplete="new-password"
            onChange={(e) => { setNext(e.target.value); setErrors({}); }} placeholder="New password"
            aria-label="New password" className={`${inputCls} pr-10`} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide passwords" : "Show passwords"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-fg-primary">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <PasswordStrength password={next} />
        {errors.newPassword ? <p role="alert" className="text-red-400 text-xs mt-1">{errors.newPassword}</p> : null}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={reset} disabled={busy}
          className="flex-1 border border-bg-border text-gray-400 hover:bg-bg-hover rounded-xl py-2 text-xs font-semibold transition">Cancel</button>
        <button type="submit" disabled={busy}
          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-2 text-xs transition disabled:opacity-50 flex items-center justify-center gap-2">
          {busy ? <Spinner size={12} /> : null} Update password
        </button>
      </div>
    </form>
  );
}
