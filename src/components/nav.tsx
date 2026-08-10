"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/logo-mark";
import { ACCOUNT_EVENT, getAccount } from "@/lib/account";

// NOTE: the /competencia link is intentionally absent for now —
// competition and leaderboard work is on hold per project direction.
const links = [
  { href: "/modulos", label: "Módulos" },
  { href: "/talleres", label: "Talleres" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [name, setName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function read() {
      setName(getAccount()?.name ?? null);
      setLoaded(true);
    }
    read();
    window.addEventListener(ACCOUNT_EVENT, read);
    return () => window.removeEventListener(ACCOUNT_EVENT, read);
  }, []);

  const loggedIn = loaded && name !== null;

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-hairline">
      <nav
        className="max-w-5xl mx-auto flex items-center gap-1 px-4 sm:px-6 h-14"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-medium tracking-tight text-text mr-auto rounded-[var(--radius-control)] px-2 py-1"
        >
          <LogoMark className="w-[18px] h-[18px]" />
          Seed42
        </Link>

        {loggedIn && (
          <>
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
              href="/perfil"
              aria-current={pathname.startsWith("/perfil") ? "page" : undefined}
              className="text-secondary text-accent hover:text-accent-hover rounded-[var(--radius-control)] px-3 py-2 transition-colors max-w-32 truncate"
            >
              {name}
            </Link>
          </>
        )}

        <ThemeToggle />
      </nav>
    </header>
  );
}
