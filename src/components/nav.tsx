"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

// NOTE: the /competencia link is intentionally absent for now —
// competition and leaderboard work is on hold per project direction.
const links = [
  { href: "/modulos", label: "Módulos" },
  { href: "/talleres", label: "Talleres" },
  { href: "/perfil", label: "Perfil" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-hairline">
      <nav
        className="max-w-5xl mx-auto flex items-center gap-1 px-4 sm:px-6 h-14"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="font-medium tracking-tight text-text mr-auto rounded-[var(--radius-control)] px-2 py-1"
        >
          Seed42
        </Link>

        {links.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`text-secondary rounded-[var(--radius-control)] px-3 py-2 transition-colors ${
                active ? "text-text bg-sub" : "text-muted hover:text-text"
              }`}
            >
              {label}
            </Link>
          );
        })}

        <Link
          href="/login"
          className="text-secondary text-accent hover:text-accent-hover rounded-[var(--radius-control)] px-3 py-2 transition-colors"
        >
          Entrar
        </Link>

        <ThemeToggle />
      </nav>
    </header>
  );
}
