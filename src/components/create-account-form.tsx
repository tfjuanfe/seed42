"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount } from "@/lib/account";

export function CreateAccountForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const valid =
    name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        createAccount(name, email);
        router.replace("/");
      }}
      className="flex flex-col gap-3 w-full max-w-sm"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-label text-muted">Tu nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Como quieres que te llamemos"
          className="h-11 px-4 rounded-[var(--radius-control)] bg-panel border-hairline border text-[17px]"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label text-muted">Tu correo</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="tucorreo@gmail.com"
          className="h-11 px-4 rounded-[var(--radius-control)] bg-panel border-hairline border text-[17px]"
        />
      </label>
      <button
        type="submit"
        disabled={!valid}
        className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Crear mi cuenta y empezar
      </button>
      <p className="text-label text-muted">
        Tu cuenta vive en este navegador por ahora; la entrada con Google
        llega muy pronto. Nada de contraseñas
      </p>
    </form>
  );
}
