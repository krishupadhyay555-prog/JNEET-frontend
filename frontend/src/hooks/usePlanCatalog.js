import { useEffect, useState } from "react";
import { paymentApi } from "../api/paymentApi.js";

// Server plan catalog (prices, features, whether payments are on).
export function usePlanCatalog() {
  const [catalog, setCatalog] = useState(null);
  useEffect(() => {
    let cancelled = false;
    paymentApi.plans().then((r) => { if (!cancelled) setCatalog(r.data); }).catch(() => { if (!cancelled) setCatalog({ enabled: false, plans: [] }); });
    return () => { cancelled = true; };
  }, []);
  return catalog;
}
