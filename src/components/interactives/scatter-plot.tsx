"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ScatterPoint {
  id: string;
  x: number;
  y: number;
}

interface Props {
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  // Outlier-hunt game: tapping the target resolves the exercise.
  outlierId: string;
  explain: string;
}

const W = 340;
const H = 190;
const PAD = { l: 40, r: 12, t: 10, b: 30 };

export function ScatterPlot({ points, xLabel, yLabel, outlierId, explain }: Props) {
  const [found, setFound] = useState(false);
  const [missId, setMissId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs) * 0.9;
  const xMax = Math.max(...xs) * 1.05;
  const yMin = 0;
  const yMax = Math.max(...ys) * 1.1;

  const sx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
  const sy = (y: number) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  function tap(p: ScatterPoint) {
    if (found) return;
    if (p.id === outlierId) {
      setFound(true);
      setMissId(null);
    } else {
      setMissId(p.id);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
      <p className="text-label text-muted">
        Toca el punto que no encaja con los demás
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Diagrama de dispersión con un dato atípico escondido"
      >
        {/* Axes */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="var(--border)" strokeWidth="1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="var(--border)" strokeWidth="1" />
        <text x={(PAD.l + W - PAD.r) / 2} y={H - 8} textAnchor="middle" fontSize="9" className="font-mono" fill="var(--muted)">
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

        {points.map((p) => {
          const isOutlier = p.id === outlierId;
          const missed = missId === p.id;
          return (
            <g key={p.id} onClick={() => tap(p)} className="cursor-pointer">
              {/* Invisible 44px-equivalent hit area */}
              <circle cx={sx(p.x)} cy={sy(p.y)} r="16" fill="transparent" />
              <motion.circle
                cx={sx(p.x)}
                cy={sy(p.y)}
                animate={
                  found && isOutlier && !reduceMotion
                    ? { r: [5, 9, 7], opacity: 1 }
                    : missed
                      ? { r: 5, opacity: [1, 0.4, 1] }
                      : { r: 5, opacity: 1 }
                }
                transition={{ duration: 0.4 }}
                fill={
                  found && isOutlier
                    ? "var(--fail)"
                    : "var(--accent)"
                }
                opacity="0.85"
              />
            </g>
          );
        })}
      </svg>

      {found ? (
        <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
          <p className="text-secondary">
            <span className="text-success font-medium">Lo encontraste.</span>{" "}
            {explain}
          </p>
        </div>
      ) : missId ? (
        <p className="text-secondary text-muted" aria-live="polite">
          Ese punto sigue la tendencia de los demás. Busca el que se salió de
          la fila
        </p>
      ) : null}
    </div>
  );
}
