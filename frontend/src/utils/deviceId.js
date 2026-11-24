// A random id this browser keeps, sent only at sign-up so the server can
// cap how many new accounts one device makes per day (stops free-AI
// farming). Not linked to anything else; null if storage is blocked.
export function deviceId() {
  try {
    let id = localStorage.getItem("jn_device");
    if (!id || !/^[A-Za-z0-9-]{8,64}$/.test(id)) {
      id = (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);
      localStorage.setItem("jn_device", id);
    }
    return id;
  } catch {
    return null;
  }
}
