"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface CellIssue {
  kind: "missing" | "outlier" | "format" | "duplicate";
  suggestion: string;
  explain: string;
}

export interface TableCell {
  value: string;
  issue?: CellIssue;
}

export interface TableRow {
  id: string;
  cells: TableCell[];
}

export interface FixDecision {
  rowId: string;
  column: string;
  from: string;
  to: string;
  kind: CellIssue["kind"];
}

interface Props {
  columns: string[];
  rows: TableRow[];
  onComplete?: (decisions: FixDecision[]) => void;
}

const KIND_LABEL: Record<CellIssue["kind"], string> = {
  missing: "dato faltante",
  outlier: "valor imposible",
  format: "formato roto",
  duplicate: "fila duplicada",
};

// Editable table with a data-quality meter. Issues are guided fixes
// (tap cell → accept the correction) so it stays thumb-first at 380px.
export function DataTable({ columns, rows: initialRows, onComplete }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [decisions, setDecisions] = useState<FixDecision[]>([]);
  const reduceMotion = useReducedMotion();

  const totalIssues = initialRows.reduce(
    (a, r) => a + r.cells.filter((c) => c.issue).length,
    0,
  );
  const fixed = decisions.length;
  const quality = totalIssues === 0 ? 100 : Math.round((fixed / totalIssues) * 100);
  const done = fixed === totalIssues;

  const sel = selected ? rows[selected.r].cells[selected.c] : null;

  function applyFix() {
    if (!selected || !sel?.issue) return;
    const { r, c } = selected;
    const next = rows.map((row, ri) =>
      ri !== r
        ? row
        : {
            ...row,
            cells: row.cells.map((cell, ci) =>
              ci !== c ? cell : { value: cell.issue!.suggestion, issue: undefined },
            ),
          },
    );
    const decision: FixDecision = {
      rowId: rows[r].id,
      column: columns[c],
      from: sel.value,
      to: sel.issue.suggestion,
      kind: sel.issue.kind,
    };
    const nextDecisions = [...decisions, decision];
    setRows(next);
    setDecisions(nextDecisions);
    setSelected(null);
    if (nextDecisions.length === totalIssues) onComplete?.(nextDecisions);
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {/* Quality meter — the gamified fill */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-label text-muted">Calidad de los datos</span>
          <span className={`text-metric ${done ? "text-success" : "text-warn"}`}>
            {quality} %
          </span>
        </div>
        <div className="h-2 rounded-full bg-sub overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${done ? "bg-success" : "bg-warn"}`}
            initial={false}
            animate={{ width: `${Math.max(quality, 3)}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full border-collapse text-secondary">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left text-label text-muted font-mono font-normal px-2 py-2 border-b border-hairline"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id}>
                {row.cells.map((cell, ci) => {
                  const isSel = selected?.r === ri && selected?.c === ci;
                  return (
                    <td key={ci} className="border-b border-hairline p-0">
                      <button
                        type="button"
                        onClick={() => setSelected(isSel ? null : { r: ri, c: ci })}
                        className={`w-full text-left px-2 py-2.5 min-h-11 font-mono text-[13.5px] transition-colors ${
                          cell.issue
                            ? "text-fail bg-[color-mix(in_srgb,var(--fail)_8%,transparent)]"
                            : decisions.some(
                                  (d) => d.rowId === row.id && d.column === columns[ci],
                                )
                              ? "text-success"
                              : ""
                        } ${isSel ? "outline outline-1 outline-[var(--accent)] rounded-[6px]" : ""}`}
                      >
                        {cell.value || "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action panel for the selected cell */}
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div
            key={`${selected!.r}-${selected!.c}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3 flex flex-col gap-3"
          >
            {sel.issue ? (
              <>
                <p className="text-secondary">
                  <span className="text-fail font-medium">
                    {KIND_LABEL[sel.issue.kind]}:
                  </span>{" "}
                  {sel.issue.explain}
                </p>
                <button
                  type="button"
                  onClick={applyFix}
                  className="self-start h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
                >
                  Corregir a «{sel.issue.suggestion}»
                </button>
              </>
            ) : (
              <p className="text-secondary text-muted">
                Esta celda se ve bien. Busca las que están marcadas en rosa
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {done && (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-secondary text-success font-medium"
        >
          Dataset limpio. Un modelo entrenado con esto ya no hereda los errores
        </motion.p>
      )}
    </div>
  );
}
