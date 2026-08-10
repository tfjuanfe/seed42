"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ModuleMeta } from "@content/modules/registry";
import { getModuleProgress } from "@/lib/progress";

interface Props {
  meta: ModuleMeta;
  screenCount?: number;
}

// One module = one row. The thin progress fill under each row keeps
// the gamified motif without boxing everything into cards.
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

  const status = meta.available
    ? state.completed
      ? "Completado"
      : state.started
        ? "En curso"
        : `${meta.minutes} min`
    : "Próximamente";

  const inner = (
    <>
      <div className="flex items-baseline gap-4">
        <span className="text-metric text-muted font-mono w-9 shrink-0">
          {String(meta.number).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className={`text-h2 ${meta.available ? "" : "text-muted"}`}>
            {meta.title}
          </span>
          <span className="text-secondary text-muted">{meta.description}</span>
        </div>
        <span
          className={`text-label font-mono shrink-0 ${
            state.completed ? "text-success" : state.started ? "text-accent" : "text-muted"
          }`}
        >
          {status}
        </span>
      </div>
      {/* Progress fill along the bottom edge of the row */}
      <div className="h-px w-full bg-transparent mt-4 relative" aria-hidden="true">
        <div
          className={`absolute inset-y-0 left-0 h-[2px] -top-px rounded-full transition-[width] duration-300 ${
            state.completed ? "bg-success" : "bg-accent"
          }`}
          style={{ width: `${state.fraction * 100}%` }}
        />
      </div>
    </>
  );

  if (!meta.available) {
    return <div className="py-5 border-b border-hairline opacity-60">{inner}</div>;
  }

  return (
    <Link
      href={`/modulos/${meta.slug}`}
      className="block py-5 border-b border-hairline hover:bg-sub/50 transition-colors px-1 -mx-1"
    >
      {inner}
    </Link>
  );
}
