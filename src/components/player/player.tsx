"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ModuleMeta, ScreenMeta } from "@content/modules/registry";
import { getModuleProgress, setModuleProgress } from "@/lib/progress";
import { logEvent } from "@/lib/events";
import { ProgressSegments } from "./progress-segments";

interface Props {
  meta: ModuleMeta;
  screens: ScreenMeta[];
  // One rendered MDX screen per entry, same order as `screens`.
  children: ReactNode[];
}

// The module player: one screen at a time, forward/back, progress that
// persists locally, analytics events, and a completion moment at the end.
export function Player({ meta, screens, children }: Props) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const directionRef = useRef(1);
  const reduceMotion = useReducedMotion();

  // Resume where the student left off; log module_started on first visit.
  useEffect(() => {
    const saved = getModuleProgress(meta.slug);
    if (!saved) {
      logEvent("module_started", { moduleSlug: meta.slug });
      setModuleProgress(meta.slug, { screenIndex: 0 });
    } else {
      if (saved.completedAt) setFinished(true);
      setIndex(Math.min(saved.screenIndex, screens.length - 1));
    }
    setHydrated(true);
  }, [meta.slug, screens.length]);

  function goTo(next: number, direction: 1 | -1) {
    directionRef.current = direction;
    setIndex(next);
    setModuleProgress(meta.slug, { screenIndex: next });
    if (direction === 1) {
      logEvent("screen_advanced", { moduleSlug: meta.slug, screenIndex: next });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function finish() {
    setModuleProgress(meta.slug, {
      screenIndex: screens.length - 1,
      completedAt: new Date().toISOString(),
    });
    logEvent("module_completed", { moduleSlug: meta.slug });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (!hydrated) {
    // Avoid a flash of screen 1 before the saved position loads.
    return <div className="min-h-[60vh]" />;
  }

  if (finished) {
    return <Completion meta={meta} />;
  }

  const screen = screens[index];
  const isLast = index === screens.length - 1;
  const isBreak = screen.kind === "break";

  return (
    <div className="py-6 sm:py-10 flex flex-col gap-6 min-h-[calc(100vh-3.5rem)]">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-label text-muted font-mono">
            Módulo {String(meta.number).padStart(2, "0")} · {meta.title}
          </p>
          <p className="text-label text-muted font-mono">
            {index + 1} / {screens.length}
          </p>
        </div>
        <ProgressSegments total={screens.length} filled={index} />
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={index}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, x: 24 * directionRef.current }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, x: -24 * directionRef.current }
          }
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-5"
        >
          <h1 className={`text-h1 ${isBreak ? "text-fail" : ""}`}>
            {screen.title}
          </h1>
          <div className="flex flex-col gap-4">{children[index]}</div>
        </motion.section>
      </AnimatePresence>

      <footer className="flex items-center justify-between gap-3 pt-2 pb-6">
        <button
          type="button"
          onClick={() => goTo(index - 1, -1)}
          disabled={index === 0}
          className="h-11 px-4 rounded-[var(--radius-control)] text-muted hover:text-text transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          Atrás
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={finish}
            className="h-11 px-6 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Terminar módulo
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1, 1)}
            className="h-11 px-6 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Siguiente
          </button>
        )}
      </footer>
    </div>
  );
}

// Completion: subtle celebration, then a clear next action — never a
// dead screen. This is also the signup moment: the student now has
// something to lose.
function Completion({ meta }: { meta: ModuleMeta }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="py-16 sm:py-24 flex flex-col items-start gap-6">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-14 h-14 rounded-full bg-sub border-hairline border flex items-center justify-center text-success text-[22px]"
        aria-hidden="true"
      >
        ✓
      </motion.div>
      <h1 className="text-display">Módulo completado</h1>
      <p className="text-muted max-w-xl">
        Terminaste «{meta.title}». Tu progreso vive en este navegador; con una
        cuenta te sigue a donde vayas.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
        >
          Guardar mi progreso
        </Link>
        <Link
          href="/modulos"
          className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] border-hairline border text-text hover:bg-sub transition-colors"
        >
          Ver todos los módulos
        </Link>
      </div>
    </div>
  );
}
