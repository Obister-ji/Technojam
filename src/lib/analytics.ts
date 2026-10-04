/**
 * Privacy-first analytics. Events go to Plausible (cookieless, no personal
 * data) only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set; otherwise no-op.
 * Track product questions, not people.
 */
export type TrackedEvent =
  | "recruitment_view"
  | "recruitment_tasks_click"
  | "recruitment_apply_click"
  | "event_registration_click"
  | "project_repo_click"
  | "collaborate_submit"
  | "command_palette_open"
  | "console_open";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: TrackedEvent, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the page */
  }
}
