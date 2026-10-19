import { useState, useRef, useCallback, useEffect } from "react";
import { copyText } from "../utils/clipboard.js";
import toast from "react-hot-toast";

// copy(text) → shows `copied` for 1.6s; toasts only on failure.
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async (text) => {
    const ok = await copyText(text);
    if (!ok) { toast.error("Couldn't copy. Select the text and copy manually."); return false; }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
    return true;
  }, []);
  return [copied, copy];
}
