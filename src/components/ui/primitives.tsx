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

export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cx("label-mono flex items-center gap-3 text-fg-muted", className)}>
      {index ? <span className="text-pulse">{index}</span> : null}
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  size = "headline",
  className,
  children,
}: {
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
          data-reveal="lines"
          className={cx(
            "mt-5 font-extrabold tracking-[-0.03em] uppercase",
            size === "display" ? "text-display font-wide" : "text-headline font-wide",
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
    "group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-[0.95rem] font-semibold transition-colors duration-300",
    variant === "primary" && "bg-fg text-bg hover:bg-pulse hover:text-bg",
    variant === "secondary" && "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
    variant === "ghost" && "px-0 text-fg underline decoration-line-strong underline-offset-8 hover:decoration-pulse",
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
    <span className={cx("label-mono inline-flex items-center gap-2", TONE[tone])}>
      <span aria-hidden className={cx("size-1.5 rounded-full bg-current", live && "pulse-dot")} />
      {children}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="label-mono inline-flex items-center border border-line px-2 py-1 text-fg-muted">{children}</span>;
}

/** Honest empty state — used whenever verified content doesn't exist yet. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="relative border border-dashed border-line-strong p-6 md:p-10">
      <p className="label-mono text-fg-subtle">{"// nothing here yet"}</p>
      <p className="mt-3 max-w-xl text-xl font-semibold">{title}</p>
      {children ? <div className="mt-3 max-w-xl text-fg-muted">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx("group inline-flex items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-pulse", className)}
    >
      {children}
      <ArrowUpRight className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
