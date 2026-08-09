// Project artifacts, stored locally until auth + the submissions table
// are wired. Shape mirrors submissions.artifact (jsonb).

export interface StoredArtifact {
  moduleSlug: string;
  artifact: unknown;
  createdAt: string;
}

const KEY = "seed42:artifacts:v1";

export function getArtifacts(): StoredArtifact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredArtifact[]) : [];
  } catch {
    return [];
  }
}

export function saveArtifact(moduleSlug: string, artifact: unknown): void {
  const all = getArtifacts().filter((a) => a.moduleSlug !== moduleSlug);
  all.push({ moduleSlug, artifact, createdAt: new Date().toISOString() });
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}
