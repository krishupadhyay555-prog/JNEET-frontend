// ============================================================
//  JNEET+ AI — components/auth/FormField.jsx
//  Pure presentational component. Zero logic. Zero next() calls.
//  Google-style: persistent red error text directly below input.
//  No toasts. No timers. Error stays until the field is corrected.
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
  children,       // optional overlay slot (e.g. show/hide password button)
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs text-gray-500 block mb-1.5 font-medium select-none"
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
            "w-full bg-bg-surface border rounded-xl px-4 py-2.5",
            "text-sm text-white placeholder-gray-700",
            "focus:outline-none transition duration-150 font-sans",
            children ? "pr-10" : "",
            error
              ? "border-red-500/70 focus:border-red-500"
              : "border-bg-border focus:border-violet-500/70",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Optional overlay (password toggle, etc.) */}
        {children}
      </div>

      {/* Persistent inline error — survives re-renders until field is fixed */}
      {error ? (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[9px] font-bold shrink-0">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}