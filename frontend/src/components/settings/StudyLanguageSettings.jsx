// ============================================================
//  JNEET+ AI — components/settings/StudyLanguageSettings.jsx
//  The app itself is always in English. This only decides the
//  language of STUDY content: the AI mentor's replies and OneShot pages.
//    auto     — AI answers in whatever language you write (default)
//    english  — AI and OneShot in English
//    hinglish — AI and OneShot in Hinglish
// ============================================================

import { useState } from "react";
import toast        from "react-hot-toast";
import { Check }    from "lucide-react";
import { useAuth }  from "../../context/AuthContext.jsx";
import { userApi }  from "../../api/userApi.js";

const OPTIONS = [
  { value: "auto",     title: "Match my language", blurb: "The AI replies in the language you write — English, Hindi, Bengali, Tamil, Marathi, Gujarati… OneShot pages in English." },
  { value: "english",  title: "English",           blurb: "AI replies and OneShot pages in simple English." },
  { value: "hinglish", title: "Hinglish",          blurb: "AI replies and OneShot pages in Hinglish (Hindi in English letters)." },
];

export function StudyLanguageSettings() {
  const { user, setStudent } = useAuth();
  const [saving, setSaving] = useState(null);
  const current = user?.studyLanguage ?? "auto";

  const choose = async (value) => {
    if (value === current || saving) return;
    setSaving(value);
    try {
      const res = await userApi.updatePreferences({ studyLanguage: value });
      setStudent(res.data.student);
      toast.success(`Study language: ${OPTIONS.find((o) => o.value === value)?.title}`);
    } catch {
      toast.error("Couldn't save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Study language">
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
            <p className="text-sm font-semibold text-fg-primary pr-5">{o.title}</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">{o.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
