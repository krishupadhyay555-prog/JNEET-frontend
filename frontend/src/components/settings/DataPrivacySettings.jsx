// ============================================================
//  JNEET+ AI — components/settings/DataPrivacySettings.jsx
//  "Your data": download everything we hold (DPDP right of access) +
//  links to the privacy policy and a privacy request.
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance.js";
import { Spinner } from "../ui/Spinner.jsx";

export function DataPrivacySettings() {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await api.get("/user/export", { responseType: "blob", timeout: 60000 });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jneet-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast.success("Your data file is downloading.");
    } catch (err) {
      toast.error(err.response?.status === 429 ? "Please wait a minute and try again." : "Couldn't prepare your data. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 leading-relaxed">
        One file (JSON) with your account details, chats, notes, test history, AI usage and payments. Card and UPI details are never stored by us.
      </p>
      <button onClick={download} disabled={busy}
        className="flex items-center gap-2 bg-bg-panel hover:bg-bg-hover border border-bg-border text-fg-primary text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-60">
        {busy ? <Spinner size={12} /> : <Download size={13} />} Download my data
      </button>
      <p className="text-[11px] text-gray-500">
        Read our <Link to="/privacy" className="underline hover:text-fg-primary">Privacy Policy</Link> · Ask a question about your data on the{" "}
        <Link to="/contact?topic=privacy" className="underline hover:text-fg-primary">Contact page</Link>.
      </p>
    </div>
  );
}
