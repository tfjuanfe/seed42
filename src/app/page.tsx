import Link from "next/link";

// Placeholder landing. The real hero (with a live interactive) is Phase 5.
export default function HomePage() {
  return (
    <section className="py-16 sm:py-24 flex flex-col items-start gap-6">
      <h1 className="text-display max-w-2xl">
        Aprende inteligencia artificial haciendo
      </h1>
      <p className="text-muted max-w-xl">
        Ejercicios interactivos en tu navegador, en español y gratis. Sin
        instalar nada: tocas, experimentas y entiendes.
      </p>
      <Link
        href="/modulos"
        className="inline-flex items-center h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
      >
        Explorar los módulos
      </Link>
    </section>
  );
}
