"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Same question, two samples. The bars rearrange live: the lesson is
// the jump, not either chart alone.
const APPS = ["TikTok", "WhatsApp", "YouTube", "Facebook"];
const SAMPLES = {
  salon: { label: "Tu salón (35 personas)", values: [48, 30, 18, 4] },
  colombia: { label: "Toda Colombia (todas las edades)", values: [22, 41, 20, 17] },
} as const;

type SampleKey = keyof typeof SAMPLES;

export function SampleBias() {
  const [sample, setSample] = useState<SampleKey>("salon");
  const reduceMotion = useReducedMotion();
  const { values } = SAMPLES[sample];

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted">
        «¿Cuál es la app más usada?» — depende de a quién le preguntes
      </p>

      <div className="flex gap-2">
        {(Object.keys(SAMPLES) as SampleKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSample(key)}
            aria-pressed={sample === key}
            className={`min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border transition-colors flex-1 ${
              sample === key
                ? "border-[var(--accent)] text-accent font-medium"
                : "text-muted hover:text-text"
            }`}
          >
            {SAMPLES[key].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {APPS.map((app, i) => (
          <div key={app} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-secondary">{app}</span>
            <div className="h-6 flex-1 rounded-[6px] bg-sub overflow-hidden">
              <motion.div
                className="h-full rounded-[6px] bg-accent opacity-80"
                initial={false}
                animate={{ width: `${values[i]}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <motion.span
              key={`${sample}-${i}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-label text-muted font-mono w-10 text-right"
            >
              {values[i]} %
            </motion.span>
          </div>
        ))}
      </div>

      <p className="text-label text-muted">
        Ninguna encuesta miente: cada una responde por su muestra. Un modelo
        entrenado solo con tu salón cree que Facebook casi no existe
      </p>
    </div>
  );
}
