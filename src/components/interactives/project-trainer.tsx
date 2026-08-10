"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { accuracy, train, type Example } from "@/lib/text-model";
import { saveArtifact } from "@/lib/artifacts";
import { logEvent } from "@/lib/events";

interface GroupedExample extends Example {
  group: string;
}

interface Props {
  moduleSlug: string;
  items: { id: string; text: string }[];
  categories: { id: string; label: string }[];
  // Test set tagged by group so the report can expose the gap the
  // student's labels (and the item mix) created.
  testItems: GroupedExample[];
  groups: { id: string; label: string }[];
}

const MIN_TEXT = 40;

export function ProjectTrainer({ moduleSlug, items, categories, testItems, groups }: Props) {
  const [index, setIndex] = useState(0);
  const [examples, setExamples] = useState<Example[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  const labels = categories.map((c) => c.id);
  const done = index >= items.length;

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2">
        <p className="text-h2 text-success">Proyecto entregado</p>
        <p className="text-secondary text-muted">
          Entrenaste, evaluaste y diagnosticaste tu propio modelo. Pasa a la
          última pantalla.
        </p>
      </div>
    );
  }

  if (!done) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <p className="text-label text-muted font-mono">
            {index + 1} / {items.length}
          </p>
          {/* Gamified fill for the labeling grind */}
          <div className="w-32 h-1.5 rounded-full bg-sub overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${(index / items.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-[17px] min-h-[2.6em]">«{items[index].text}»</p>
        <div className="flex flex-col sm:flex-row gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setExamples([...examples, { text: items[index].text, label: c.id }]);
                setIndex(index + 1);
              }}
              className="flex-1 min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const model = train(examples, labels);
  const overall = accuracy(model, testItems);
  const byGroup = groups.map((g) => ({
    ...g,
    acc: accuracy(model, testItems.filter((t) => t.group === g.id)),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
        <p className="text-h2">El reporte de tu modelo</p>
        <div className="flex items-baseline gap-3">
          <span className="text-label text-muted">Nota general</span>
          <span className="text-metric text-[26px] text-accent">
            {Math.round(overall * 100)} %
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {byGroup.map((g, i) => (
            <div key={g.id} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-secondary">{g.label}</span>
              <div className="h-2 flex-1 rounded-full bg-sub overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${g.acc < 0.65 ? "bg-fail" : "bg-success"}`}
                  initial={reduceMotion ? { width: `${g.acc * 100}%` } : { width: 0 }}
                  animate={{ width: `${g.acc * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                />
              </div>
              <span className="text-label text-muted font-mono w-10 text-right">
                {Math.round(g.acc * 100)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-label text-muted">
          La nota general esconde el hueco. Mira dónde está la barra rosa: eso
          fue lo que tus 20 ejemplos no cubrieron bien
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-secondary">
            ¿Dónde falla tu modelo y qué ejemplos le agregarías para
            arreglarlo?
          </span>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={4}
            placeholder="Falla con… porque mis ejemplos casi no tenían…"
            className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
          />
        </label>
        <div className="flex items-center justify-between gap-3">
          <p className="text-label text-muted font-mono">
            {reasoning.trim().length >= MIN_TEXT
              ? "Listo para entregar"
              : `Te faltan ${MIN_TEXT - reasoning.trim().length} caracteres`}
          </p>
          <button
            type="button"
            disabled={reasoning.trim().length < MIN_TEXT}
            onClick={() => {
              saveArtifact(moduleSlug, {
                type: "trained-model",
                labels: examples,
                overallAccuracy: overall,
                groupAccuracy: byGroup.map(({ id, acc }) => ({ id, acc })),
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
