import Link from "next/link";
import { modules } from "@content/modules/registry";

const steps = [
  {
    title: "Toca",
    text: "Cada módulo abre con algo para manipular, no con un texto para leer",
  },
  {
    title: "Rómpelo",
    text: "Haces fallar lo que construiste; ahí es donde de verdad se aprende",
  },
  {
    title: "Entrega",
    text: "Cada módulo termina en un proyecto real que queda guardado",
  },
];

export default function HomePage() {
  const available = modules.filter((m) => m.available).length;

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-16 sm:py-24">
      <section className="flex flex-col items-start gap-6">
        <p className="text-label text-muted font-mono">
          Gratis · en español · sin instalar nada
        </p>
        <h1 className="text-display max-w-2xl">
          Aprende inteligencia artificial haciendo
        </h1>
        <p className="text-muted max-w-xl">
          Ejercicios interactivos en tu navegador, con datos de Colombia.
          Tocas, experimentas y entiendes; la teoría llega después.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/modulos/${modules[0].slug}`}
            className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Empezar el módulo 01
          </Link>
          <Link
            href="/modulos"
            className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] border-hairline border text-text hover:bg-sub transition-colors"
          >
            Ver los diez módulos
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-[11px]">
        {steps.map((s) => (
          <div
            key={s.title}
            className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-2"
          >
            <h2 className="text-h2">{s.title}</h2>
            <p className="text-secondary text-muted">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-h1">El plan completo</h2>
          <p className="text-label text-muted font-mono">
            {available} de {modules.length} disponibles
          </p>
        </div>
        <ol className="flex flex-col">
          {modules.map((m) => (
            <li
              key={m.slug}
              className="flex items-baseline gap-4 py-3 border-b border-hairline last:border-b-0"
            >
              <span className="text-label text-muted font-mono w-6 shrink-0">
                {String(m.number).padStart(2, "0")}
              </span>
              {m.available ? (
                <Link
                  href={`/modulos/${m.slug}`}
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  {m.title}
                </Link>
              ) : (
                <span className="text-muted">{m.title}</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
