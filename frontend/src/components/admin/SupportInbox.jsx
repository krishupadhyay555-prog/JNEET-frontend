// ============================================================
//  JNEET+ AI — components/admin/SupportInbox.jsx
//  Founder inbox for the public Contact form. Reply from your own email
//  (the "Reply" link opens it with the reference in the subject), then
//  press Close.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Inbox, Mail } from "lucide-react";
import { supportAdminApi } from "../../api/testApi.js";
import { Spinner } from "../ui/Spinner.jsx";
import { PageLoader } from "../ui/PageLoader.jsx";

const dt = (d) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

export function SupportInbox() {
  const [status, setStatus] = useState("open");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async (s) => {
    try { const r = await supportAdminApi.list(s); setData(r.data); setError(""); }
    catch { setError("Couldn't load messages."); }
  }, []);
  useEffect(() => { load(status); }, [status, load]);

  const act = async (id, next) => {
    setBusy(id);
    try { await supportAdminApi.setStatus(id, next); await load(status); }
    catch { setError("Couldn't update. Try again."); }
    finally { setBusy(null); }
  };

  return (
    <section className="bg-bg-card border border-bg-border rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-fg-primary"><Inbox size={14} /> Support inbox</h2>
        <div className="flex gap-1" role="tablist">
          {[["open", "Open"], ["closed", "Closed"]].map(([k, label]) => (
            <button key={k} role="tab" aria-selected={status === k} onClick={() => setStatus(k)}
              className={`text-[11.5px] px-2.5 py-1 rounded-lg border ${status === k ? "bg-violet-600 border-violet-600 text-white" : "border-bg-border text-gray-600 hover:text-fg-primary"}`}>
              {label}{data?.counts ? ` · ${data.counts[k]}` : ""}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-tone-warn mb-2">{error}</p>}
      {!data ? (
        <PageLoader size="sm" />
      ) : data.items.length === 0 ? (
        <p className="text-[12.5px] text-gray-600">{status === "open" ? "Inbox zero. 🎉" : "Nothing closed yet."}</p>
      ) : (
        <ul className="space-y-3">
          {data.items.map((m) => (
            <li key={m.id} className="border border-bg-border rounded-xl p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] text-gray-600">
                  <span className="font-semibold text-fg-primary">{m.ref}</span> · {m.topicLabel} · {dt(m.createdAt)}{m.signedIn ? " · student account" : ""}
                </p>
                <div className="flex gap-1.5 shrink-0">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: your message ${m.ref} — JNEET+ AI`)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-violet-600 text-white"><Mail size={11} /> Reply</a>
                  <button disabled={busy === m.id} onClick={() => act(m.id, status === "open" ? "closed" : "open")}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-bg-border text-gray-600 hover:text-fg-primary disabled:opacity-60">
                    {status === "open" ? "Close" : "Re-open"}
                  </button>
                </div>
              </div>
              <p className="text-[12.5px] text-fg-primary mt-1.5"><b>{m.name}</b> · {m.email}</p>
              <p className="text-[13px] text-fg-primary mt-1.5 whitespace-pre-wrap leading-relaxed">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
