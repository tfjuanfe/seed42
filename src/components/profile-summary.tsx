"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { modules } from "@content/modules/registry";
import { getProgress, type ProgressMap } from "@/lib/progress";
import { getArtifacts, type StoredArtifact } from "@/lib/artifacts";
import { clearAccount, getAccount, type Account } from "@/lib/account";

// The student's dashboard: inline stats (no boxes), module list rows,
// account info and logout.
export function ProfileSummary() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [artifacts, setArtifacts] = useState<StoredArtifact[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setProgress(getProgress());
    setArtifacts(getArtifacts());
    setAccount(getAccount());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const started = Object.keys(progress).length;
  const completed = Object.values(progress).filter((p) => p.completedAt).length;
  const projects = artifacts.filter((a) => !a.moduleSlug.includes(":")).length;

  const stats = [
    { value: started, label: "empezados" },
    { value: completed, label: "completados" },
    { value: projects, label: "proyectos" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {account && (
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-h2 truncate">{account.name}</p>
            <p className="text-label text-muted font-mono truncate">{account.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAccount();
              router.replace("/login");
            }}
            className="text-secondary text-muted hover:text-text transition-colors shrink-0 h-11 px-2"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {started === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-muted max-w-xl">
            Todavía no has empezado ningún módulo. El primero te espera.
          </p>
          <Link
            href="/modulos/que-es-la-ia"
            className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Empezar el módulo 01
          </Link>
        </div>
      ) : (
        <>
          {/* Inline stats — numbers on the page, not in boxes */}
          <div className="flex items-baseline gap-8 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-display text-accent font-mono">{s.value}</span>
                <span className="text-label text-muted">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col border-t border-hairline">
            {modules
              .filter((m) => progress[m.slug])
              .map((m) => {
                const p = progress[m.slug];
                return (
                  <Link
                    key={m.slug}
                    href={`/modulos/${m.slug}`}
                    className="flex items-baseline justify-between gap-3 py-3.5 border-b border-hairline hover:bg-sub/50 transition-colors px-1 -mx-1"
                  >
                    <span className="flex items-baseline gap-4 min-w-0">
                      <span className="text-label text-muted font-mono w-6 shrink-0">
                        {String(m.number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{m.title}</span>
                    </span>
                    <span
                      className={`text-label font-mono shrink-0 ${
                        p.completedAt ? "text-success" : "text-accent"
                      }`}
                    >
                      {p.completedAt ? "Completado" : "En curso"}
                    </span>
                  </Link>
                );
              })}
          </div>

          <p className="text-label text-muted max-w-xl">
            Tu progreso y tu cuenta viven en este navegador. Con la entrada de
            Google — muy pronto — te seguirán a donde vayas
          </p>
        </>
      )}
    </div>
  );
}
