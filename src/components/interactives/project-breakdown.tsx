"use client";

import { useState } from "react";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

// Module 02 project: dissect one AI application you actually use.
const APPS = ["TikTok", "YouTube", "Google Maps", "Nequi", "Rappi", "Spotify", "Traductor de Google", "Otra"];
const TASKS = [
  { id: "predecir", label: "Predecir", hint: "adivina un valor futuro" },
  { id: "clasificar", label: "Clasificar", hint: "decide en qué categoría cae algo" },
  { id: "recomendar", label: "Recomendar", hint: "elige qué mostrarte a ti" },
  { id: "generar", label: "Generar", hint: "produce texto, imagen o audio" },
];
const MIN_TEXT = 40;

interface Props {
  moduleSlug: string;
}

export function ProjectBreakdown({ moduleSlug }: Props) {
  const [app, setApp] = useState<string | null>(null);
  const [task, setTask] = useState<string | null>(null);
  const [data, setData] = useState("");
  const [risk, setRisk] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Desarmaste tu primera IA real. Pasa a la última pantalla.
        </p>
      </div>
    );
  }

  const ready =
    app && task && data.trim().length >= MIN_TEXT && risk.trim().length >= MIN_TEXT;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-label text-muted">1 · Elige la app que vas a desarmar</p>
        <div className="flex flex-wrap gap-2">
          {APPS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setApp(a)}
              className={`min-h-11 px-4 rounded-full border-hairline border transition-colors ${
                app === a
                  ? "border-[var(--accent)] text-accent font-medium"
                  : "text-muted hover:text-text"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label text-muted">2 · ¿Cuál es su trabajo principal?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTask(t.id)}
              className={`min-h-11 px-4 py-2 rounded-[var(--radius-control)] border-hairline border text-left transition-colors ${
                task === t.id
                  ? "border-[var(--accent)] text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              <span className={task === t.id ? "text-accent font-medium" : "font-medium"}>
                {t.label}
              </span>{" "}
              <span className="text-label text-muted">— {t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-label text-muted">
          3 · ¿Qué datos tuyos usa para aprender?
        </span>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={3}
          placeholder="Qué mira de ti: clics, tiempo, ubicación, historial…"
          className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-label text-muted">
          4 · ¿Qué podría salir mal? Piensa en quién pierde si el modelo se equivoca
        </span>
        <textarea
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          rows={3}
          placeholder="Errores, sesgos, burbujas, adicción…"
          className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-muted font-mono">
          {ready ? "Listo para entregar" : "Completa los cuatro pasos"}
        </p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            saveArtifact(moduleSlug, {
              type: "breakdown",
              app,
              task,
              dataUsed: data.trim(),
              risks: risk.trim(),
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
