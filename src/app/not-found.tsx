import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";

/** Fallback for URLs outside the site layout. */
export default function GlobalNotFound() {
  return (
    <main className="container-site flex min-h-dvh flex-col justify-center gap-8">
      <Link href="/" aria-label="TechnoJam — home">
        <Wordmark />
      </Link>
      <h1 className="text-display-xl font-black tracking-[-0.045em] uppercase font-wide">
        404<span className="text-pulse">.</span>
      </h1>
      <p className="max-w-lg text-lg text-fg-muted">This page doesn&apos;t exist — or someone broke production.</p>
      <Link href="/" className="btn-pixel w-fit">
        Back to home →
      </Link>
    </main>
  );
}
