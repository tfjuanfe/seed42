import { LogoMark } from "@/components/logo-mark";

export function Footer() {
  return (
    <footer className="border-t border-hairline mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 mr-auto">
          <LogoMark className="w-4 h-4" />
          <span className="text-secondary text-muted">
            Seed42 — aprende IA haciendo, desde Colombia
          </span>
        </div>
        <p className="text-label text-muted font-mono">
          Fotos: Wikimedia Commons (CC)
        </p>
      </div>
    </footer>
  );
}
