"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A tiny linear classifier over keywords — the same shape as a real
// naive spam filter, small enough to inspect with the naked eye.
const WEIGHTS: Record<string, number> = {
  ganaste: 2.2,
  premio: 1.8,
  gratis: 1.6,
  urgente: 1.5,
  reclama: 1.6,
  clave: 2.0,
  contraseña: 2.0,
  banco: 1.2,
  paga: 1.4,
  retenido: 1.5,
  paquete: 0.9,
  oferta: 1.1,
  clic: 1.3,
  link: 1.0,
  ya: 0.6,
  profe: -1.5,
  tarea: -1.2,
  clase: -1.0,
  cancha: -1.0,
  gracias: -0.7,
  mañana: -0.5,
  vemos: -0.9,
};
const BIAS = -1.6;

const PRESETS = [
  "GANASTE un iPhone 15!! Da clic y reclama tu premio YA",
  "Profe, ¿puedo entregar la tarea mañana? Gracias",
  "Tu paquete está retenido. Paga $2.900 para liberarlo, urgente",
  "Nos vemos en la cancha a las 4",
];

interface Contribution {
  token: string;
  weight: number;
}

function analyze(text: string): { score: number; contributions: Contribution[] } {
  const lower = text.toLowerCase();
  const tokens = lower.match(/[a-záéíóúñü$]+/g) ?? [];
  let score = BIAS;
  const contributions: Contribution[] = [];
  const seen = new Set<string>();

  for (const t of tokens) {
    if (WEIGHTS[t] !== undefined && !seen.has(t)) {
      seen.add(t);
      score += WEIGHTS[t];
      contributions.push({ token: t, weight: WEIGHTS[t] });
    }
  }
  // Two engineered features: SHOUTING and exclamation marks.
  const letters = text.replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/g, "");
  const capsRatio =
    letters.length > 0
      ? letters.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, "").length / letters.length
      : 0;
  if (capsRatio > 0.3) {
    const w = +(capsRatio * 2.2).toFixed(1);
    score += w;
    contributions.push({ token: "MAYÚSCULAS", weight: w });
  }
  const bangs = (text.match(/!/g) ?? []).length;
  if (bangs > 0) {
    const w = +Math.min(bangs * 0.4, 1.2).toFixed(1);
    score += w;
    contributions.push({ token: "¡signos!", weight: w });
  }
  if (/\$\d/.test(text)) {
    score += 1.2;
    contributions.push({ token: "$dinero", weight: 1.2 });
  }

  contributions.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  return { score: 1 / (1 + Math.exp(-score)), contributions };
}

export function SpamClassifier() {
  const [text, setText] = useState(PRESETS[0]);
  const reduceMotion = useReducedMotion();

  const { score, contributions } = useMemo(() => analyze(text), [text]);
  const pct = Math.round(score * 100);
  const isSpam = score >= 0.5;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setText(p)}
            className={`text-label px-3 min-h-9 rounded-full border-hairline border transition-colors text-left ${
              text === p
                ? "border-[var(--accent)] text-accent"
                : "text-muted hover:text-text"
            }`}
          >
            {p.length > 34 ? p.slice(0, 34) + "…" : p}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-label text-muted">
          O escribe tu propio mensaje sospechoso
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
        />
      </label>

      {/* The verdict gauge */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-label text-muted">Probabilidad de estafa</span>
          <span
            className={`text-metric ${isSpam ? "text-fail" : "text-success"}`}
          >
            {pct} %
          </span>
        </div>
        <div className="h-2 rounded-full bg-sub overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isSpam ? "bg-fail" : "bg-success"}`}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Why: the model's evidence, visible */}
      {contributions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {contributions.slice(0, 6).map((c) => (
            <motion.span
              key={c.token}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-label font-mono px-2.5 py-1 rounded-full border-hairline border ${
                c.weight > 0 ? "text-fail" : "text-success"
              }`}
            >
              {c.token} {c.weight > 0 ? "+" : ""}
              {c.weight.toFixed(1)}
            </motion.span>
          ))}
        </div>
      )}

      <p className="text-label text-muted">
        Cada palabra suma o resta puntos aprendidos de miles de mensajes
        reales. Nada de magia: una suma y un umbral
      </p>
    </div>
  );
}
