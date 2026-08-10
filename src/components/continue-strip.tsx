"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { modules } from "@content/modules/registry";
import { getProgress } from "@/lib/progress";
import { getAccount } from "@/lib/account";

// One line that knows where the student is: resume an in-progress
// module, or point at the next unstarted one.
export function ContinueStrip() {
  const [target, setTarget] = useState<{
    slug: string;
    title: string;
    number: number;
    resuming: boolean;
  } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const progress = getProgress();
    setName(getAccount()?.name?.split(" ")[0] ?? "");
    const available = modules.filter((m) => m.available);
    const inProgress = available.find(
      (m) => progress[m.slug] && !progress[m.slug].completedAt,
    );
    const nextUp = available.find((m) => !progress[m.slug]);
    const pick = inProgress ?? nextUp;
    if (pick) {
      setTarget({
        slug: pick.slug,
        title: pick.title,
        number: pick.number,
        resuming: Boolean(inProgress),
      });
    }
  }, []);

  if (!target) return null;

  return (
    <Link
      href={`/modulos/${target.slug}`}
      className="group flex items-baseline gap-3 border-t border-b border-hairline py-4 hover:bg-sub/50 transition-colors px-1"
    >
      <span className="text-label text-muted font-mono shrink-0">
        {String(target.number).padStart(2, "0")}
      </span>
      <span className="text-secondary text-muted">
        {target.resuming
          ? `Sigue donde ibas${name ? `, ${name}` : ""}:`
          : `Tu siguiente módulo${name ? `, ${name}` : ""}:`}
      </span>
      <span className="text-accent group-hover:text-accent-hover transition-colors font-medium">
        {target.title} →
      </span>
    </Link>
  );
}
