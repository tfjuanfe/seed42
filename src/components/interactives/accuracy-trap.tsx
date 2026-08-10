"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// The 95%-accuracy scam, made visceral: a "model" that predicts nobody
// is sick scores 95% on a population where 5% are.

const TOTAL = 100;
const SICK = [7, 23, 41, 68, 88]; // indices of the sick patients

export function AccuracyTrap() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {phase === 0 && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-secondary text-muted">
            Presentamos <span className="text-text font-medium">SaludIA
            3000</span>, nuestro nuevo detector de dengue. Vamos a probarlo
            con 100 pacientes reales.
          </p>
          <button
            type="button"
            onClick={() => setPhase(1)}
            className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Diagnosticar a los 100 pacientes
          </button>
        </div>
      )}

      {phase >= 1 && (
        <>
          <div className="grid grid-cols-10 gap-1.5" aria-hidden="true">
            {Array.from({ length: TOTAL }, (_, i) => {
              const sick = SICK.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: phase === 2 && sick && !reduceMotion ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    delay: reduceMotion ? 0 : phase === 1 ? i * 0.008 : 0,
                    duration: phase === 2 && sick ? 0.6 : 0.2,
                    repeat: phase === 2 && sick && !reduceMotion ? Infinity : 0,
                    repeatDelay: 1.2,
                  }}
                  className={`aspect-square rounded-[3px] ${
                    phase === 2 && sick ? "bg-fail" : "bg-success opacity-60"
                  }`}
                />
              );
            })}
          </div>

          {phase === 1 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-secondary" aria-live="polite">
                Diagnóstico del modelo para los 100:{" "}
                <span className="font-medium">«sano»</span>. Precisión
                contra la realidad:{" "}
                <span className="text-metric text-success">95 %</span> —
                ¡impresionante!
              </p>
              <button
                type="button"
                onClick={() => setPhase(2)}
                className="h-11 px-5 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
              >
                Un momento… ¿y los enfermos?
              </button>
            </div>
          ) : (
            <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
              <p className="text-secondary">
                <span className="text-fail font-medium">
                  Estos 5 pacientes SÍ tenían dengue
                </span>{" "}
                y el modelo los mandó a la casa. Su secreto: como el 95 % de
                la gente está sana, decir «todos sanos» acierta el 95 % de
                las veces — sin detectar a nadie.
              </p>
              <p className="text-secondary text-muted mt-1">
                La precisión era real. Y el modelo, inservible.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
