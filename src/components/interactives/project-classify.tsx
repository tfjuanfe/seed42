"use client";

import { useState } from "react";
import {
  LabelingTask,
  type LabelingCategory,
  type LabelingItem,
  type LabelingResult,
} from "./labeling-task";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

interface Props {
  moduleSlug: string;
  items: LabelingItem[];
  categories: LabelingCategory[];
  reasoningPrompt: string;
}

const MIN_REASONING = 60;

// Project screen: classify all items without feedback, then defend the
// criterion in writing. The pair (answers + reasoning) is the artifact.
export function ProjectClassify({
  moduleSlug,
  items,
  categories,
  reasoningPrompt,
}: Props) {
  const [results, setResults] = useState<LabelingResult[] | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Tu clasificación y tu argumento quedaron guardados. Pasa a la última
          pantalla.
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <LabelingTask
        items={items}
        categories={categories}
        showFeedback={false}
        onComplete={setResults}
      />
    );
  }

  const remaining = MIN_REASONING - reasoning.trim().length;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="max-w-prose">{reasoningPrompt}</p>
      <textarea
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        rows={5}
        className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
        placeholder="Escribe tu criterio con tus palabras"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-muted font-mono">
          {remaining > 0 ? `Te faltan ${remaining} caracteres` : "Listo para entregar"}
        </p>
        <button
          type="button"
          disabled={remaining > 0}
          onClick={() => {
            saveArtifact(moduleSlug, {
              type: "classification",
              answers: results,
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
  );
}
