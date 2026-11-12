// ============================================================
//  JNEET+ AI — hooks/useRecap.js
//  "Pichli baar ka recap": asks the server what the student studied in
//  their last chat (null when there is nothing honest to offer) and
//  starts 5 verified bank questions on it as a normal Revision attempt.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { recapApi } from "../api/learnApi.js";

export function recapChapterText(recap) {
  if (!recap?.chapters?.length) return "";
  return recap.chapters.map((c) => c.chapter).join(", ");
}

export function useRecap(examMode) {
  const navigate = useNavigate();
  // Keyed by exam so a NEET recap never shows in JEE mode (and no reset
  // is needed inside the effect).
  const [found, setFound]       = useState({ key: null, recap: null });
  const recap = found.key === examMode ? found.recap : null;
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    recapApi.get()
      .then((res) => { if (!cancelled) setFound({ key: examMode, recap: res.data.recap ?? null }); })
      .catch(() => { if (!cancelled) setFound({ key: examMode, recap: null }); });   // a recap is a bonus — never an error screen
    return () => { cancelled = true; };
  }, [examMode]);

  const start = useCallback(async () => {
    if (!recap || starting) return;
    setStarting(true);
    try {
      const res = await recapApi.start(recap.sessionId, 5);
      navigate(`/revision/attempt/${res.data.attemptId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not start the recap. Please try again.");
      if (err.response?.status === 404) setFound({ key: examMode, recap: null });
      setStarting(false);
    }
  }, [recap, starting, navigate, examMode]);

  return { recap, start, starting };
}
