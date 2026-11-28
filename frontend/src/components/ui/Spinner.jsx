// One spinner for the whole app. It takes the colour of the text around
// it (white on a teal button, brand colour inside <PageLoader>), so it is
// visible in light AND dark mode. Slow, smooth spin; reduced-motion
// users get the global "instant" rule from index.css.
export function Spinner({ size = 16, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={`inline-block border-2 border-current border-r-transparent rounded-full animate-spin-slow shrink-0 opacity-90 ${className}`}
    />
  );
}
