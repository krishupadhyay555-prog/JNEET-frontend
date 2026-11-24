// "Listen" to an AI answer (Elite). Audio is made on the server only when
// tapped, cached there, and kept here for the session.
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Volume2, Square, Loader2 } from "lucide-react";
import api from "../../api/axiosInstance.js";
import { useAuth } from "../../context/AuthContext.jsx";

const urls = new Map();   // message text → blob URL (this session)

export function ListenButton({ text, className = "" }) {
  const { user } = useAuth();
  const [state, setState] = useState("idle");   // idle | loading | playing
  const audio = useRef(null);
  useEffect(() => () => audio.current?.pause(), []);

  const stop = () => { audio.current?.pause(); setState("idle"); };
  const play = async () => {
    if (user?.plan !== "elite") { toast("Listening to answers is part of Elite.", { icon: "🔊" }); return; }
    if (state === "playing") return stop();
    try {
      let url = urls.get(text);
      if (!url) {
        setState("loading");
        const res = await api.post("/ai/tts", { text }, { responseType: "blob" });
        url = URL.createObjectURL(res.data);
        urls.set(text, url);
      }
      const a = new Audio(url);
      audio.current = a;
      a.onended = () => setState("idle");
      await a.play();
      setState("playing");
    } catch (err) {
      setState("idle");
      let msg = "Couldn't play the answer. Please try again.";
      try { msg = JSON.parse(await err.response?.data?.text?.())?.error || msg; } catch { /* not JSON */ }
      toast.error(msg);
    }
  };

  return (
    <button type="button" onClick={play} aria-label={state === "playing" ? "Stop" : "Listen"} title={state === "playing" ? "Stop" : "Listen"}
      className={`p-1.5 rounded-lg text-gray-500 hover:text-fg-primary hover:bg-bg-hover transition ${className}`}>
      {state === "loading" ? <Loader2 size={14} className="animate-spin" /> : state === "playing" ? <Square size={13} /> : <Volume2 size={14} />}
    </button>
  );
}
