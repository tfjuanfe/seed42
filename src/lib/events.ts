// Fire-and-forget analytics. Instrumented from day one per the brief:
// module_started, screen_advanced, module_completed, project_submitted.

export type EventName =
  | "module_started"
  | "screen_advanced"
  | "module_completed"
  | "project_submitted";

export function logEvent(name: EventName, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ name, payload });
  try {
    // sendBeacon survives page navigation; fetch keepalive is the fallback.
    if (!navigator.sendBeacon?.("/api/events", body)) {
      void fetch("/api/events", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    }
  } catch {
    // Analytics must never break the student experience.
  }
}
