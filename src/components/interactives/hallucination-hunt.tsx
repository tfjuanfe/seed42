"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// An AI-style answer with lies woven in. Tap the sentences you distrust;
// the reveal explains each one. Every fact here is checkable.

interface Sentence {
  id: string;
  text: string;
  false_: boolean;
  explain: string;
}

const ANSWER: Sentence[] = [
  {
    id: "s1",
    text: "Gabriel García Márquez ganó el Premio Nobel de Literatura en 1982.",
    false_: false,
    explain: "Cierto: Estocolmo, 1982.",
  },
  {
    id: "s2",
    text: "Escribió «Cien años de soledad» en su casa de Cartagena, frente al mar Caribe.",
    false_: true,
    explain: "Falso — la escribió en Ciudad de México. Pero suena tan plausible que el modelo lo «completa» sin dudar.",
  },
  {
    id: "s3",
    text: "La novela cuenta la historia de la familia Buendía en el pueblo de Macondo.",
    false_: false,
    explain: "Cierto: es la columna vertebral del libro.",
  },
  {
    id: "s4",
    text: "En 1985 publicó «El amor en los tiempos del cólera».",
    false_: false,
    explain: "Cierto: 1985.",
  },
  {
    id: "s5",
    text: "En su discurso del Nobel, «La soledad de América Latina», citó un verso de su amigo Pablo Neruda, presente esa noche en Estocolmo.",
    false_: true,
    explain: "Imposible — Neruda murió en 1973, nueve años antes. El modelo une piezas que suenan bien juntas: dos Nobel latinoamericanos, amigos, Estocolmo… y fabrica una escena que nunca existió.",
  },
];

export function HallucinationHunt() {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  function toggle(id: string) {
    if (revealed) return;
    const next = new Set(flagged);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFlagged(next);
  }

  const hits = ANSWER.filter((s) => s.false_ && flagged.has(s.id)).length;
  const falseCount = ANSWER.filter((s) => s.false_).length;
  const wrongFlags = ANSWER.filter((s) => !s.false_ && flagged.has(s.id)).length;

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted">
        Le preguntamos a una IA por García Márquez. Toca las frases que NO le
        creas — hay mentiras escondidas
      </p>

      <div className="flex flex-col gap-2">
        {ANSWER.map((s) => {
          const isFlagged = flagged.has(s.id);
          const showState = revealed;
          return (
            <div key={s.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toggle(s.id)}
                disabled={revealed}
                aria-pressed={isFlagged}
                className={`text-left px-4 py-3 rounded-[var(--radius-control)] border-hairline border transition-colors text-secondary ${
                  showState
                    ? s.false_
                      ? "border-[var(--fail)] bg-[color-mix(in_srgb,var(--fail)_7%,transparent)]"
                      : "border-[var(--success)]"
                    : isFlagged
                      ? "border-[var(--warn)] text-text"
                      : "hover:border-[var(--accent)]"
                }`}
              >
                {s.text}
                {!revealed && isFlagged && (
                  <span className="text-warn text-label font-mono ml-2">sospechosa</span>
                )}
              </button>
              {revealed && (
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-label px-4 ${s.false_ ? "text-fail" : "text-muted"}`}
                >
                  {s.explain}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={flagged.size === 0}
          className="self-start h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Verificar mis sospechas
        </button>
      ) : (
        <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
          <p className="text-secondary">
            Atrapaste {hits} de {falseCount} mentiras
            {wrongFlags > 0 && `, y acusaste ${wrongFlags} verdad${wrongFlags > 1 ? "es" : ""} inocente${wrongFlags > 1 ? "s" : ""}`}
            .{" "}
            <span className="text-muted">
              Nota cómo las mentiras no suenan raras: suenan MÁS fluidas que
              la verdad. El modelo no miente — predice texto plausible, y lo
              plausible no siempre pasó.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
