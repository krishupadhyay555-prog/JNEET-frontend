import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi.js";

// Live counts for the public pages (question bank size, chapters, OneShots).
export function usePublicStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let cancelled = false;
    publicApi.stats().then((r) => { if (!cancelled) setStats(r.data); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return stats;
}

export const fmtCount = (n) => (n >= 1000 ? `${(Math.floor(n / 100) * 100).toLocaleString("en-IN")}+` : String(n));
