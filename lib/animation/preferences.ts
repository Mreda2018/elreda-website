export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)" as const;

export function canUseDOM(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function prefersReducedMotion(): boolean {
  if (!canUseDOM() || typeof window.matchMedia !== "function") {
    return true;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function createReducedMotionListener(
  onChange: (prefersReducedMotion: boolean) => void,
): () => void {
  if (!canUseDOM() || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  const handleChange = (event: MediaQueryListEvent) => {
    onChange(event.matches);
  };

  mediaQueryList.addEventListener("change", handleChange);

  return () => {
    mediaQueryList.removeEventListener("change", handleChange);
  };
}

