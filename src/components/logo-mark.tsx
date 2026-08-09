// The Seed42 mark: a 3×3 cell grid at varying intensity — the progress
// motif compressed into a logo. Pure SVG, inherits size via className.
export function LogoMark({ className = "w-5 h-5" }: { className?: string }) {
  const cells = [0.25, 0.55, 0.9, 0.4, 1, 0.55, 0.15, 0.4, 0.25];
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden="true">
      {cells.map((o, i) => (
        <rect
          key={i}
          x={(i % 3) * 12}
          y={Math.floor(i / 3) * 12}
          width="10"
          height="10"
          rx="2.5"
          fill="var(--accent)"
          opacity={o}
        />
      ))}
    </svg>
  );
}
