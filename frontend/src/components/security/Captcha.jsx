// ============================================================
//  JNEET+ AI — components/security/Captcha.jsx
//  Visible Cloudflare Turnstile box (founder, 28 Nov 2026: show it on
//  login, register, forgot password, contact and the free mock). It
//  checks on load and shows a tick; Cloudflare asks for a click only if
//  it is suspicious. Use with a ref:
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
        appearance: "always",
        size: "flexible",
        retry: "auto",
        callback: (token) => settle("resolve", token),
        "error-callback": () => settle("reject", new Error("captcha error")),
        "timeout-callback": () => settle("reject", new Error("captcha timeout")),
      });
      // Run the check once on load so the student sees the "Success" tick
      // before submitting. Submit still asks for a fresh single-use token.
      try { ts.execute(widgetRef.current); } catch { /* retried on submit */ }
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
  return <div ref={boxRef} className="flex justify-center w-full min-h-[65px]" aria-live="polite" />;
});
