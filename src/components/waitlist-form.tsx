"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "done" | "already" | "error";

const KEY = "seed42:waitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) setStatus("already");
    } catch {}
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      try {
        localStorage.setItem(KEY, email);
      } catch {}
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" || status === "already") {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-1 max-w-md">
        <p className="text-h2 text-success">Estás en la lista</p>
        <p className="text-secondary text-muted">
          Te escribimos el 20 de agosto, el día del lanzamiento. Mientras
          tanto, el módulo 01 ya está abierto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
      <label className="sr-only" htmlFor="waitlist-email">
        Tu correo
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tucorreo@gmail.com"
        className="flex-1 h-11 px-4 rounded-[var(--radius-control)] bg-panel border-hairline border text-[17px]"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Unirme a la lista"}
      </button>
      {status === "error" && (
        <p className="text-secondary text-fail sm:self-center">
          No se pudo guardar tu correo. Revisa que esté bien escrito e intenta
          de nuevo
        </p>
      )}
    </form>
  );
}
