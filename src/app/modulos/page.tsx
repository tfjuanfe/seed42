import type { Metadata } from "next";

export const metadata: Metadata = { title: "Módulos" };

// Placeholder: the module index with real progress arrives in Phase 2.
export default function ModulosPage() {
  return (
    <section className="py-16 flex flex-col gap-4">
      <h1 className="text-h1">Módulos</h1>
      <p className="text-muted max-w-xl">
        Aquí van a vivir los diez módulos interactivos. El primero se podrá
        jugar sin cuenta.
      </p>
    </section>
  );
}
