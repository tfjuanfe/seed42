// The Bogotá rain model + chart geometry, shared by RainPredictor
// (module 01) and CorruptibleRain (module 03).

// Fraction of rainy days per month, Bogotá. Bimodal: Apr–May and Oct–Nov.
export const BOGOTA = [0.30, 0.37, 0.47, 0.60, 0.63, 0.50, 0.40, 0.40, 0.50, 0.63, 0.57, 0.37];
// Quibdó (Chocó), one of the rainiest places on Earth. Rain almost daily.
export const QUIBDO = [0.84, 0.84, 0.87, 0.90, 0.90, 0.90, 0.90, 0.90, 0.88, 0.88, 0.88, 0.85];

export const MONTH_MID = [15, 45, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
export const MONTH_LETTER = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Cosine interpolation between month midpoints → smooth daily curve.
export function dailyProb(series: number[], dayOfYear: number): number {
  const d = ((dayOfYear - 1) % 365) + 1;
  const i = MONTH_MID.findIndex((m) => m >= d);
  let a: number, b: number, t: number;
  if (i === 0 || i === -1) {
    a = series[11];
    b = series[0];
    const span = MONTH_MID[0] + 365 - MONTH_MID[11];
    t = i === 0 ? (d + 365 - MONTH_MID[11]) / span : (d - MONTH_MID[11]) / span;
  } else {
    a = series[i - 1];
    b = series[i];
    t = (d - MONTH_MID[i - 1]) / (MONTH_MID[i] - MONTH_MID[i - 1]);
  }
  const s = (1 - Math.cos(Math.PI * t)) / 2;
  return a + (b - a) * s;
}

export function dayOfYear(iso: string): number {
  const date = new Date(iso + "T12:00:00");
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Shared SVG geometry
export const CHART = { W: 340, H: 110, PAD_X: 8, PAD_TOP: 8, PAD_BOT: 20 };

export function xOf(d: number) {
  return CHART.PAD_X + ((d - 1) / 364) * (CHART.W - 2 * CHART.PAD_X);
}
export function yOf(p: number) {
  return CHART.PAD_TOP + (1 - p) * (CHART.H - CHART.PAD_TOP - CHART.PAD_BOT);
}

export function curvePath(series: number[], close: boolean): string {
  const pts: string[] = [];
  for (let d = 1; d <= 365; d += 4) {
    pts.push(`${xOf(d).toFixed(1)},${yOf(dailyProb(series, d)).toFixed(1)}`);
  }
  pts.push(`${xOf(365).toFixed(1)},${yOf(dailyProb(series, 365)).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  if (!close) return line;
  return `${line} L${xOf(365).toFixed(1)},${yOf(0)} L${xOf(1).toFixed(1)},${yOf(0)} Z`;
}
