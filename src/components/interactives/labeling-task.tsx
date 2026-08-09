"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

export interface LabelingItem {
  id: string;
  text: string;
  // Category id that counts as correct; null means "debatable" — every
  // answer gets the explanation instead of a right/wrong verdict.
  answer: string | null;
  explain?: string;
}

export interface LabelingCategory {
  id: string;
  label: string;
}

export interface LabelingResult {
  itemId: string;
  chosen: string;
  correct: boolean | null;
}

interface Props {
  items: LabelingItem[];
  categories: LabelingCategory[];
  // When false, no per-item verdict is shown (project mode: the student
  // commits to answers and defends them instead).
  showFeedback?: boolean;
  onComplete?: (results: LabelingResult[]) => void;
}

// One item at a time, full-width category buttons ≥44px tall: operable
// with a thumb at 380px. All state is local — response is instant.
export function LabelingTask({
  items,
  categories,
  showFeedback = true,
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<LabelingResult[]>([]);
  const [pending, setPending] = useState<LabelingResult | null>(null);
  const reduceMotion = useReducedMotion();

  const item = items[index];
  const done = index >= items.length;
  const hits = results.filter((r) => r.correct === true).length;
  const gradable = items.some((i) => i.answer !== null);

  function choose(categoryId: string) {
    if (!item || pending) return;
    const result: LabelingResult = {
      itemId: item.id,
      chosen: categoryId,
      correct: item.answer === null ? null : item.answer === categoryId,
    };
    if (showFeedback) {
      setPending(result);
    } else {
      commit(result);
    }
  }

  function commit(result: LabelingResult) {
    const next = [...results, result];
    setResults(next);
    setPending(null);
    setIndex(index + 1);
    if (next.length === items.length) onComplete?.(next);
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2">
          {gradable && showFeedback
            ? `Acertaste ${hits} de ${items.filter((i) => i.answer !== null).length}`
            : "Listo"}
        </p>
        <p className="text-secondary text-muted">
          {gradable && showFeedback
            ? "Sigue adelante para ver qué criterio estabas usando sin saberlo"
            : "Tus respuestas quedaron guardadas para el siguiente paso"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted font-mono">
        {index + 1} / {items.length}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={item.id}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="text-[17px] min-h-[3.2em]"
        >
          {item.text}
        </motion.p>
      </AnimatePresence>

      {pending ? (
        <div className="flex flex-col gap-3">
          <div
            className={`rounded-[var(--radius-control)] px-4 py-3 text-secondary border-hairline border ${
              pending.correct === null
                ? "text-text bg-sub"
                : pending.correct
                  ? "text-success bg-sub"
                  : "text-fail bg-sub"
            }`}
          >
            <p className="font-medium">
              {pending.correct === null
                ? "Depende"
                : pending.correct
                  ? "Correcto"
                  : "No exactamente"}
            </p>
            {item.explain && <p className="text-muted mt-1">{item.explain}</p>}
          </div>
          <button
            type="button"
            onClick={() => commit(pending)}
            className="self-end h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Siguiente
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              className="flex-1 min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
