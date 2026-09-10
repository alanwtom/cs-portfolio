import { useEffect, useState } from "react";

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  // Read the preference during the FIRST render, not in the effect below.
  // Framer only looks at `initial` once, when a component mounts, so a hook
  // that starts at false and corrects itself a tick later has already let the
  // animation start — the setting was being ignored for anything that mounts
  // mid-session. Safe to read here: the whole page is client-only (the server
  // sends the loading spinner), so there's no hydration mismatch to cause.
  const [reduced, setReduced] = useState(prefersReduced);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}
