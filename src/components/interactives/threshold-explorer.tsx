"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Slider } from "./slider";

// A score distribution and a movable decision threshold: the student
// watches the two error types trade places. Optionally with costs, and
// with a low-prevalence mode for the break screen.

// Deterministic pseudo-random scores.
function seeded(n: number, seed: number, mean: number, sd: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u1 = (s + 1) / 233281;
    s = (s * 9301 + 49297) % 233280;
    const u2 = (s + 1) / 233281;
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    out.push(Math.min(0.98, Math.max(0.02, mean + z * sd)));
  }
  return out;
}

interface Props {
  // Money mode: assign costs to each error and minimize the bill.
  costs?: { fn: number; fp: number };
  // Break mode: switch to a low-prevalence town and watch precision die.
  prevalenceToggle?: boolean;
}

export function ThresholdExplorer({ costs, prevalenceToggle }: Props) {
  const [threshold, setThreshold] = useState(50);
  const [rural, setRural] = useState(false);
  const reduceMotion = useReducedMotion();

  const sickN = rural ? 4 : 20;
  const sick = useMemo(() => seeded(sickN, 42, 0.7, 0.13), [sickN]);
  const healthy = useMemo(() => seeded(80, 7, 0.33, 0.14), []);

  const t = threshold / 100;
  const tp = sick.filter((s) => s >= t).length;
  const fn = sick.length - tp;
  const fp = healthy.filter((s) => s >= t).length;
  const tn = healthy.length - fp;
  const total = sick.length + healthy.length;

  const acc = Math.round(((tp + tn) / total) * 100);
  const recall = sick.length ? Math.round((tp / sick.length) * 100) : 0;
  const precision = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 100) : 0;
  const bill = costs ? fn * costs.fn + fp * costs.fp : 0;

  const dot = (score: number, kind: "tp" | "fn" | "fp" | "tn", i: number) => (
    <motion.div
      key={`${kind}-${i}`}
      layout={!reduceMotion}
      className={`w-2.5 h-2.5 rounded-full ${
        kind === "tp"
          ? "bg-success"
          : kind === "fn"
            ? "bg-fail"
            : kind === "fp"
              ? "bg-warn"
              : "bg-[var(--muted)] opacity-40"
      }`}
      style={{ marginLeft: `${score * 92}%`, position: "absolute" }}
      aria-hidden="true"
    />
  );

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {prevalenceToggle && (
        <div className="flex gap-2">
          {[false, true].map((r) => (
            <button
              key={String(r)}
              type="button"
              onClick={() => setRural(r)}
              aria-pressed={rural === r}
              className={`min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border transition-colors flex-1 ${
                rural === r
                  ? "border-[var(--accent)] text-accent font-medium"
                  : "text-muted hover:text-text"
              }`}
            >
              {r ? "Pueblo con poco dengue (4 %)" : "Zona de brote (20 %)"}
            </button>
          ))}
        </div>
      )}

      {/* Score strips: sick on top, healthy below */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-label text-muted mb-1.5">
            Enfermos de verdad ({sick.length}) — puntaje del modelo
          </p>
          <div className="relative h-3">
            {sick.map((s, i) => dot(s, s >= t ? "tp" : "fn", i))}
          </div>
        </div>
        <div>
          <p className="text-label text-muted mb-1.5">Sanos de verdad (80)</p>
          <div className="relative h-3">
            {healthy.map((s, i) => dot(s, s >= t ? "fp" : "tn", i))}
          </div>
        </div>
        {/* Threshold line across both strips */}
        <div className="relative h-0">
          <div
            className="absolute w-0.5 bg-accent"
            style={{ left: `${t * 92}%`, height: 64, top: -64 }}
            aria-hidden="true"
          />
        </div>
      </div>

      <Slider
        label="Umbral: puntaje mínimo para declarar «enfermo»"
        min={5}
        max={95}
        value={threshold}
        onChange={setThreshold}
        display={`${threshold}`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[11px]">
        <Metric label="precisión total" value={`${acc} %`} tone="text" />
        <Metric label="enfermos detectados" value={`${recall} %`} tone={recall < 70 ? "fail" : "success"} />
        <Metric label="alarmas acertadas" value={`${precision} %`} tone={precision < 50 ? "fail" : "text"} />
        {costs ? (
          <Metric label="factura de errores" value={`$${(bill / 1000).toFixed(0)}k`} tone="warn" />
        ) : (
          <Metric label="falsas alarmas" value={`${fp}`} tone={fp > 15 ? "fail" : "text"} />
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Legend color="bg-success" text="enfermo detectado" />
        <Legend color="bg-fail" text="enfermo que se escapa" />
        <Legend color="bg-warn" text="sano con falsa alarma" />
        <Legend color="bg-[var(--muted)] opacity-40" text="sano tranquilo" />
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  const color =
    tone === "fail"
      ? "text-fail"
      : tone === "success"
        ? "text-success"
        : tone === "warn"
          ? "text-warn"
          : "";
  return (
    <div className="rounded-[var(--radius-card)] bg-sub border-hairline border p-3 flex flex-col gap-0.5">
      <span className={`text-metric ${color}`}>{value}</span>
      <span className="text-label text-muted">{label}</span>
    </div>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-label text-muted">
      <span className={`w-2.5 h-2.5 rounded-full inline-block ${color}`} aria-hidden="true" />
      {text}
    </span>
  );
}
