import Link from "next/link";
import Image from "next/image";
import { modules } from "@content/modules/registry";
import { RainPredictor } from "@/components/interactives/rain-predictor";
import { Reveal } from "@/components/reveal";
import { WaitlistForm } from "@/components/waitlist-form";
import { ContinueStrip } from "@/components/continue-strip";
import fotoSalud from "@/../public/images/salud.jpg";
import fotoCafe from "@/../public/images/cafe.jpg";
import fotoMetrocable from "@/../public/images/metrocable.jpg";

const realUses = [
  {
    src: fotoSalud,
    alt: "Sala de resonancia magnética con un paciente entrando al escáner",
    caption: "Salud",
    credit: "Ptrump16 · CC BY-SA",
    text: "Modelos que leen resonancias y radiografías detectan tumores que un ojo cansado puede pasar por alto. En el módulo 06 aprendes a juzgar cuándo confiar en uno.",
  },
  {
    src: fotoCafe,
    alt: "Paisaje cultural cafetero en Quindío, con palmas y cultivos",
    caption: "Campo",
    credit: "Rope.96 · CC BY-SA",
    text: "Cámaras con IA revisan hojas de café y detectan la roya semanas antes de que el caficultor pueda verla. Visión artificial: la misma matemática de tu red del módulo 08.",
  },
  {
    src: fotoMetrocable,
    alt: "Cabina del Metrocable sobre los barrios de Medellín",
    caption: "Ciudad",
    credit: "B. Gagnon · CC BY-SA",
    text: "Los sistemas de transporte usan predicción de demanda para decidir frecuencias — Medellín lo hace hoy. Tú operas esa curva en el módulo 02.",
  },
];

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow shrink-0">{label}</p>
      <div className="flex-1 border-t border-hairline" aria-hidden="true" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
      <ContinueStrip />

      {/* The hero is the product: a live model, not a screenshot of one */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">Tu laboratorio de IA</p>
          <h1 className="text-display max-w-xl">
            Modelos de verdad, rotos y reconstruidos por ti
          </h1>
          <p className="text-muted max-w-lg">
            El de al lado fue tu primero: 30 años de lluvias de Bogotá en una
            curva. Nueve módulos te esperan — cada uno con un modelo nuevo
            para operar, un punto ciego para encontrar y un proyecto para
            entregar.
          </p>
          <Link
            href="/modulos"
            className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
          >
            Ir a los módulos
          </Link>
        </div>
        <RainPredictor />
      </section>

      {/* Beyond the hype — editorial rows, not cards */}
      <Reveal>
        <section className="flex flex-col gap-8">
          <SectionRule label="Más allá del hype" />
          <h2 className="text-h1 max-w-2xl -mt-2">
            La IA ya trabaja en Colombia, y no se parece a los robots de las
            películas
          </h2>
          <div className="flex flex-col gap-10">
            {realUses.map((u, i) => (
              <div
                key={u.caption}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-6 items-center ${
                  i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative rounded-[var(--radius-card)] overflow-hidden border-hairline border">
                  <Image
                    src={u.src}
                    alt={u.alt}
                    placeholder="blur"
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="w-full h-52 object-cover"
                  />
                  <p className="absolute bottom-2 right-3 text-label font-mono text-[#EDEDF2] opacity-80">
                    {u.credit}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h2">{u.caption}</h3>
                  <p className="text-secondary text-muted max-w-md">{u.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* The ten-module plan — plain rows */}
      <Reveal>
        <section className="flex flex-col gap-6">
          <SectionRule label="El plan" />
          <div className="flex items-baseline justify-between gap-3 -mt-2">
            <h2 className="text-h1">Diez módulos, diez proyectos</h2>
            <p className="text-label text-muted font-mono shrink-0">
              {modules.filter((m) => m.available).length} / {modules.length}{" "}
              disponibles
            </p>
          </div>
          <ol className="flex flex-col">
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
      </Reveal>

      {/* Who is behind Seed42 — editorial, no cards, no chips */}
      <Reveal>
        <section className="flex flex-col gap-6">
          <SectionRule label="Quién está detrás" />
          <div className="border-l-2 border-l-[var(--accent)] pl-5 sm:pl-8 flex flex-col gap-3 max-w-2xl">
            <h2 className="text-h1">Hecho por un estudiante, para estudiantes</h2>
            <p className="text-muted">
              Seed42 lo construyó <span className="text-text font-medium">Juan
              Fernando Navas</span>, estudiante de grado 11 y medallista de la
              Olimpiada Internacional de Inteligencia Artificial (IOAI). La
              idea nació de una convicción: en Colombia hay talento de sobra
              para la IA — lo que falta es una puerta de entrada en español,
              gratuita y que no exija saber programar.
            </p>
            <p className="text-muted">
              Esa puerta es esta. Si funciona para ti, cuéntaselo a alguien
              más de tu colegio.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Waitlist */}
      <Reveal>
        <section className="flex flex-col items-start gap-4">
          <SectionRule label="Lanzamiento · 20 de agosto" />
          <h2 className="text-h1 max-w-2xl">
            Sé de los primeros cuando el curso esté completo
          </h2>
          <p className="text-muted max-w-xl">
            Nueve de diez módulos ya están abiertos. Déjanos tu correo y te
            avisamos el día que el gran final esté en línea.
          </p>
          <WaitlistForm />
        </section>
      </Reveal>
    </div>
  );
}
