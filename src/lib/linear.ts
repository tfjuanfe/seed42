// Ordinary least squares + error metrics for the fit-the-line module.

export interface Pt {
  x: number;
  y: number;
}

export function ols(points: Pt[]): { m: number; b: number } {
  const n = points.length;
  const mx = points.reduce((a, p) => a + p.x, 0) / n;
  const my = points.reduce((a, p) => a + p.y, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - mx) * (p.y - my);
    den += (p.x - mx) ** 2;
  }
  const m = den === 0 ? 0 : num / den;
  return { m, b: my - m * mx };
}

// Mean absolute error — easier to narrate than MSE for a first course.
export function mae(points: Pt[], m: number, b: number): number {
  return (
    points.reduce((a, p) => a + Math.abs(p.y - (m * p.x + b)), 0) / points.length
  );
}
