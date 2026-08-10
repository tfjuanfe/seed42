"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Collaborative filtering at toy scale: rate genres, get matched to
// synthetic listeners, receive a recommendation you can inspect.

const GENRES = ["Reggaetón", "Vallenato", "Rock en español", "Salsa", "Pop", "Electrónica"];
// Six synthetic listeners: their taste for each genre (-1 … 1).
const LISTENERS = [
  [0.9, 0.6, -0.5, 0.7, 0.4, -0.2],
  [0.8, -0.3, 0.1, 0.2, 0.9, 0.6],
  [-0.6, -0.4, 0.9, -0.2, 0.1, 0.7],
  [0.3, 0.9, -0.2, 0.8, 0.2, -0.5],
  [-0.2, 0.1, 0.7, 0.3, -0.4, 0.9],
  [0.6, 0.2, 0.4, 0.9, 0.5, 0.1],
];

// The student rates the first four; the model recommends among the rest.
const RATED = 4;

export function MiniRecommender() {
  const [ratings, setRatings] = useState<(1 | -1 | null)[]>(
    Array(RATED).fill(null),
  );
  const reduceMotion = useReducedMotion();

  const complete = ratings.every((r) => r !== null);

  function rate(i: number, value: 1 | -1) {
    const next = [...ratings];
    next[i] = next[i] === value ? null : value;
    setRatings(next);
  }

  // Similarity to each listener on the rated genres, then a weighted
  // vote on the unrated ones.
  let scores: { genre: string; score: number }[] = [];
  if (complete) {
    const sims = LISTENERS.map((l) => {
      let s = 0;
      for (let i = 0; i < RATED; i++) s += (ratings[i] as number) * l[i];
      return s / RATED;
    });
    scores = GENRES.slice(RATED).map((genre, j) => {
      let num = 0;
      let den = 0;
      for (let k = 0; k < LISTENERS.length; k++) {
        num += Math.max(sims[k], 0) * LISTENERS[k][RATED + j];
        den += Math.max(sims[k], 0);
      }
      return { genre, score: den > 0 ? num / den : 0 };
    });
    scores.sort((a, b) => b.score - a.score);
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted">
        Califica estos cuatro géneros y el modelo te recomienda el quinto
      </p>

      <div className="flex flex-col gap-2">
        {GENRES.slice(0, RATED).map((g, i) => (
          <div
            key={g}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-2"
          >
            <span>{g}</span>
            <span className="flex gap-1.5">
              <button
                type="button"
                onClick={() => rate(i, 1)}
                aria-label={`Me gusta ${g}`}
                aria-pressed={ratings[i] === 1}
                className={`w-11 h-11 rounded-[var(--radius-control)] border-hairline border font-medium transition-colors ${
                  ratings[i] === 1
                    ? "border-[var(--success)] text-success"
                    : "text-muted hover:text-text"
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => rate(i, -1)}
                aria-label={`No me gusta ${g}`}
                aria-pressed={ratings[i] === -1}
                className={`w-11 h-11 rounded-[var(--radius-control)] border-hairline border font-medium transition-colors ${
                  ratings[i] === -1
                    ? "border-[var(--fail)] text-fail"
                    : "text-muted hover:text-text"
                }`}
              >
                No
              </button>
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <p className="text-label text-muted">
              Gente con tus gustos también escucha…
            </p>
            {scores.map(({ genre, score }, i) => {
              const pct = Math.round(((score + 1) / 2) * 100);
              return (
                <div key={genre} className="flex items-center gap-3">
                  <span className={`w-36 shrink-0 ${i === 0 ? "font-medium text-accent" : "text-muted"}`}>
                    {genre}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-sub overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${i === 0 ? "bg-accent" : "bg-[var(--muted)]"}`}
                      initial={reduceMotion ? { width: `${pct}%` } : { width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-label text-muted font-mono w-10 text-right">
                    {pct}
                  </span>
                </div>
              );
            })}
            <p className="text-label text-muted mt-1">
              Sin entender de música: solo comparó tus respuestas con las de
              otros oyentes. Así funcionan Spotify y TikTok
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
