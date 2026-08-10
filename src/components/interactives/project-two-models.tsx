"use client";

import { useState } from "react";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

// Module 06 project: two models, identical accuracy, different failure
// profiles. The student decides which is worse — twice, in two worlds.

const MODELS = [
  {
    id: "A",
    name: "Modelo A",
    desc: "Casi nunca da falsas alarmas, pero deja escapar 4 de cada 20 enfermos",
    matrix: { tp: 16, fn: 4, fp: 1, tn: 79 },
  },
  {
    id: "B",
    name: "Modelo B",
    desc: "Encuentra a casi todos los enfermos, pero asusta a 4 sanos de cada 80",
    matrix: { tp: 19, fn: 1, fp: 4, tn: 76 },
  },
];

const SCENARIOS = [
  {
    id: "dengue",
    title: "Tamizaje de dengue en un hospital",
    hint: "El que se escapa puede morir; la falsa alarma cuesta un examen extra",
  },
  {
    id: "spam",
    title: "Filtro de mensajes del colegio",
    hint: "El spam que pasa molesta; el mensaje legítimo bloqueado puede ser una emergencia de un papá",
  },
];

const MIN_TEXT = 40;

interface Props {
  moduleSlug: string;
}

export function ProjectTwoModels({ moduleSlug }: Props) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Decidiste como se decide en el mundo real: por el costo del error,
          no por la precisión.
        </p>
      </div>
    );
  }

  const ready =
    SCENARIOS.every((s) => choices[s.id]) && reasoning.trim().length >= MIN_TEXT;

  return (
    <div className="flex flex-col gap-4">
      {/* The two contenders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[11px]">
        {MODELS.map((m) => (
          <div
            key={m.id}
            className="rounded-[var(--radius-card)] bg-panel border-hairline border p-4 flex flex-col gap-3"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-h2">{m.name}</p>
              <p className="text-label text-muted font-mono">precisión 95 %</p>
            </div>
            <p className="text-secondary text-muted">{m.desc}</p>
            <div className="grid grid-cols-2 gap-1.5 text-label font-mono">
              <div className="rounded-[6px] bg-sub px-2 py-1.5">
                detecta <span className="text-success">{m.matrix.tp}</span>
              </div>
              <div className="rounded-[6px] bg-sub px-2 py-1.5">
                se le escapan <span className="text-fail">{m.matrix.fn}</span>
              </div>
              <div className="rounded-[6px] bg-sub px-2 py-1.5">
                falsas alarmas <span className="text-warn">{m.matrix.fp}</span>
              </div>
              <div className="rounded-[6px] bg-sub px-2 py-1.5">
                sanos tranquilos <span className="text-muted">{m.matrix.tn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two worlds, one decision each */}
      {SCENARIOS.map((s) => (
        <div
          key={s.id}
          className="rounded-[var(--radius-card)] bg-panel border-hairline border p-4 flex flex-col gap-3"
        >
          <p className="font-medium">{s.title}</p>
          <p className="text-secondary text-muted">{s.hint}</p>
          <div className="flex gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setChoices({ ...choices, [s.id]: m.id })}
                aria-pressed={choices[s.id] === m.id}
                className={`flex-1 min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border transition-colors ${
                  choices[s.id] === m.id
                    ? "border-[var(--fail)] text-fail font-medium"
                    : "text-muted hover:text-text"
                }`}
              >
                {m.name} es peor aquí
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-secondary">
            Defiende tus dos decisiones. ¿Por qué el peor modelo cambia según
            el contexto si los números no cambian?
          </span>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={4}
            placeholder="En el hospital es peor… pero en el filtro…"
            className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
          />
        </label>
        <div className="flex items-center justify-between gap-3">
          <p className="text-label text-muted font-mono">
            {ready ? "Listo para entregar" : "Elige en ambos casos y defiende tu decisión"}
          </p>
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              saveArtifact(moduleSlug, {
                type: "model-judgment",
                choices,
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
