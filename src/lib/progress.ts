// Client-side progress store. Anonymous students (module 01 needs no
// account) keep progress in localStorage; once auth exists this becomes
// the local cache in front of the progress table.

export interface ModuleProgress {
  screenIndex: number;
  completedAt?: string;
}

export type ProgressMap = Record<string, ModuleProgress>;

const KEY = "seed42:progress:v1";

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getModuleProgress(slug: string): ModuleProgress | undefined {
  return getProgress()[slug];
}

export function setModuleProgress(
  slug: string,
  patch: Partial<ModuleProgress>,
): void {
  const all = getProgress();
  const current = all[slug] ?? { screenIndex: 0 };
  all[slug] = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage full or blocked: progress just doesn't persist this session.
  }
}
