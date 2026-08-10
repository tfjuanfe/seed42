"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { mae, ols, type Pt } from "@/lib/linear";
import { Slider } from "./slider";

interface Props {
  points: Pt[];
  xLabel: string;
  yLabel: string;
  // Format a y-value for humans, e.g. (v) => `$${v.toFixed(1)}M`.
  // Declarative formatting (functions can't cross the RSC boundary
  // from MDX): value → `${yPrefix}${v.toFixed(yDecimals)}${ySuffix}`.
  yPrefix?: string;
  ySuffix?: string;
  yDecimals?: number;
  showError?: boolean;
  showSegments?: boolean;
  showBest?: boolean;
  // Prediction slider under the chart (uses the student's line).
  predict?: { min: number; max: number; label: string; xSuffix?: string };
  // "Reveal the optimum" button + comparison.
  revealOptimal?: boolean;
  onFit?: (result: { m: number; b: number; err: number; optErr: number }) => void;
}

const W = 340;
const H = 210;
const PAD = { l: 42, r: 14, t: 12, b: 30 };

// Fit-the-line: two fat draggable handles, live error readout. The
// core primitive of module 05.
export function DraggableLine({
  points,
  xLabel,
  yLabel,
  yPrefix = "",
  ySuffix = "",
  yDecimals = 2,
  showError = true,
  showSegments = false,
  showBest = false,
  predict,
  revealOptimal = false,
  onFit,
}: Props) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs) - 4;
  const xMax = Math.max(...xs) + 4;
  const yMin = 0;
  const yMax = Math.max(...ys) * 1.25;

  const sx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
  const sy = (y: number) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);
  const invY = (py: number) => yMin + (1 - (py - PAD.t) / (H - PAD.t - PAD.b)) * (yMax - yMin);

  // The line is defined by its endpoint heights (world units).
  const [yLeft, setYLeft] = useState(yMax * 0.35);
  const [yRight, setYRight] = useState(yMax * 0.55);
  const [best, setBest] = useState<number | null>(null);
  const [optimalShown, setOptimalShown] = useState(false);
  const [predX, setPredX] = useState(predict ? (predict.min + predict.max) / 2 : 0);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();

  const m = (yRight - yLeft) / (xMax - xMin);
  const b = yLeft - m * xMin;
  const err = mae(points, m, b);
  const opt = ols(points);
  const optErr = mae(points, opt.m, opt.b);

  function drag(which: "l" | "r", e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg) return;
    (e.target as Element).setPointerCapture(e.pointerId);

    function move(ev: PointerEvent) {
      const rect = svg!.getBoundingClientRect();
      const py = ((ev.clientY - rect.top) / rect.height) * H;
      const v = Math.max(yMin, Math.min(yMax, invY(py)));
      if (which === "l") setYLeft(v);
      else setYRight(v);
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      // Track the personal record after each drag ends.
      setBest((prev) => {
        const now = mae(points, (yRight - yLeft) / (xMax - xMin), yLeft - ((yRight - yLeft) / (xMax - xMin)) * xMin);
        return prev === null ? now : Math.min(prev, now);
      });
      onFit?.({ m, b, err, optErr });
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const gapPct = optErr > 0 ? Math.round(((err - optErr) / optErr) * 100) : 0;
  const fmtY = (v: number) => `${yPrefix}${v.toFixed(yDecimals)}${ySuffix}`;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className="text-label text-muted">
          Arrastra los dos manubrios y ajusta la línea
        </span>
        {showError && (
          <span className="text-label font-mono">
            <span className="text-muted">error promedio </span>
            <span className="text-accent text-[17px]">{fmtY(err)}</span>
            {showBest && best !== null && (
              <span className="text-muted"> · récord {fmtY(Math.min(best, err))}</span>
            )}
          </span>
        )}
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="var(--border)" strokeWidth="1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="var(--border)" strokeWidth="1" />
        <text x={(PAD.l + W) / 2} y={H - 8} textAnchor="middle" fontSize="9" className="font-mono" fill="var(--muted)">
          {xLabel}
        </text>
        <text
          x={12}
          y={(PAD.t + H - PAD.b) / 2}
          textAnchor="middle"
          fontSize="9"
          className="font-mono"
          fill="var(--muted)"
          transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}
        >
          {yLabel}
        </text>

        {/* Error segments: the distances the line is "paying" */}
        {showSegments &&
          points.map((p, i) => (
            <line
              key={`s${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(p.x)}
              y2={sy(m * p.x + b)}
              stroke="var(--fail)"
              strokeWidth="1"
              opacity="0.55"
            />
          ))}

        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="var(--accent)" opacity="0.85" />
        ))}

        {/* The optimum, revealed */}
        {optimalShown && (
          <motion.line
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            x1={sx(xMin)}
            y1={sy(opt.m * xMin + opt.b)}
            x2={sx(xMax)}
            y2={sy(opt.m * xMax + opt.b)}
            stroke="var(--success)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
        )}

        {/* The student's line */}
        <line x1={sx(xMin)} y1={sy(yLeft)} x2={sx(xMax)} y2={sy(yRight)} stroke="var(--accent)" strokeWidth="2" />

        {/* Fat handles, 44px-equivalent hit area */}
        {(["l", "r"] as const).map((which) => {
          const hx = which === "l" ? sx(xMin) : sx(xMax);
          const hy = which === "l" ? sy(yLeft) : sy(yRight);
          return (
            <g key={which} onPointerDown={(e) => drag(which, e)} className="cursor-grab active:cursor-grabbing">
              <circle cx={hx} cy={hy} r="20" fill="transparent" />
              <circle cx={hx} cy={hy} r="9" fill="var(--accent)" opacity="0.25" />
              <circle cx={hx} cy={hy} r="5" fill="var(--accent)" />
            </g>
          );
        })}
      </svg>

      {predict && (
        <div className="flex flex-col gap-1">
          <Slider
            label={predict.label}
            min={predict.min}
            max={predict.max}
            value={predX}
            onChange={setPredX}
            display={`${Math.round(predX)}${predict.xSuffix ?? ""}`}
          />
          <p className="text-secondary" aria-live="polite">
            Tu línea predice:{" "}
            <span className="text-accent font-medium font-mono">
              {fmtY(m * predX + b)}
            </span>
          </p>
        </div>
      )}

      {revealOptimal &&
        (optimalShown ? (
          <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
            <p className="text-secondary">
              La línea verde es la de <span className="font-medium">mínimos
              cuadrados</span>: error {fmtY(optErr)}. La tuya:{" "}
              {fmtY(err)} —{" "}
              {gapPct <= 5 ? (
                <span className="text-success font-medium">
                  a {Math.max(gapPct, 0)} % del óptimo. Nada mal para dos pulgares.
                </span>
              ) : (
                <span className="text-muted">a {gapPct} % del óptimo. Sigue ajustando</span>
              )}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOptimalShown(true)}
            className="self-start h-11 px-5 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
          >
            Revelar la línea óptima
          </button>
        ))}
    </div>
  );
}
