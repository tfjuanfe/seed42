"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Prompt anatomy, hands-on: toggle the pieces of a good prompt and
// watch the (simulated) response sharpen. Honest label included — the
// point is the structure, not the puppet.

const BLOCKS = [
  { id: "tarea", label: "Tarea clara", text: "Explica la fotosíntesis" },
  { id: "publico", label: "Público", text: "para mi hermano de 8 años" },
  { id: "formato", label: "Formato", text: "en 3 pasos numerados" },
  { id: "ejemplo", label: "Ejemplo del tono", text: "con una comparación de cocina, como «la clorofila es la estufa»" },
  { id: "limites", label: "Límites", text: "sin palabras técnicas y en menos de 60 palabras" },
];

const RESPONSES: Record<number, string> = {
  0: "La fotosíntesis es el proceso mediante el cual los organismos fotoautótrofos convierten energía lumínica en energía química, sintetizando glucosa a partir de CO₂ y H₂O en los cloroplastos…",
  1: "La fotosíntesis es el proceso por el cual las plantas fabrican su alimento usando luz solar, agua y dióxido de carbono, produciendo glucosa y liberando oxígeno como subproducto…",
  2: "Las plantas hacen su propia comida. Usan la luz del sol, agua de la tierra y aire. Con eso fabrican su azúcar y sueltan el oxígeno que tú respiras.",
  3: "1. La hoja atrapa la luz del sol.\n2. Con agua y aire, fabrica su propia comida.\n3. De regalo, suelta el oxígeno que respiras.",
  4: "1. La hoja es una cocina: la luz del sol es la estufa.\n2. Mezcla agua y aire como ingredientes y cocina su comida.\n3. El vapor que sale de esa cocina es el oxígeno que respiras.",
  5: "1. La hoja es una cocina y la luz del sol es su estufa.\n2. Sus ingredientes: agua y aire. Su plato: azúcar para crecer.\n3. Lo que «sobra» de la receta es el oxígeno que tú respiras. Fin.",
};

export function PromptLab() {
  const [active, setActive] = useState<Set<string>>(new Set(["tarea"]));
  const reduceMotion = useReducedMotion();

  const count = active.size;
  const prompt = BLOCKS.filter((b) => active.has(b.id))
    .map((b) => b.text)
    .join(", ");

  function toggle(id: string) {
    const next = new Set(active);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // The task block is the backbone; without it there is no prompt.
    if (!next.has("tarea")) next.add("tarea");
    setActive(next);
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-label text-muted">
        Arma tu prompt por piezas y mira la respuesta afinarse
      </p>

      <div className="flex flex-wrap gap-2">
        {BLOCKS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => toggle(b.id)}
            aria-pressed={active.has(b.id)}
            className={`min-h-11 px-4 rounded-full border-hairline border transition-colors ${
              active.has(b.id)
                ? "border-[var(--accent)] text-accent font-medium"
                : "text-muted hover:text-text"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3">
        <p className="text-label text-muted mb-1">Tu prompt</p>
        <p className="text-secondary font-mono">«{prompt}»</p>
      </div>

      {/* Quality meter */}
      <div className="flex items-center gap-3">
        <span className="text-label text-muted shrink-0">Calidad de la respuesta</span>
        <div className="h-2 flex-1 rounded-full bg-sub overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${count >= 4 ? "bg-success" : "bg-accent"}`}
            initial={false}
            animate={{ width: `${(count / BLOCKS.length) * 100}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={count}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-[var(--radius-control)] border-hairline border px-4 py-3"
        >
          <p className="text-label text-muted mb-1">Respuesta simulada</p>
          <p className="text-secondary whitespace-pre-line">{RESPONSES[count]}</p>
        </motion.div>
      </AnimatePresence>

      <p className="text-label text-muted">
        Simulador con respuestas preescritas — la estructura del prompt es lo
        real. Pruébala tal cual en cualquier IA y compara
      </p>
    </div>
  );
}
