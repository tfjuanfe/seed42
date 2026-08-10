"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BOGOTA,
  QUIBDO,
  CHART,
  MONTH_LETTER,
  MONTH_MID,
  curvePath,
  dailyProb,
  dayOfYear,
  todayISO,
  xOf,
  yOf,
} from "@/lib/rain-model";

// A real (small) model: probability of rain per calendar day, learned
// from ~30 years of monthly climatology (IDEAM averages). It is not a
// forecast — that's the whole pedagogical point: it only knows the
// patterns present in its training data.

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
        viewBox={`0 0 ${CHART.W} ${CHART.H}`}
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
          y1={CHART.PAD_TOP}
          y2={CHART.H - CHART.PAD_BOT}
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
            y={CHART.H - 6}
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
