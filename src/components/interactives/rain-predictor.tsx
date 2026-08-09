"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A real (small) model: probability of rain per calendar day, learned
// from ~30 years of monthly climatology (IDEAM averages). It is not a
// forecast — that's the whole pedagogical point: it only knows the
// patterns present in its training data.

// Fraction of rainy days per month, Bogotá. Bimodal: Apr–May and Oct–Nov.
const BOGOTA = [0.30, 0.37, 0.47, 0.60, 0.63, 0.50, 0.40, 0.40, 0.50, 0.63, 0.57, 0.37];
// Quibdó (Chocó), one of the rainiest places on Earth. Rain almost daily.
const QUIBDO = [0.84, 0.84, 0.87, 0.90, 0.90, 0.90, 0.90, 0.90, 0.88, 0.88, 0.88, 0.85];

const MONTH_MID = [15, 45, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
const MONTH_LETTER = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Cosine interpolation between month midpoints → smooth daily curve.
function dailyProb(series: number[], dayOfYear: number): number {
  const d = ((dayOfYear - 1) % 365) + 1;
  let i = MONTH_MID.findIndex((m) => m >= d);
  let a: number, b: number, t: number;
  if (i === 0) {
    a = series[11];
    b = series[0];
    t = (d + 365 - MONTH_MID[11]) / (MONTH_MID[0] + 365 - MONTH_MID[11]);
  } else if (i === -1) {
    a = series[11];
    b = series[0];
    t = (d - MONTH_MID[11]) / (MONTH_MID[0] + 365 - MONTH_MID[11]);
  } else {
    a = series[i - 1];
    b = series[i];
    t = (d - MONTH_MID[i - 1]) / (MONTH_MID[i] - MONTH_MID[i - 1]);
  }
  const s = (1 - Math.cos(Math.PI * t)) / 2;
  return a + (b - a) * s;
}

function dayOfYear(iso: string): number {
  const date = new Date(iso + "T12:00:00");
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// SVG geometry
const W = 340;
const H = 110;
const PAD_X = 8;
const PAD_TOP = 8;
const PAD_BOT = 20;

function xOf(d: number) {
  return PAD_X + ((d - 1) / 364) * (W - 2 * PAD_X);
}
function yOf(p: number) {
  return PAD_TOP + (1 - p) * (H - PAD_TOP - PAD_BOT);
}

function curvePath(series: number[], close: boolean): string {
  const pts: string[] = [];
  for (let d = 1; d <= 365; d += 4) {
    pts.push(`${xOf(d).toFixed(1)},${yOf(dailyProb(series, d)).toFixed(1)}`);
  }
  pts.push(`${xOf(365).toFixed(1)},${yOf(dailyProb(series, 365)).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  if (!close) return line;
  return `${line} L${xOf(365).toFixed(1)},${yOf(0)} L${xOf(1).toFixed(1)},${yOf(0)} Z`;
}

function verdict(p: number): string {
  if (p >= 0.55) return "Lleva paraguas";
  if (p >= 0.4) return "Puede caer un aguacero";
  return "Probablemente seco";
}

interface Props {
  // "bogota": the honest demo. "quibdo": the break-it screen — the
  // Bogotá-trained model answering for a city it has never seen.
  mode?: "bogota" | "quibdo";
}

export function RainPredictor({ mode = "bogota" }: Props) {
  const [date, setDate] = useState(todayISO());
  const reduceMotion = useReducedMotion();

  const d = useMemo(() => dayOfYear(date), [date]);
  const p = dailyProb(BOGOTA, d);
  const real = dailyProb(QUIBDO, d);
  const pct = Math.round(p * 100);
  const realPct = Math.round(real * 100);

  const marker = { x: xOf(d), y: yOf(p) };

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <label className="flex flex-col gap-1.5 flex-1">
          <span className="text-label text-muted">
            {mode === "bogota"
              ? "¿Lloverá en Bogotá? Escoge una fecha"
              : "Pregúntale al modelo por Quibdó"}
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="h-11 px-3 rounded-[var(--radius-control)] bg-sub border-hairline border text-[17px] font-mono w-full"
          />
        </label>
        <div className="flex items-baseline gap-2 sm:pb-1">
          <motion.span
            key={mode === "bogota" ? pct : `${pct}-q`}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-metric text-[28px] text-accent"
          >
            {pct} %
          </motion.span>
          <span className="text-secondary text-muted">
            {mode === "bogota" ? verdict(p) : "dice el modelo"}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Curva de probabilidad de lluvia a lo largo del año"
      >
        {/* Learned seasonal curve (the model itself, made visible) */}
        <path d={curvePath(BOGOTA, true)} fill="var(--accent)" opacity="0.14" />
        <path
          d={curvePath(BOGOTA, false)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        {mode === "quibdo" && (
          <path
            d={curvePath(QUIBDO, false)}
            fill="none"
            stroke="var(--fail)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}
        {/* Marker for the chosen date */}
        <motion.line
          animate={{ x1: marker.x, x2: marker.x }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          y1={PAD_TOP}
          y2={H - PAD_BOT}
          stroke="var(--muted)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
        <motion.circle
          animate={{ cx: marker.x, cy: marker.y }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          r="4"
          fill="var(--accent)"
        />
        {MONTH_MID.map((m, i) => (
          <text
            key={i}
            x={xOf(m)}
            y={H - 6}
            textAnchor="middle"
            className="font-mono"
            fontSize="8.5"
            fill="var(--muted)"
          >
            {MONTH_LETTER[i]}
          </text>
        ))}
      </svg>

      {mode === "quibdo" && (
        <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3 flex flex-col gap-1">
          <p className="text-secondary">
            <span className="text-fail font-medium">
              Realidad histórica en Quibdó: ~{realPct} %.
            </span>{" "}
            El modelo se equivoca por {Math.max(realPct - pct, 0)} puntos.
          </p>
          <p className="text-secondary text-muted">
            Solo conoce Bogotá: la línea punteada es el mundo que nunca vio.
          </p>
        </div>
      )}

      <p className="text-label text-muted">
        Modelo entrenado con promedios históricos de lluvia (IDEAM). No es un
        pronóstico del tiempo: es un patrón aprendido
      </p>
    </div>
  );
}
