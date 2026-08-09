"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { modules } from "@content/modules/registry";
import { getProgress, type ProgressMap } from "@/lib/progress";
import { getArtifacts, type StoredArtifact } from "@/lib/artifacts";

// Local (anonymous) progress summary. Becomes the full dashboard with
// heatmap and streak in Phase 5, backed by the DB once auth exists.
export function ProfileSummary() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [artifacts, setArtifacts] = useState<StoredArtifact[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setArtifacts(getArtifacts());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const started = Object.keys(progress).length;

  if (started === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted max-w-xl">
          Todavía no has empezado ningún módulo. El primero te espera y no
          necesitas cuenta.
        </p>
        <Link
          href="/modulos/que-es-la-ia"
          className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
        >
          Empezar el módulo 01
        </Link>
      </div>
    );
  }

  const completed = Object.values(progress).filter((p) => p.completedAt).length;

  const metrics = [
    { label: "Empezados", value: started },
    { label: "Completados", value: completed },
    { label: "Proyectos", value: artifacts.filter((a) => !a.moduleSlug.includes(":")).length },
    { label: "Disponibles", value: modules.filter((m) => m.available).length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[11px]">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-[var(--radius-card)] bg-panel border-hairline border p-4 flex flex-col gap-1"
          >
            <p className="text-metric">{m.value}</p>
            <p className="text-label text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {modules
          .filter((m) => progress[m.slug])
          .map((m) => {
            const p = progress[m.slug];
            return (
              <Link
                key={m.slug}
                href={`/modulos/${m.slug}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-panel border-hairline border px-4 py-3 transition-colors hover:border-[var(--accent)]"
              >
                <span>{m.title}</span>
                <span
                  className={`text-label font-mono ${p.completedAt ? "text-success" : "text-muted"}`}
                >
                  {p.completedAt ? "Completado" : "En curso"}
                </span>
              </Link>
            );
          })}
      </div>

      <p className="text-secondary text-muted max-w-xl">
        Tu progreso vive en este navegador. Con una cuenta de Google te sigue
        a donde vayas — muy pronto.
      </p>
    </div>
  );
}
