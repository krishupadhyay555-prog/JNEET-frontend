// ============================================================
//  JNEET+ AI — utils/appShell.js
//  Are we running inside the Play Store app (TWA)?  ROADMAP §0: no
//  payment UI inside the app — prices, buy buttons and "upgrade"
//  links are hidden there, and the server refuses orders from it.
//  Detected once per launch: a TWA opens the site with an
//  android-app:// referrer (and our start_url will carry
//  ?source=twa). sessionStorage, not localStorage: a TWA shares
//  storage with the Chrome browser, and a normal Chrome tab must
//  still be able to pay.
// ============================================================

const KEY = "jneet_app_shell";

export function detectAppShell() {
  try {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("source") === "twa" || document.referrer.startsWith("android-app://")) {
      sessionStorage.setItem(KEY, "twa");
    }
  } catch {
    // storage blocked: treat as a normal browser
  }
}

export function isAppShell() {
  try {
    return sessionStorage.getItem(KEY) === "twa";
  } catch {
    return false;
  }
}
