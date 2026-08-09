"use client";

import { useState } from "react";
import { saveArtifact } from "@/lib/artifacts";

interface Props {
  moduleSlug: string;
  question: string;
}

// Reflection screen: one question, answered in the student's own words.
export function ReflectionPrompt({ moduleSlug, question }: Props) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5">
        <p className="text-h2 text-success">Reflexión guardada</p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <p className="text-h2">{question}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full rounded-[var(--radius-control)] bg-sub border-hairline border p-3 text-[17px] resize-y"
        placeholder="Con tus palabras"
      />
      <button
        type="button"
        disabled={text.trim().length === 0}
        onClick={() => {
          saveArtifact(`${moduleSlug}:reflexion`, { type: "reflection", text });
          setSaved(true);
        }}
        className="self-end h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Guardar reflexión
      </button>
    </div>
  );
}
