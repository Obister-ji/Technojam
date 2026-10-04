import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="container-site flex min-h-dvh flex-col justify-center gap-4">
        <p className="label-mono text-pulse">Studio not connected</p>
        <h1 className="text-headline font-black uppercase font-wide">Connect Sanity to edit content.</h1>
        <p className="max-w-xl text-fg-muted">
          Set <code className="font-mono text-fg">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="font-mono text-fg">NEXT_PUBLIC_SANITY_DATASET</code> (see README → CMS setup), then restart. Until then the site
          renders from the verified seed content in <code className="font-mono text-fg">src/content/seed</code>.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
