export function Spinner({ size = 16, className = "" }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`border-2 border-white/20 border-t-white rounded-full animate-spin-slow shrink-0 ${className}`}
    />
  );
}