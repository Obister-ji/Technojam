import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[80svh] flex-col justify-center pt-(--nav-h)">
      <p className="font-mono text-sm text-fg-muted">
        <span className="text-pulse">guest@technojam:~$</span> cd {"<this page>"}
        <br />
        bash: cd: no such file or directory
      </p>
      <h1 className="font-wide mt-8 text-display-xl font-black tracking-[-0.045em] uppercase">
        404<span className="text-pulse">.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg text-fg-muted">
        This page doesn&apos;t exist — or it did, and someone broke production. Either way, here&apos;s a way back.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          Projects
        </ButtonLink>
        <ButtonLink href="/events" variant="secondary">
          Events
        </ButtonLink>
      </div>
    </section>
  );
}
