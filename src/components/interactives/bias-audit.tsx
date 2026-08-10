"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A scholarship model trained on biased historical decisions. The
// student toggles input variables and watches whether the gap between
// groups actually closes. Fully synthetic, computed live, deterministic.

interface Applicant {
  privado: boolean; // school type
  icfes: number; // 0..1 academic score (equal across groups by design)
  estrato: number; // 1..6, correlated with school type — the proxy
  qualified: boolean;
}

function makeApplicants(): Applicant[] {
  const out: Applicant[] = [];
  let s = 1234;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 200; i++) {
    const privado = i < 100;
    const icfes = 0.25 + rnd() * 0.65; // same talent distribution
    // estrato correlates with school type but overlaps (the proxy).
    const estrato = Math.min(
      6,
      Math.max(1, Math.round((privado ? 4.2 : 2.4) + (rnd() - 0.5) * 2.4)),
    );
    out.push({ privado, icfes, estrato, qualified: icfes >= 0.55 });
  }
  return out;
}

interface Config {
  useColegio: boolean;
  useEstrato: boolean;
  quota: boolean;
}

// The "trained on history" model: academic merit plus inherited
// preference for private schools, leaking through estrato as well.
function score(a: Applicant, cfg: Config): number {
  let v = a.icfes * 1.0;
  if (cfg.useColegio) v += a.privado ? 0.16 : 0;
  if (cfg.useEstrato) v += (a.estrato - 3) * 0.05;
  return v;
}

function evaluate(applicants: Applicant[], cfg: Config) {
  const scored = applicants.map((a) => ({ a, s: score(a, cfg) }));

  let approvedSet: Set<Applicant>;
  if (cfg.quota) {
    // Force equal approval counts per group, top-scored within each.
    const per = (g: boolean) =>
      scored
        .filter((x) => x.a.privado === g)
        .sort((x, y) => y.s - x.s)
        .slice(0, 40)
        .map((x) => x.a);
    approvedSet = new Set([...per(true), ...per(false)]);
  } else {
    approvedSet = new Set(
      scored
        .sort((x, y) => y.s - x.s)
        .slice(0, 80)
        .map((x) => x.a),
    );
  }

  const group = (g: boolean) => {
    const members = applicants.filter((a) => a.privado === g);
    const approved = members.filter((a) => approvedSet.has(a));
    const qualified = members.filter((a) => a.qualified);
    const qualifiedApproved = qualified.filter((a) => approvedSet.has(a));
    const unqualifiedApproved = approved.filter((a) => !a.qualified);
    return {
      rate: approved.length / members.length,
      missedTalent: qualified.length - qualifiedApproved.length,
      unfairPasses: unqualifiedApproved.length,
    };
  };

  return { priv: group(true), pub: group(false) };
}

interface Props {
  // "rates": hook — just show the gap. "toggles": remove variables.
  // "quota": the brute-force fix and its side effects.
  mode: "rates" | "toggles" | "quota";
}

export function BiasAudit({ mode }: Props) {
  const applicants = useMemo(makeApplicants, []);
  const [cfg, setCfg] = useState<Config>({
    useColegio: true,
    useEstrato: true,
    quota: false,
  });
  const [ran, setRan] = useState(mode !== "rates");
  const reduceMotion = useReducedMotion();

  const effectiveCfg = mode === "quota" ? { ...cfg, quota: cfg.quota } : cfg;
  const r = evaluate(applicants, effectiveCfg);
  const gap = Math.round((r.priv.rate - r.pub.rate) * 100);

  const bar = (label: string, rate: number, extra?: string) => (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-secondary">{label}</span>
      <div className="h-6 flex-1 rounded-[6px] bg-sub overflow-hidden">
        <motion.div
          className="h-full rounded-[6px] bg-accent opacity-80"
          initial={false}
          animate={{ width: `${rate * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-label text-muted font-mono w-24 text-right">
        {Math.round(rate * 100)} %{extra ? ` ${extra}` : ""}
      </span>
    </div>
  );

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      {!ran ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-secondary text-muted">
            200 aspirantes a una beca — mismo talento en ambos grupos, eso lo
            garantizamos nosotros al construir los datos. El modelo aprendió
            de las decisiones de becas de los últimos 20 años.
          </p>
          <button
            type="button"
            onClick={() => setRan(true)}
            className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Evaluar a los 200 aspirantes
          </button>
        </div>
      ) : (
        <>
          <p className="text-label text-muted">
            Tasa de aprobación por grupo · beca para 80 de 200
          </p>
          <div className="flex flex-col gap-2">
            {bar("Colegio privado", r.priv.rate)}
            {bar("Colegio público", r.pub.rate)}
          </div>
          <p className="text-secondary" aria-live="polite">
            Brecha:{" "}
            <span className={`font-medium font-mono ${Math.abs(gap) > 8 ? "text-fail" : "text-success"}`}>
              {gap} puntos
            </span>
            {Math.abs(gap) <= 8 && mode !== "quota" && " — casi pareja"}
          </p>

          {mode === "toggles" && (
            <div className="flex flex-col gap-2">
              <p className="text-label text-muted">
                Quítale variables al modelo y mira si la brecha cede
              </p>
              <div className="flex flex-wrap gap-2">
                <Toggle
                  on={cfg.useColegio}
                  label="usa «tipo de colegio»"
                  onClick={() => setCfg({ ...cfg, useColegio: !cfg.useColegio })}
                />
                <Toggle
                  on={cfg.useEstrato}
                  label="usa «estrato»"
                  onClick={() => setCfg({ ...cfg, useEstrato: !cfg.useEstrato })}
                />
              </div>
            </div>
          )}

          {mode === "quota" && (
            <>
              <div className="flex flex-wrap gap-2">
                <Toggle
                  on={cfg.quota}
                  label="forzar tasas iguales (40 y 40)"
                  onClick={() => setCfg({ ...cfg, quota: !cfg.quota })}
                />
              </div>
              {cfg.quota && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[var(--radius-control)] bg-sub border-hairline border px-4 py-3 flex flex-col gap-1"
                >
                  <p className="text-secondary">
                    Tasas perfectamente iguales. El costo quedó escondido:
                  </p>
                  <p className="text-secondary text-muted">
                    · Talentosos de colegio privado que quedaron por fuera:{" "}
                    <span className="text-fail font-mono">{r.priv.missedTalent}</span>
                    <br />· Becas a aspirantes no calificados:{" "}
                    <span className="text-fail font-mono">
                      {r.priv.unfairPasses + r.pub.unfairPasses}
                    </span>
                  </p>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-11 px-4 rounded-full border-hairline border transition-colors ${
        on
          ? "border-[var(--accent)] text-accent font-medium"
          : "text-muted hover:text-text line-through"
      }`}
    >
      {label}
    </button>
  );
}
