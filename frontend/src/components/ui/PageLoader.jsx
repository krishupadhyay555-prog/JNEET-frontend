// ============================================================
//  JNEET+ AI — components/ui/PageLoader.jsx
//  The single page / section loading state: brand-coloured spinner in a
//  box that already has the space the content needs (no layout jump).
//  After 15 s on a slow network it says so and offers a reload, so a
//  student never stares at an endless spinner.
// ============================================================
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner.jsx";

export function PageLoader({ full = false, size = "md", label = "" }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(t);
  }, []);
  const box = full ? "min-h-screen" : size === "sm" ? "min-h-[120px]" : "min-h-[40vh]";
  return (
    <div className={`${box} w-full flex flex-col items-center justify-center gap-3 text-violet-500`} aria-busy="true">
      <Spinner size={size === "sm" ? 18 : 22} />
      {label ? <p className="text-sm text-gray-500">{label}</p> : null}
      {slow ? (
        <p className="text-sm text-gray-500 text-center px-6">
          Taking longer than usual — your internet may be slow.{" "}
          <button type="button" onClick={() => window.location.reload()} className="text-violet-600 font-semibold underline min-h-[44px]">Retry</button>
        </p>
      ) : null}
    </div>
  );
}
