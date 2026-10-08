import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "./Icon";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Splits a headline on "\n" into masked lines for the reveal animation. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="line" style={{ ["--line-index" as string]: i }}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}

/** Quiet section label. The index prop is accepted for compatibility but no longer shown. */
export function Eyebrow({ children, className }: { index?: string; children: ReactNode; className?: string }) {
  return <p className={cx("label-mono text-fg-subtle", className)}>{children}</p>;
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  size = "headline",
  className,
  children,
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  size?: "display" | "headline";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cx("grid gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <Tag
          id={id}
          data-reveal="lines"
          className={cx(
            "mt-4 font-extrabold tracking-[-0.03em] uppercase",
            size === "display" ? "font-wide text-display" : "font-wide text-headline",
          )}
        >
          <Lines text={title} />
        </Tag>
      </div>
      {intro || children ? (
        <div data-reveal className="max-w-md text-lg leading-relaxed text-fg-muted md:col-span-4 md:justify-self-end">
          {intro}
          {children}
        </div>
      ) : null}
    </header>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
} & Omit<ComponentProps<"a">, "href">;

export function ButtonLink({ href, children, variant = "primary", external, className, ...rest }: ButtonProps) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  const classes = cx(
    "group",
    variant === "primary" && "btn-pixel",
    variant === "secondary" && "btn-ghost",
    variant === "ghost" &&
      "inline-flex min-h-12 items-center gap-3 font-semibold text-fg underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-pulse",
    className,
  );
  const icon = isExternal ? (
    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  ) : (
    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
  );
  if (isExternal) {
    return (
      <a href={href} className={classes} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" {...rest}>
        {children}
        {icon}
        {href.startsWith("mailto:") ? null : <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {icon}
    </Link>
  );
}

const TONE = {
  pulse: "text-pulse",
  volt: "text-volt",
  violet: "text-violet",
  muted: "text-fg-muted",
} as const;

export function Status({ tone = "muted", live, children }: { tone?: keyof typeof TONE; live?: boolean; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-2 label-mono", TONE[tone])}>
      <span aria-hidden className={cx("size-1.5 rounded-full bg-current", live && "pulse-dot")} />
      {children}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center border border-line px-2 py-1 label-mono text-fg-muted">{children}</span>;
}

/** Honest empty state — a plain sentence, not a box. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="max-w-xl">
      <p className="text-lg font-medium">{title}</p>
      {children ? <div className="mt-2 text-fg-muted">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx(
        "group inline-flex items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-pulse",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
