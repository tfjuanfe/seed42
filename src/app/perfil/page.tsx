import type { Metadata } from "next";
import { ProfileSummary } from "@/components/profile-summary";

export const metadata: Metadata = { title: "Perfil" };

export default function PerfilPage() {
  return (
    <section className="py-10 sm:py-14 flex flex-col gap-8">
      <h1 className="text-h1">Tu progreso</h1>
      <ProfileSummary />
    </section>
  );
}
