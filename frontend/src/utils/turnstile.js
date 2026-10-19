// ============================================================
//  JNEET+ AI — utils/turnstile.js
//  Cloudflare Turnstile helpers. The captcha is OFF unless the build has
//  VITE_TURNSTILE_SITE_KEY, so it is safe to ship before the key exists.
//
//  The widget runs in "execute on demand" mode: it is invisible and only
//  shows a challenge if Cloudflare is suspicious. A FRESH token is
//  requested for every submit / resend (tokens are single-use).
// ============================================================

export const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
export const captchaEnabled = Boolean(SITE_KEY);

export const CAPTCHA_ERROR =
  "The security check couldn't load. Turn off any ad-blocker or VPN for this site, then try again.";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise = null;

export function loadTurnstile() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => { scriptPromise = null; reject(new Error("turnstile blocked")); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

// Adds a fresh captcha token to an API payload (no-op when captcha is off).
// Throws if the check cannot be completed, so the caller can show CAPTCHA_ERROR.
export async function withCaptcha(captchaRef, payload) {
  if (!captchaEnabled) return payload;
  let token = null;
  try {
    token = await captchaRef.current?.getToken();
  } catch { /* handled below */ }
  if (!token) throw Object.assign(new Error(CAPTCHA_ERROR), { isCaptchaError: true });
  return { ...payload, captchaToken: token };
}
