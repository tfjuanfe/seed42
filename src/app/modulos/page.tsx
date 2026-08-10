import type { Metadata } from "next";
import { modules } from "@content/modules/registry";
import { ModuleCard } from "@/components/module-card";

export const metadata: Metadata = { title: "Módulos" };

export default function ModulosPage() {
  return (
    <section className="py-10 sm:py-14 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">Módulos</h1>
        <p className="text-muted max-w-xl">
          Diez módulos de ~30 minutos. Empieza por el primero: no necesitas
          cuenta ni saber programar.
        </p>
      </header>
      <div className="flex flex-col border-t border-hairline">
        {modules.map((m) => (
          <ModuleCard key={m.slug} meta={m} />
        ))}
      </div>
    </section>
  );
}
