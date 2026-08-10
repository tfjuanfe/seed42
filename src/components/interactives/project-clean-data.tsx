"use client";

import { useState } from "react";
import {
  DataTable,
  type FixDecision,
  type TableRow,
} from "./data-table";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

interface Props {
  moduleSlug: string;
  columns: string[];
  rows: TableRow[];
}

const MIN_TEXT = 40;

// Module 03 project: clean the broken dataset, then defend the hardest
// call — cleaning is judgment, not mechanics.
export function ProjectCleanData({ moduleSlug, columns, rows }: Props) {
  const [decisions, setDecisions] = useState<FixDecision[] | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Limpiaste tu primer dataset real. Pasa a la última pantalla.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} rows={rows} onComplete={setDecisions} />

      {decisions && (
        <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-secondary">
              ¿Cuál corrección fue la más difícil de decidir, y por qué? No hay
              respuesta única: un analista real duda exactamente aquí.
            </span>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={4}
              placeholder="La más difícil fue… porque…"
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
                  type: "data-cleaning",
                  decisions,
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
      )}
    </div>
  );
}
