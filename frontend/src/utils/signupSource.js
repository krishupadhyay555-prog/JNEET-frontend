// Remembers where a visitor came from (?utm_*=… or ?src=…) for 30 days so
// the sign-up can record it. First touch wins; only short plain values.
const KEY = "jn_src";
const FIELDS = ["src", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function captureSource(search = window.location.search, extra = {}) {
  try {
    const q = new URLSearchParams(search);
    const found = {};
    for (const f of FIELDS) {
      const v = (extra[f] ?? q.get(f) ?? "").trim().slice(0, 60);
      if (v && /^[\w.\-+ ]+$/.test(v)) found[f] = v;
    }
    if (!Object.keys(found).length) return;
    const old = JSON.parse(localStorage.getItem(KEY) || "null");
    if (old && Date.now() - old.at < 30 * 864e5) return; // keep the first touch
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), v: found }));
  } catch { /* storage blocked */ }
}

export function signupSource() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    return s && Date.now() - s.at < 30 * 864e5 ? s.v : null;
  } catch { return null; }
}
