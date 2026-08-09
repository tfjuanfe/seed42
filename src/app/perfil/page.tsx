import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Perfil" };

// Placeholder: the student dashboard arrives in Phase 5.
export default function PerfilPage() {
  return (
    <section className="py-16 flex flex-col items-start gap-4">
      <h1 className="text-h1">Tu progreso</h1>
      <p className="text-muted max-w-xl">
        Todavía no has empezado ningún módulo. El primero te espera.
      </p>
      <Link
        href="/modulos"
        className="text-accent hover:text-accent-hover transition-colors"
      >
        Empezar el primer módulo
      </Link>
    </section>
  );
}
