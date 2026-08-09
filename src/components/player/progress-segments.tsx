"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  total: number;
  // Number of segments already filled (screens completed).
  filled: number;
}

// The gamified progress bar: one segment per screen, filling as the
// student advances. Reused (smaller) on module cards.
export function ProgressSegments({ total, filled }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="flex gap-1 w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={filled}
      aria-label="Progreso del módulo"
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full bg-sub overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ scaleX: i < filled ? 1 : 0 }}
            style={{ originX: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }
            }
          />
        </div>
      ))}
    </div>
  );
}
