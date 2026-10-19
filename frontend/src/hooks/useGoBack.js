import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Back button that never throws the student out of the app: if there is
// in-app history go back, otherwise (deep link, refreshed tab, opened from a
// notification) go to a sensible fallback page.
export function useGoBack(fallback = "/dashboard") {
  const navigate = useNavigate();
  return useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, fallback]);
}
