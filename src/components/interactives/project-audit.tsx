"use client";

import { useState } from "react";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

// Module 07 project: a structured audit report on the scholarship model.
const FIELDS = [
  {
    id: "evidencia",
    label: "1 · La evidencia: ¿cómo sabes que el modelo discrimina? Cita los números que viste",
    placeholder: "La brecha era de … puntos aunque el talento era igual…",
  },
  {
    id: "causa",
    label: "2 · La causa: ¿de dónde viene el sesgo? ¿Qué variables lo transportan?",
    placeholder: "Viene de las decisiones históricas… y aunque se quite el colegio, el estrato…",
  },
  {
    id: "propuesta",
    label: "3 · Tu propuesta: ¿qué harías tú? (quitar variables, cambiar datos, cuotas, auditorías…)",
    placeholder: "Yo propondría…",
  },
  {
    id: "sacrificio",
    label: "4 · El sacrificio: ¿qué pierde tu propuesta? Toda solución paga un precio — di cuál",
    placeholder: "A cambio, se sacrifica…",
  },
];

const MIN = 30;

interface Props {
  moduleSlug: string;
}

export function ProjectAudit({ moduleSlug }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Auditoría entregada</p>
        <p className="text-secondary text-muted">
          Evidencia, causa, propuesta y precio: eso es un informe de
          auditoría de verdad.
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
            rows={3}
            placeholder={f.placeholder}
            className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
          />
        </label>
      ))}
      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-muted font-mono">
          {ready ? "Listo para entregar" : "Responde las cuatro secciones"}
        </p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            saveArtifact(moduleSlug, {
              type: "bias-audit",
              report: values,
            });
            logEvent("project_submitted", { moduleSlug });
            setSubmitted(true);
          }}
          className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Entregar auditoría
        </button>
      </div>
    </div>
  );
}
