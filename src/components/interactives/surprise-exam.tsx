"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { predict, train, type Example } from "@/lib/text-model";

interface Props {
  trainSet: Example[];
  categories: { id: string; label: string }[];
  // The exam the training set never prepared the model for.
  examItems: Example[];
  lesson: string;
}

// Break-it screen: a well-trained model meets the Spanish it never saw.
export function SurpriseExam({ trainSet, categories, examItems, lesson }: Props) {
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  const model = useMemo(
    () => train(trainSet, categories.map((c) => c.id)),
    [trainSet, categories],
  );
  const results = examItems.map((e) => ({
    ...e,
    got: predict(model, e.text),
  }));
  const hits = results.filter((r) => r.got === r.label).length;
  const pct = Math.round((hits / examItems.length) * 100);

  if (!revealed) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col items-start gap-3">
        <p className="text-secondary text-muted">
          El modelo viene de sacar ~90 % con comentarios «de manual». Ahora el
          examen lo escriben estudiantes de verdad: jerga, emojis, sarcasmo.
        </p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
        >
          Aplicar el examen sorpresa
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-muted">Nota en el examen sorpresa</span>
        <motion.span
          initial={reduceMotion ? false : { scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-metric text-[26px] text-fail"
        >
          {pct} %
        </motion.span>
      </div>

      <div className="flex flex-col gap-1.5">
        {results.map((r, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.12 }}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] bg-sub border-hairline border px-3 py-2"
          >
            <span className="text-secondary">«{r.text}»</span>
            <span
              className={`text-label font-mono shrink-0 ${
                r.got === r.label ? "text-success" : "text-fail"
              }`}
            >
              {r.got === r.label ? "acertó" : "falló"}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
        <p className="text-secondary">{lesson}</p>
      </div>
    </div>
  );
}
