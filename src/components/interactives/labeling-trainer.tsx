"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { accuracy, train, type Example } from "@/lib/text-model";

interface Props {
  // Items the student labels, one by one.
  items: { id: string; text: string }[];
  categories: { id: string; label: string }[];
  // Hidden exam the model is graded on after every label.
  testItems: Example[];
  // Labeled examples the model starts with (0 for the hook).
  preLabeled?: Example[];
}

const CURVE_W = 320;
const CURVE_H = 90;

// The student labels; the model retrains after every answer; the live
// accuracy curve is the star of the screen. This IS supervised learning.
export function LabelingTrainer({ items, categories, testItems, preLabeled = [] }: Props) {
  const [index, setIndex] = useState(0);
  const [examples, setExamples] = useState<Example[]>(preLabeled);
  const [curve, setCurve] = useState<number[]>(() => {
    if (preLabeled.length === 0) return [];
    return [accuracy(train(preLabeled, categories.map((c) => c.id)), testItems)];
  });
  const reduceMotion = useReducedMotion();

  const done = index >= items.length;
  const labels = categories.map((c) => c.id);
  const acc = curve.length > 0 ? curve[curve.length - 1] : 0;

  function choose(catId: string) {
    if (done) return;
    const next = [...examples, { text: items[index].text, label: catId }];
    setExamples(next);
    setCurve([...curve, accuracy(train(next, labels), testItems)]);
    setIndex(index + 1);
  }

  const xStep = CURVE_W / Math.max(items.length + preLabeled.length ? items.length + (preLabeled.length ? 1 : 0) : 1, 1);
  const pointsAttr = curve
    .map((a, i) => `${(i + 1) * xStep},${CURVE_H - 10 - a * (CURVE_H - 20)}`)
    .join(" ");

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {/* Live exam score */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-label text-muted">
          Nota del modelo en el examen oculto ({testItems.length} frases)
        </span>
        <motion.span
          key={curve.length}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-metric ${acc >= 0.8 ? "text-success" : "text-accent"}`}
        >
          {curve.length === 0 ? "—" : `${Math.round(acc * 100)} %`}
        </motion.span>
      </div>

      <svg viewBox={`0 0 ${CURVE_W} ${CURVE_H}`} className="w-full h-auto select-none" aria-hidden="true">
        <line x1="0" y1={CURVE_H - 10} x2={CURVE_W} y2={CURVE_H - 10} stroke="var(--border)" strokeWidth="1" />
        {/* 50% = coin-flip line */}
        <line
          x1="0"
          y1={CURVE_H - 10 - 0.5 * (CURVE_H - 20)}
          x2={CURVE_W}
          y2={CURVE_H - 10 - 0.5 * (CURVE_H - 20)}
          stroke="var(--muted)"
          strokeWidth="0.5"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <text x="4" y={CURVE_H - 14 - 0.5 * (CURVE_H - 20)} fontSize="8" className="font-mono" fill="var(--muted)">
          azar
        </text>
        {curve.length > 1 && (
          <motion.polyline
            points={pointsAttr}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            initial={false}
          />
        )}
        {curve.map((a, i) => (
          <motion.circle
            key={i}
            initial={reduceMotion ? false : { r: 0 }}
            animate={{ r: 3 }}
            cx={(i + 1) * xStep}
            cy={CURVE_H - 10 - a * (CURVE_H - 20)}
            fill="var(--accent)"
          />
        ))}
      </svg>

      {done ? (
        <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
          <p className="text-secondary">
            <span className="text-success font-medium">
              Entrenaste un modelo con {examples.length} ejemplos.
            </span>{" "}
            Cada punto de la curva es el modelo re-entrenado con una frase
            más — tuya.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-label text-muted font-mono">
            {index + 1} / {items.length}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={items[index].id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="text-[17px] min-h-[2.6em]"
            >
              «{items[index].text}»
            </motion.p>
          </AnimatePresence>
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
        </div>
      )}
    </div>
  );
}
