import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import type { RichText as RichTextValue } from "@/lib/content/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3 className="mt-10 text-2xl font-bold tracking-tight text-fg">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-pulse pl-5 text-fg">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" && /^(https?:|mailto:)/.test(value.href) ? value.href : undefined;
      return href ? (
        <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:decoration-pulse">
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
  types: {
    accessibleImage: ({ value }: { value: { url?: string; alt?: string; caption?: string } }) =>
      value?.url ? (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN handles sizing via query params */}
          <img src={`${value.url}?w=1600&auto=format`} alt={value.alt ?? ""} loading="lazy" className="w-full" />
          {value.caption ? <figcaption className="label-mono mt-2 text-fg-subtle">{value.caption}</figcaption> : null}
        </figure>
      ) : null,
  },
};

/** Renders Sanity Portable Text, or plain paragraphs from the local seed. */
export function RichText({ value, className = "" }: { value?: RichTextValue; className?: string }) {
  if (!value?.length) return null;
  const isPlain = value.every((v) => typeof v === "string");
  return (
    <div className={`grid gap-5 text-lg leading-relaxed text-fg-muted ${className}`}>
      {isPlain ? (value as string[]).map((p, i) => <p key={i}>{p}</p>) : <PortableText value={value as PortableTextBlock[]} components={components} />}
    </div>
  );
}
