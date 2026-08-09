"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ModuleMeta } from "@content/modules/registry";
import { getModuleProgress } from "@/lib/progress";

interface Props {
  meta: ModuleMeta;
  screenCount?: number;
}

export function ModuleCard({ meta, screenCount = 8 }: Props) {
  const [state, setState] = useState<{
    started: boolean;
    completed: boolean;
    fraction: number;
  }>({ started: false, completed: false, fraction: 0 });

  useEffect(() => {
    const p = getModuleProgress(meta.slug);
    if (p) {
      setState({
        started: true,
        completed: Boolean(p.completedAt),
        fraction: p.completedAt
          ? 1
          : Math.min(p.screenIndex / screenCount, 0.95),
      });
    }
  }, [meta.slug, screenCount]);

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label text-muted font-mono">
          {String(meta.number).padStart(2, "0")}
        </p>
        <p className="text-label text-muted font-mono">
          {meta.available
            ? state.completed
              ? "Completado"
              : state.started
                ? "En curso"
                : `${meta.minutes} min`
            : "Próximamente"}
        </p>
      </div>
      <h2 className="text-h2">{meta.title}</h2>
      <p className="text-secondary text-muted flex-1">{meta.description}</p>
      {/* Gamified fill: the card carries the same progress bar motif */}
      <div className="h-1.5 w-full rounded-full bg-sub overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            state.completed ? "bg-success" : "bg-accent"
          }`}
          style={{ width: `${state.fraction * 100}%` }}
        />
      </div>
    </>
  );

  if (!meta.available) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3 opacity-60">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/modulos/${meta.slug}`}
      className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3 transition-colors hover:border-[var(--accent)]"
    >
      {body}
    </Link>
  );
}
