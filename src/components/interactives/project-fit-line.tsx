"use client";

import { useState } from "react";
import { DraggableLine } from "./draggable-line";
import type { Pt } from "@/lib/linear";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

interface Props {
  moduleSlug: string;
  points: Pt[];
}

const MIN_TEXT = 40;

// Module 05 project: fit by hand, reveal the optimum, then answer the
// question that separates fitting from understanding.
export function ProjectFitLine({ moduleSlug, points }: Props) {
  const [fit, setFit] = useState<{ m: number; b: number; err: number; optErr: number } | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Tu línea, tu error y tu argumento quedaron guardados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DraggableLine
        points={points}
        xLabel="área (m²)"
        yLabel="arriendo ($M)"
        yPrefix="$"
        ySuffix="M"
        showSegments
        showBest
        revealOptimal
        onFit={setFit}
      />

      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-secondary">
            La línea óptima existe desde 1805 (Legendre). Entonces, ¿para qué
            sirvió ajustarla tú a mano? ¿Y en qué casos una línea recta NO
            alcanzaría para predecir bien?
          </span>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={4}
            placeholder="Ajustar a mano sirve para… y una línea no alcanza cuando…"
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
                type: "line-fit",
                fit,
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
      </div>
    </div>
  );
}
