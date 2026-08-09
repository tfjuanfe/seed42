import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entrar" };

// Placeholder: Google sign-in (Supabase Auth or Clerk) is wired up later.
// No email/password will ever exist here.
export default function LoginPage() {
  return (
    <section className="py-16 flex flex-col items-start gap-4">
      <h1 className="text-h1">Entrar</h1>
      <p className="text-muted max-w-xl">
        Vas a poder entrar con tu cuenta de Google. Estamos conectando esta
        parte: vuelve pronto.
      </p>
    </section>
  );
}
