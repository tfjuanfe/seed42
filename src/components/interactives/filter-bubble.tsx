"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// The recommender's failure mode, simulated: accept every suggestion
// and watch your feed collapse into one genre.

const GENRES = ["Reggaetón", "Vallenato", "Rock", "Salsa", "Electrónica"];
const COLORS = ["var(--accent)", "var(--success)", "var(--warn)", "var(--fail)", "var(--muted)"];
const START = [0.2, 0.2, 0.2, 0.2, 0.2];
const MAX_ROUNDS = 4;

function sharpen(dist: number[]): number[] {
  // Each accepted month: the top genre absorbs share from the rest.
  const top = dist.indexOf(Math.max(...dist));
  const next = dist.map((v, i) => (i === top ? v : v * 0.45));
  const sum = next.reduce((a, b) => a + b, 0);
  return next.map((v) => v / sum);
}

function diversity(dist: number[]): number {
  // Normalized entropy: 100 % = perfectly varied feed.
  const h = -dist.reduce((a, p) => a + (p > 0 ? p * Math.log(p) : 0), 0);
  return Math.round((h / Math.log(dist.length)) * 100);
}

export function FilterBubble() {
  const [dist, setDist] = useState(START);
  const [round, setRound] = useState(0);
  const reduceMotion = useReducedMotion();

  const done = round >= MAX_ROUNDS;
  const div = diversity(dist);

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label text-muted">Tu feed musical</p>
        <p className="text-label font-mono">
          <span className={div < 50 ? "text-fail" : "text-muted"}>
            variedad {div} %
          </span>
        </p>
      </div>

      {/* The feed as a single stacked bar */}
      <div className="h-8 rounded-[var(--radius-control)] overflow-hidden flex border-hairline border">
        {dist.map((v, i) => (
          <motion.div
            key={GENRES[i]}
            initial={false}
            animate={{ width: `${v * 100}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            style={{ background: COLORS[i], opacity: 0.75 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {GENRES.map((g, i) => (
          <span key={g} className="flex items-center gap-1.5 text-label text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: COLORS[i], opacity: 0.75 }}
              aria-hidden="true"
            />
            {g} {Math.round(dist[i] * 100)} %
          </span>
        ))}
      </div>

      {done ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
            <p className="text-secondary">
              <span className="text-fail font-medium">
                Cuatro meses después, tu feed es casi un solo género.
              </span>{" "}
              El modelo no te encerró por malo: te encerró por obediente.
              Optimiza lo que ya te gusta, nunca lo que podrías descubrir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDist(START);
              setRound(0);
            }}
            className="self-start h-11 px-5 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
          >
            Salir de la burbuja
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDist(sharpen(dist));
            setRound(round + 1);
          }}
          className="self-start h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
        >
          {round === 0
            ? "Acepta todo lo que te recomiende un mes"
            : `Otro mes igual (${round} de ${MAX_ROUNDS})`}
        </button>
      )}
    </div>
  );
}
