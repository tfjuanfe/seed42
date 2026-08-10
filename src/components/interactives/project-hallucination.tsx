"use client";

import { useState } from "react";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

// Module 09 project: hunt a hallucination in the wild (any real LLM the
// student has access to) and document it like a bug report.

const FIELDS = [
  {
    id: "modelo",
    label: "1 · ¿Qué IA usaste? (ChatGPT, Gemini, Meta AI de WhatsApp…)",
    rows: 1,
    placeholder: "ChatGPT gratis, versión de agosto 2026",
  },
  {
    id: "pregunta",
    label: "2 · Tu pregunta — tema local o específico funciona mejor: tu colegio, tu municipio, deportistas colombianos…",
    rows: 2,
    placeholder: "¿Quién fundó el colegio…? / ¿Qué goles hizo… en 2019?",
  },
  {
    id: "respuesta",
    label: "3 · La parte inventada de la respuesta (cópiala tal cual)",
    rows: 3,
    placeholder: "Me respondió que…",
  },
  {
    id: "verificacion",
    label: "4 · ¿Cómo verificaste que era falso? Cita tu fuente",
    rows: 2,
    placeholder: "Lo comprobé en… / le pregunté a… / la página oficial dice…",
  },
  {
    id: "hipotesis",
    label: "5 · Tu hipótesis: ¿por qué inventó exactamente eso? Usa lo que sabes del predictor de palabras",
    rows: 3,
    placeholder: "Creo que completó con lo más plausible porque…",
  },
];

const MIN = 20;

interface Props {
  moduleSlug: string;
}

export function ProjectHallucination({ moduleSlug }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Cacería documentada</p>
        <p className="text-secondary text-muted">
          Atrapaste a una IA de frente y lo probaste con fuentes. Eso es
          alfabetización de IA de verdad.
        </p>
      </div>
    );
  }

  const ready = FIELDS.every((f) => (values[f.id] ?? "").trim().length >= MIN);

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-5">
      {FIELDS.map((f) => (
        <label key={f.id} className="flex flex-col gap-2">
          <span className="text-label text-muted">{f.label}</span>
          <textarea
            value={values[f.id] ?? ""}
            onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
            rows={f.rows}
            placeholder={f.placeholder}
            className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
          />
        </label>
      ))}
      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-muted font-mono">
          {ready ? "Listo para entregar" : "Completa las cinco secciones"}
        </p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            saveArtifact(moduleSlug, { type: "hallucination-report", report: values });
            logEvent("project_submitted", { moduleSlug });
            setSubmitted(true);
          }}
          className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Entregar reporte
        </button>
      </div>
    </div>
  );
}
