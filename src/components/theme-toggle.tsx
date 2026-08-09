"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function ThemeToggle() {
  // null until mounted so the server render carries no theme assumption.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function toggle() {
    const next: Theme = getTheme() === "light" ? "dark" : "light";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      className="ml-1 w-11 h-11 inline-flex items-center justify-center rounded-[var(--radius-control)] text-muted hover:text-text transition-colors"
    >
      {/* Simple sun/moon glyph; rendered after mount to avoid hydration mismatch */}
      <span aria-hidden="true" className="text-[15px] leading-none">
        {theme === null ? "◐" : theme === "light" ? "☾" : "☀"}
      </span>
    </button>
  );
}
