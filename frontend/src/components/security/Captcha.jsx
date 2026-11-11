// ============================================================
//  JNEET+ AI — components/security/Captcha.jsx
//  Invisible Cloudflare Turnstile. Renders nothing visible unless
//  Cloudflare needs the student to tick a box. Use with a ref:
//     const captchaRef = useRef(null);
//     <Captcha ref={captchaRef} />
//     const token = await captchaRef.current.getToken();   // fresh each call
// ============================================================

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { SITE_KEY, captchaEnabled, loadTurnstile } from "../../utils/turnstile.js";

const TOKEN_TIMEOUT_MS = 20000;

export const Captcha = forwardRef(function Captcha(_props, ref) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const readyRef = useRef(null);       // promise that resolves when the widget exists
  const pendingRef = useRef(null);     // { resolve, reject, timer } of the token being fetched

  useEffect(() => {
    if (!captchaEnabled || !boxRef.current) return undefined;
    let cancelled = false;

    const settle = (fn, value) => {
      const p = pendingRef.current;
      if (!p) return;
      clearTimeout(p.timer);
      pendingRef.current = null;
      p[fn](value);
    };

    readyRef.current = loadTurnstile().then((ts) => {
      if (cancelled || !boxRef.current) return null;
      widgetRef.current = ts.render(boxRef.current, {
        sitekey: SITE_KEY,
        execution: "execute",
        appearance: "interaction-only",
        retry: "auto",
        callback: (token) => settle("resolve", token),
        "error-callback": () => settle("reject", new Error("captcha error")),
        "timeout-callback": () => settle("reject", new Error("captcha timeout")),
      });
      return ts;
    });
    readyRef.current.catch(() => { /* surfaced by getToken() */ });

    return () => {
      cancelled = true;
      const p = pendingRef.current;
      if (p) { clearTimeout(p.timer); pendingRef.current = null; }
      try { if (widgetRef.current != null) window.turnstile?.remove(widgetRef.current); } catch { /* already gone */ }
      widgetRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    // A brand-new token for exactly one request.
    getToken: async () => {
      if (!captchaEnabled) return null;
      const ts = await readyRef.current;
      if (!ts || widgetRef.current == null) throw new Error("captcha unavailable");
      return new Promise((resolve, reject) => {
        const prev = pendingRef.current;
        if (prev) { clearTimeout(prev.timer); prev.reject(new Error("superseded")); }
        const timer = setTimeout(() => {
          pendingRef.current = null;
          reject(new Error("captcha timeout"));
        }, TOKEN_TIMEOUT_MS);
        pendingRef.current = { resolve, reject, timer };
        ts.reset(widgetRef.current);
        ts.execute(widgetRef.current);
      });
    },
  }), []);

  if (!captchaEnabled) return null;
  return <div ref={boxRef} className="flex justify-center empty:hidden" aria-live="polite" />;
});
