import type { Metadata } from "next";
import Image from "next/image";
import { CreateAccountForm } from "@/components/create-account-form";
import { LogoMark } from "@/components/logo-mark";
import fotoBogota from "@/../public/images/bogota.jpg";

export const metadata: Metadata = { title: "Bienvenido" };

const promises = [
  {
    n: "01",
    title: "Tocas antes de leer",
    text: "Cada módulo abre con un modelo real que puedes operar: predice la lluvia de Bogotá, entrena un moderador, doma una red neuronal",
  },
  {
    n: "02",
    title: "Rompes lo que construyes",
    text: "Todos los modelos fallan. Aquí los llevas tú al punto ciego a propósito — ahí es donde de verdad se aprende",
  },
  {
    n: "03",
    title: "Entregas proyectos",
    text: "Nueve módulos, nueve artefactos: auditorías, datasets limpios, redes entrenadas. Un portafolio, no un certificado",
  },
];

// The front door: what Seed42 is, and the account that unlocks it.
export default function LoginPage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-20 py-12 sm:py-16">
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow flex items-center gap-2">
            <LogoMark className="w-4 h-4" /> Seed42 · gratis · en español
          </p>
          <h1 className="text-display max-w-xl">
            Aprende inteligencia artificial haciendo — con datos de Colombia
          </h1>
          <p className="text-muted max-w-lg">
            Diez módulos de media hora, directamente en tu navegador y sin
            instalar nada. Construyes modelos de verdad, los rompes a
            propósito y sales con proyectos tuyos. Hecho por{" "}
            <span className="text-text">Juan Fernando Navas</span>, estudiante
            de 11° y medallista de la Olimpiada Internacional de IA.
          </p>
          <CreateAccountForm />
        </div>
        <div className="relative rounded-[var(--radius-panel)] overflow-hidden border-hairline border">
          <Image
            src={fotoBogota}
            alt="Bogotá vista desde el cerro de Monserrate"
            priority
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 480px"
            className="w-full h-64 lg:h-[420px] object-cover"
          />
          <p className="absolute bottom-2 right-3 text-label font-mono text-[#EDEDF2] opacity-80">
            Bogotá · S. Schmitz · CC BY-SA
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="eyebrow shrink-0">Lo que te espera adentro</p>
          <div className="flex-1 border-t border-hairline" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          {promises.map((p) => (
            <div
              key={p.n}
              className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_16rem_1fr] gap-x-4 gap-y-1 py-5 border-b border-hairline last:border-b-0 items-baseline"
            >
              <span className="text-metric text-accent font-mono">{p.n}</span>
              <h2 className="text-h2">{p.title}</h2>
              <p className="text-secondary text-muted col-start-2 sm:col-start-3 col-span-1">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
