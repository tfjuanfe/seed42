"use client";

import { useState } from "react";
import { NetworkLab } from "./network-lab";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

const GOAL = 0.95;
const MIN_TEXT = 40;

interface Props {
  moduleSlug: string;
}

// Module 08 project: architect a net that beats the spiral.
export function ProjectSpiral({ moduleSlug }: Props) {
  const [bestAcc, setBestAcc] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Construiste y entrenaste una red neuronal real. Eso ya no te lo
          quita nadie.
        </p>
      </div>
    );
  }

  const unlocked = bestAcc >= GOAL;

  return (
    <div className="flex flex-col gap-4">
      <NetworkLab
        dataset="spiral"
        initialHidden={[4]}
        editable
        lrSlider
        showLoss
        onAccuracy={(a) => setBestAcc((b) => Math.max(b, a))}
      />

      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-secondary">
            Meta: <span className="font-medium">95 %</span> en la espiral
          </span>
          <span className={`text-metric ${unlocked ? "text-success" : "text-warn"}`}>
            récord {Math.round(bestAcc * 100)} %
          </span>
        </div>

        {unlocked ? (
          <>
            <label className="flex flex-col gap-2">
              <span className="text-secondary">
                ¿Qué combinación funcionó y qué intentaste antes que no? Tu
                bitácora de arquitecto:
              </span>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={4}
                placeholder="Con una sola capa pasaba que… al agregar…"
                className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <p className="text-label text-muted font-mono">
                {reasoning.trim().length >= MIN_TEXT
                  ? "Listo para entregar"
                  : `Te faltan ${MIN_TEXT - reasoning.trim().length} caracteres`}
              </p>
              <button
                type="button"
                disabled={reasoning.trim().length < MIN_TEXT}
                onClick={() => {
                  saveArtifact(moduleSlug, {
                    type: "spiral-net",
                    bestAccuracy: bestAcc,
                    reasoning: reasoning.trim(),
                  });
                  logEvent("project_submitted", { moduleSlug });
                  setSubmitted(true);
                }}
                className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Entregar proyecto
              </button>
            </div>
          </>
        ) : (
          <p className="text-secondary text-muted">
            Pistas de arquitecto: la espiral necesita dos capas. Más neuronas
            por capa = frontera más flexible. Si el loss baila sin bajar,
            baja la velocidad de aprendizaje.
          </p>
        )}
      </div>
    </div>
  );
}
