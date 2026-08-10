"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Slider } from "./slider";

interface Choice {
  text: string;
  p: number;
  next?: Choice[];
}

// Hand-built next-token tree over Colombian school life. Small on
// purpose: the mechanic (pick the next word by probability) IS the
// lesson — it's how large language models generate text.
const START = "Mañana en el colegio";
const TREE: Choice[] = [
  {
    text: "hay",
    p: 0.44,
    next: [
      {
        text: "examen de",
        p: 0.5,
        next: [
          { text: "matemáticas", p: 0.61 },
          { text: "inglés", p: 0.27 },
          { text: "química", p: 0.12 },
        ],
      },
      {
        text: "partido",
        p: 0.3,
        next: [
          { text: "en la cancha", p: 0.68 },
          { text: "de la selección", p: 0.32 },
        ],
      },
      { text: "izada de bandera", p: 0.2 },
    ],
  },
  {
    text: "no hay",
    p: 0.31,
    next: [
      { text: "clases", p: 0.62 },
      { text: "internet", p: 0.38 },
    ],
  },
  {
    text: "toca",
    p: 0.15,
    next: [
      { text: "madrugar", p: 0.78 },
      { text: "exponer", p: 0.22 },
    ],
  },
  {
    text: "se cae",
    p: 0.1,
    next: [
      { text: "el internet", p: 0.9 },
      { text: "la excusa", p: 0.1 },
    ],
  },
];

interface Props {
  // Module 09: expose the sampling temperature and an auto-generate
  // button — the "chaos knob" every real LLM has.
  temperature?: boolean;
}

// Reweight probabilities by temperature: T→0 favors the top choice,
// T high flattens toward uniform randomness.
function reweight(options: Choice[], t: number): number[] {
  const powed = options.map((o) => Math.pow(o.p, 1 / Math.max(t, 0.05)));
  const sum = powed.reduce((a, b) => a + b, 0);
  return powed.map((p) => p / sum);
}

export function TokenPredictor({ temperature = false }: Props) {
  const [sentence, setSentence] = useState<string[]>([START]);
  const [options, setOptions] = useState<Choice[] | undefined>(TREE);
  const [temp, setTemp] = useState(10); // /10 → 1.0
  const reduceMotion = useReducedMotion();

  const done = !options;
  const t = temp / 10;
  const probs = options ? (temperature ? reweight(options, t) : options.map((o) => o.p)) : [];

  function pick(choice: Choice) {
    setSentence([...sentence, choice.text]);
    setOptions(choice.next);
  }

  function reset() {
    setSentence([START]);
    setOptions(TREE);
  }

  // Sample a full sentence at the current temperature, instantly.
  function autoGenerate() {
    const words: string[] = [START];
    let opts: Choice[] | undefined = TREE;
    while (opts) {
      const p = reweight(opts, t);
      let r = Math.random();
      let idx = 0;
      for (let i = 0; i < p.length; i++) {
        r -= p[i];
        if (r <= 0) {
          idx = i;
          break;
        }
      }
      const chosen: Choice = opts[idx];
      words.push(chosen.text);
      opts = chosen.next;
    }
    setSentence(words);
    setOptions(undefined);
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted">
        Tú eres el modelo: elige la siguiente palabra
      </p>

      {temperature && (
        <div className="flex flex-col gap-2">
          <Slider
            label="Temperatura — el control del caos"
            min={1}
            max={20}
            value={temp}
            onChange={setTemp}
            display={t.toFixed(1)}
          />
          <button
            type="button"
            onClick={autoGenerate}
            className="self-start h-11 px-5 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
          >
            Generar frase automática
          </button>
        </div>
      )}

      {/* The sentence under construction */}
      <p className="text-h2 min-h-[2.6em]" aria-live="polite">
        {sentence.map((w, i) => (
          <motion.span
            key={`${i}-${w}`}
            initial={reduceMotion || i === 0 ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={i === 0 ? "" : "text-accent"}
          >
            {i > 0 ? " " : ""}
            {w}
          </motion.span>
        ))}
        {!done && <span className="text-muted">…</span>}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
              <p className="text-secondary">
                Acabas de hacer, palabra por palabra, lo mismo que hace
                ChatGPT: <span className="font-medium">predecir lo que sigue</span>.
                Solo que él lo hace con miles de millones de opciones, millones
                de veces por segundo.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="self-start h-11 px-5 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
            >
              Generar otra frase
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={sentence.length}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2"
          >
            {options.map((o, i) => (
              <button
                key={o.text}
                type="button"
                onClick={() => pick(o)}
                className="relative h-11 rounded-[var(--radius-control)] border-hairline border overflow-hidden text-left px-4 hover:border-[var(--accent)] transition-colors"
              >
                {/* Probability bar behind the word */}
                <motion.span
                  className="absolute inset-y-0 left-0 bg-accent opacity-20"
                  initial={reduceMotion ? { width: `${probs[i] * 100}%` } : { width: 0 }}
                  animate={{ width: `${probs[i] * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  aria-hidden="true"
                />
                <span className="relative flex items-baseline justify-between gap-3">
                  <span className="font-medium">{o.text}</span>
                  <span className="text-label text-muted font-mono">
                    {Math.round(probs[i] * 100)} %
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
