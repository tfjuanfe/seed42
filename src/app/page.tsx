import Link from "next/link";
import Image from "next/image";
import { modules } from "@content/modules/registry";
import { RainPredictor } from "@/components/interactives/rain-predictor";
import fotoSalud from "@/../public/images/salud.jpg";
import fotoCafe from "@/../public/images/cafe.jpg";
import fotoMetrocable from "@/../public/images/metrocable.jpg";

const realUses = [
  {
    src: fotoSalud,
    alt: "Sala de resonancia magnética con un paciente entrando al escáner",
    caption: "Salud",
    credit: "Ptrump16 · CC BY-SA",
    text: "Modelos que leen resonancias y radiografías detectan tumores que un ojo cansado puede pasar por alto",
  },
  {
    src: fotoCafe,
    alt: "Paisaje cultural cafetero en Quindío, con palmas y cultivos",
    caption: "Campo",
    credit: "Rope.96 · CC BY-SA",
    text: "Cámaras con IA revisan hojas de café y detectan la roya semanas antes de que el caficultor pueda verla",
  },
  {
    src: fotoMetrocable,
    alt: "Cabina del Metrocable sobre los barrios de Medellín",
    caption: "Ciudad",
    credit: "B. Gagnon · CC BY-SA",
    text: "Los sistemas de transporte usan predicción de demanda para decidir frecuencias — Medellín lo hace hoy",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 py-12 sm:py-20">
      {/* The hero is the product: a live model, not a screenshot of one */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">Gratis · en español · sin instalar nada</p>
          <h1 className="text-display max-w-xl">
            Tu primer modelo de IA está a la derecha. Pruébalo
          </h1>
          <p className="text-muted max-w-lg">
            Eso que ves es un modelo real, entrenado con 30 años de lluvias de
            Bogotá. Seed42 te enseña a construir cosas así: tocando, rompiendo
            y entendiendo — con datos de Colombia.
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
              Ver el plan completo
            </Link>
          </div>
        </div>
        <RainPredictor />
      </section>

      {/* Beyond the hype: three concrete, close-to-home uses */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Más allá del hype</p>
          <h2 className="text-h1 max-w-2xl">
            La IA ya trabaja en Colombia, y no se parece a los robots de las
            películas
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[11px]">
          {realUses.map((u) => (
            <div
              key={u.caption}
              className="rounded-[var(--radius-card)] bg-panel border-hairline border overflow-hidden flex flex-col"
            >
              <Image
                src={u.src}
                alt={u.alt}
                placeholder="blur"
                sizes="(max-width: 640px) 100vw, 340px"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-h2">{u.caption}</h3>
                  <span className="text-label text-muted font-mono shrink-0">
                    {u.credit}
                  </span>
                </div>
                <p className="text-secondary text-muted">{u.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The ten-module plan */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">El plan</p>
            <h2 className="text-h1">Diez módulos, diez proyectos</h2>
          </div>
          <p className="text-label text-muted font-mono shrink-0">
            {modules.filter((m) => m.available).length} / {modules.length}{" "}
            disponibles
          </p>
        </div>
        <ol className="flex flex-col rounded-[var(--radius-panel)] bg-panel border-hairline border px-5">
          {modules.map((m) => (
            <li
              key={m.slug}
              className="flex items-baseline gap-4 py-3.5 border-b border-hairline last:border-b-0"
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
              <span className="hidden sm:block text-label text-muted font-mono ml-auto shrink-0">
                {m.available ? `${m.minutes} min` : "próximamente"}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
