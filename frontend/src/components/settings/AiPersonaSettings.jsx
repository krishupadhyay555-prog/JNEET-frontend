// ============================================================
//  JNEET+ AI — components/settings/AiPersonaSettings.jsx
//  Pick how the AI mentor talks. Both styles teach the same way
//  (hints first, NCERT-anchored, same safety rules); only the tone differs.
// ============================================================

import { useState } from "react";
import toast        from "react-hot-toast";
import { Check }    from "lucide-react";
import { useAuth }  from "../../context/AuthContext.jsx";
import { userApi }  from "../../api/userApi.js";

const OPTIONS = [
  { value: "mentor", title: "Mentor", blurb: "Calm, focused senior teacher. Clear and encouraging." },
  { value: "fun",    title: "Fun",    blurb: "Friendly and light, with a little humour. Teaches exactly the same way." },
];

export function AiPersonaSettings() {
  const { user, setStudent } = useAuth();
  const [saving, setSaving] = useState(null);
  const current = user?.persona ?? "mentor";

  const choose = async (value) => {
    if (value === current || saving) return;
    setSaving(value);
    try {
      const res = await userApi.updatePreferences({ persona: value });
      setStudent(res.data.student);
      toast.success(value === "fun" ? "Fun mode on" : "Mentor mode on");
    } catch {
      toast.error("Couldn't save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="AI mentor style">
      {OPTIONS.map((o) => {
        const active = current === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!!saving}
            onClick={() => choose(o.value)}
            className={`relative text-left rounded-xl border p-3.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-60
              ${active ? "border-violet-600/50 bg-violet-600/10" : "border-bg-border bg-bg-panel hover:border-violet-600/30"}`}
          >
            {active && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center">
                <Check size={10} className="text-white" />
              </span>
            )}
            <p className="text-sm font-semibold text-fg-primary">{o.title}</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">{o.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
