"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BOGOTA,
  CHART,
  MONTH_LETTER,
  MONTH_MID,
  dailyProb,
  xOf,
  yOf,
} from "@/lib/rain-model";
import { Slider } from "./slider";

// Module 03: the module-01 rain model, but the student controls the
// quality of its training data and watches the model degrade live.

// Deterministic "garbage" per month — what corrupted sensors report.
const NOISE = BOGOTA.map((_, m) => 0.5 + 0.42 * Math.sin(m * 7.3 + 2.1));

function corruptSeries(k: number): number[] {
  return BOGOTA.map((v, m) =>
    Math.min(0.98, Math.max(0.02, v * (1 - k) + NOISE[m] * k)),
  );
}

// Gap mode: April and May deleted; the model interpolates March→June
// and never learns the first rainy season existed.
function gapSeries(): number[] {
  const s = [...BOGOTA];
  s[3] = s[2] + (s[5] - s[2]) / 3;
  s[4] = s[2] + ((s[5] - s[2]) * 2) / 3;
  return s;
}

function pathOf(series: number[], close: boolean): string {
  const pts: string[] = [];
  for (let d = 1; d <= 365; d += 4) {
    pts.push(`${xOf(d).toFixed(1)},${yOf(dailyProb(series, d)).toFixed(1)}`);
  }
  const line = "M" + pts.join(" L");
  if (!close) return line;
  return `${line} L${xOf(365).toFixed(1)},${yOf(0)} L${xOf(1).toFixed(1)},${yOf(0)} Z`;
}

// Fixed test question for both modes: April 20, mid rainy season.
const TEST_DAY = 110;
const TRUTH = dailyProb(BOGOTA, TEST_DAY);

interface Props {
  mode?: "noise" | "gap";
}

export function CorruptibleRain({ mode = "noise" }: Props) {
  const [k, setK] = useState(0);
  const [gapOn, setGapOn] = useState(false);
  const reduceMotion = useReducedMotion();

  const series = useMemo(() => {
    if (mode === "gap") return gapOn ? gapSeries() : BOGOTA;
    return corruptSeries(k / 100);
  }, [mode, k, gapOn]);

  const pred = dailyProb(series, TEST_DAY);
  const predPct = Math.round(pred * 100);
  const truthPct = Math.round(TRUTH * 100);
  const errorPts = Math.abs(predPct - truthPct);
  const damaged = mode === "noise" ? k > 25 : gapOn;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {mode === "noise" ? (
        <Slider
          label="Datos de entrenamiento dañados"
          min={0}
          max={100}
          value={k}
          onChange={setK}
          display={`${k} %`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setGapOn(!gapOn)}
          aria-pressed={gapOn}
          className={`self-start h-11 px-5 rounded-[var(--radius-control)] font-medium transition-colors ${
            gapOn
              ? "bg-fail text-[#0D0D12]"
              : "bg-accent text-[#0D0D12] hover:bg-accent-hover"
          }`}
        >
          {gapOn ? "Devuélvele abril y mayo" : "Borra abril y mayo de los datos"}
        </button>
      )}

      <svg
        viewBox={`0 0 ${CHART.W} ${CHART.H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Curva del modelo entrenado con datos alterados"
      >
        {/* Ghost of the healthy model */}
        <path
          d={pathOf(BOGOTA, false)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.5"
        />
        {/* The (possibly poisoned) model, morphing live */}
        <motion.path
          animate={{ d: pathOf(series, true) }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
          fill={damaged ? "var(--fail)" : "var(--accent)"}
          opacity="0.14"
        />
        <motion.path
          animate={{ d: pathOf(series, false) }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
          fill="none"
          stroke={damaged ? "var(--fail)" : "var(--accent)"}
          strokeWidth="1.5"
        />
        {/* Test date marker */}
        <line
          x1={xOf(TEST_DAY)}
          x2={xOf(TEST_DAY)}
          y1={CHART.PAD_TOP}
          y2={CHART.H - CHART.PAD_BOT}
          stroke="var(--muted)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
        <motion.circle
          animate={{ cy: yOf(pred) }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
          cx={xOf(TEST_DAY)}
          r="4"
          fill={damaged ? "var(--fail)" : "var(--accent)"}
        />
        {MONTH_MID.map((m, i) => (
          <text
            key={i}
            x={xOf(m)}
            y={CHART.H - 6}
            textAnchor="middle"
            fontSize="8.5"
            className="font-mono"
            fill={mode === "gap" && gapOn && (i === 3 || i === 4) ? "var(--fail)" : "var(--muted)"}
          >
            {MONTH_LETTER[i]}
          </text>
        ))}
      </svg>

      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-label text-muted">20 de abril:</span>
        <motion.span
          key={predPct}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-metric text-[26px] ${damaged ? "text-fail" : "text-accent"}`}
        >
          {predPct} %
        </motion.span>
        <span className="text-secondary text-muted">
          la realidad: {truthPct} % · error{" "}
          <span className={errorPts > 10 ? "text-fail font-medium" : ""}>
            {errorPts} puntos
          </span>
        </span>
      </div>

      <p className="text-label text-muted">
        La línea punteada gris es el modelo sano. El modelo nunca sabe que sus
        datos están mal: responde igual de seguro con basura adentro
      </p>
    </div>
  );
}
