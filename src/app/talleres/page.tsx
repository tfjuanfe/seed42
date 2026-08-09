import type { Metadata } from "next";

export const metadata: Metadata = { title: "Talleres" };

// Placeholder: workshops page for schools and teachers arrives in Phase 5.
export default function TalleresPage() {
  return (
    <section className="py-16 flex flex-col gap-4">
      <h1 className="text-h1">Talleres</h1>
      <p className="text-muted max-w-xl">
        Talleres presenciales para colegios y docentes. Escríbenos si quieres
        llevar Seed42 a tu colegio.
      </p>
    </section>
  );
}
