// ============================================================
//  JNEET+ AI — components/auth/FormField.jsx  (Light Brand Theme)
//  Used only on brand-level pages (Login/Register) — the rest of
//  the app (Dashboard/Chat) keeps its own dark, exam-mode theme.
//  Pure presentational component. Zero logic changed.
// ============================================================

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  disabled,
  autoComplete,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs text-[#8B8594] block mb-1.5 font-medium select-none"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "w-full bg-white border rounded-xl px-4 py-2.5",
            "text-sm text-[#2D2A32] placeholder-[#B8B2C2]",
            "focus:outline-none transition-all duration-200 font-sans",
            children ? "pr-10" : "",
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
              : "border-[#EDE6F3] focus:border-[#93C5FD] focus:shadow-[0_0_0_3px_rgba(147,197,253,0.14)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {children}
      </div>

      {error ? (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 animate-fade-in">
          <span className="w-3.5 h-3.5 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-[9px] font-bold shrink-0 text-red-500">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}