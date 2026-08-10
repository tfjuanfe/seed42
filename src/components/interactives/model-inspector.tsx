"use client";

import { useMemo, useState } from "react";
import { predict, topWords, train, type Example } from "@/lib/text-model";

interface Props {
  trainSet: Example[];
  categories: { id: string; label: string }[];
}

// Opens the trained model's head: the words it learned to trust, and a
// box to interrogate it live.
export function ModelInspector({ trainSet, categories }: Props) {
  const [text, setText] = useState("");

  const model = useMemo(
    () => train(trainSet, categories.map((c) => c.id)),
    [trainSet, categories],
  );
  const result = text.trim() ? predict(model, text) : null;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="flex flex-col gap-2">
            <p className="text-label text-muted">
              Palabras que aprendió para «{c.label}»
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topWords(model, c.id, 6).map((w) => (
                <span
                  key={w.word}
                  className="text-label font-mono px-2.5 py-1 rounded-full border-hairline border text-accent"
                >
                  {w.word} +{w.weight.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-label text-muted">
          Escríbele un comentario nuevo y mira qué decide
        </span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="qué video tan…"
          className="h-11 px-4 rounded-[var(--radius-control)] bg-sub border-hairline border text-[17px]"
        />
      </label>

      {result && (
        <p className="text-secondary" aria-live="polite">
          El modelo dice:{" "}
          <span className="font-medium text-accent">
            {categories.find((c) => c.id === result)?.label}
          </span>
        </p>
      )}

      <p className="text-label text-muted">
        Nadie programó estas palabras: salieron de contar cuáles aparecían en
        cada categoría de tus ejemplos
      </p>
    </div>
  );
}
