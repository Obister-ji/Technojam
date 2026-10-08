"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { INTENTS, validateInquiry, type InquiryInput } from "@/lib/collaborate";
import { track } from "@/lib/analytics";
import { ArrowRight } from "@/components/ui/Icon";
import { cx } from "@/components/ui/primitives";

const noop = () => () => {};
const readIntentFromUrl = () => {
  const q = new URLSearchParams(window.location.search).get("intent");
  return q && INTENTS.some((i) => i.value === q) ? q : null;
};

type Errors = Partial<Record<keyof InquiryInput, string>>;
type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; email?: boolean };

export function CollaborateForm({ email }: { email: string }) {
  const id = useId();
  const startedAt = useRef(0);
  const urlIntent = useSyncExternalStore(noop, readIntentFromUrl, () => null);
  const [chosen, setIntent] = useState<string | null>(null);
  const intent = chosen ?? urlIntent ?? INTENTS[0].value;
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const check = validateInquiry(payload);
    if (!check.ok) {
      setErrors(check.errors);
      const first = Object.keys(check.errors)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, startedAt: startedAt.current }),
      });
      const json = await res.json();
      if (json.ok) {
        setState({ kind: "sent" });
        track("collaborate_submit", { intent: String(payload.intent) });
      } else if (json.errors) {
        setErrors(json.errors);
        setState({ kind: "idle" });
      } else {
        setState({ kind: "error", message: json.error ?? "Something went wrong.", email: json.fallback === "email" });
      }
    } catch {
      setState({ kind: "error", message: "Network error — please try again or email us.", email: true });
    }
  }

  if (state.kind === "sent") {
    return (
      <div role="status" className="border border-line-strong p-8">
        <p className="label-mono text-pulse">Received</p>
        <p className="mt-4 font-wide text-3xl font-extrabold uppercase">Thanks — we&apos;ll be in touch.</p>
        <p className="mt-3 text-fg-muted">A TechnoJam lead will reply by email. For anything urgent, write to {email}.</p>
      </div>
    );
  }

  const field =
    "w-full border border-line bg-bg px-4 py-3 text-base text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-fg aria-[invalid=true]:border-pulse";
  const err = (k: keyof InquiryInput) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 text-sm text-pulse">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof InquiryInput) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6">
      <fieldset>
        <legend className="label-mono text-fg-muted">I&apos;d like to</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {INTENTS.map((i) => (
            <label
              key={i.value}
              className={cx(
                "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
                intent === i.value ? "border-fg bg-surface" : "border-line hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name="intent"
                value={i.value}
                checked={intent === i.value}
                onChange={() => setIntent(i.value)}
                className="mt-1 accent-[var(--color-pulse)]"
              />
              <span>
                <span className="block font-semibold">{i.label}</span>
                <span className="mt-0.5 block text-sm text-fg-muted">{i.detail}</span>
              </span>
            </label>
          ))}
        </div>
        {err("intent")}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="label-mono text-fg-muted">
            Your name
          </label>
          <input id={`${id}-name`} name="name" autoComplete="name" className={cx(field, "mt-2")} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label-mono text-fg-muted">
            Work email
          </label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={cx(field, "mt-2")} {...a11y("email")} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-org`} className="label-mono text-fg-muted">
          Organisation / community
        </label>
        <input id={`${id}-org`} name="organization" autoComplete="organization" className={cx(field, "mt-2")} {...a11y("organization")} />
        {err("organization")}
      </div>
      <div>
        <label htmlFor={`${id}-msg`} className="label-mono text-fg-muted">
          What do you have in mind?
        </label>
        <textarea id={`${id}-msg`} name="message" rows={6} className={cx(field, "mt-2 resize-y")} {...a11y("message")} />
        {err("message")}
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.kind === "error" ? (
        <div role="alert" className="border border-pulse/60 p-4 text-sm">
          {state.message}{" "}
          {state.email ? (
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" disabled={state.kind === "sending"} className="btn-pixel group disabled:opacity-60">
          {state.kind === "sending" ? "Sending…" : "Send inquiry"}
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-sm text-fg-subtle">
          Prefer email?{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
        </p>
      </div>
    </form>
  );
}
