"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Slider } from "./slider";

// Predicted TransMilenio-style occupancy by hour, learned from typical
// weekday demand curves: morning and evening rush peaks.
const HOURS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const OCCUPANCY = [22, 55, 90, 96, 80, 55, 40, 38, 45, 42, 40, 45, 55, 75, 93, 85, 60, 40, 28];

const W = 340;
const H = 100;
const PAD = { x: 10, top: 8, bot: 18 };

function xOf(hour: number) {
  return PAD.x + ((hour - 4) / 18) * (W - 2 * PAD.x);
}
function yOf(v: number) {
  return PAD.top + (1 - v / 100) * (H - PAD.top - PAD.bot);
}

function pathOf(close: boolean) {
  const pts = HOURS.map((h, i) => `${xOf(h).toFixed(1)},${yOf(OCCUPANCY[i]).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  return close ? `${line} L${xOf(22)},${yOf(0)} L${xOf(4)},${yOf(0)} Z` : line;
}

function interpolate(hour: number): number {
  const i = HOURS.findIndex((h) => h >= hour);
  if (i <= 0) return OCCUPANCY[Math.max(i, 0)];
  const t = (hour - HOURS[i - 1]) / (HOURS[i] - HOURS[i - 1]);
  return OCCUPANCY[i - 1] + (OCCUPANCY[i] - OCCUPANCY[i - 1]) * t;
}

function verdict(v: number): string {
  if (v >= 85) return "Vas como sardina en lata";
  if (v >= 60) return "Apretado, pero entras";
  if (v >= 40) return "Va lleno pero respirable";
  return "Hasta puesto te toca";
}

function fmtHour(h: number): string {
  const ampm = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ampm}`;
}

export function CrowdPredictor() {
  const [hour, setHour] = useState(6);
  const reduceMotion = useReducedMotion();
  const v = interpolate(hour);

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
      <Slider
        label="¿A qué hora sales mañana?"
        min={4}
        max={22}
        value={hour}
        onChange={setHour}
        display={fmtHour(hour)}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Ocupación predicha del bus por hora del día"
      >
        <path d={pathOf(true)} fill="var(--accent)" opacity="0.14" />
        <path d={pathOf(false)} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <motion.circle
          initial={false}
          animate={{ cx: xOf(hour), cy: yOf(v) }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }}
          r="4"
          fill="var(--accent)"
        />
        {[4, 8, 12, 16, 20].map((h) => (
          <text
            key={h}
            x={xOf(h)}
            y={H - 5}
            textAnchor="middle"
            fontSize="8.5"
            className="font-mono"
            fill="var(--muted)"
          >
            {h}:00
          </text>
        ))}
      </svg>

      <div className="flex items-baseline gap-3">
        <motion.span
          key={Math.round(v)}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="text-metric text-[28px] text-accent"
        >
          {Math.round(v)} %
        </motion.span>
        <span className="text-secondary text-muted">{verdict(v)}</span>
      </div>

      <p className="text-label text-muted">
        Curva aprendida de la demanda típica de un día entre semana. El mismo
        truco del modelo de lluvia: patrón histórico, pregunta nueva
      </p>
    </div>
  );
}
