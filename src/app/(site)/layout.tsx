import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity/visual-editing";
import { ChromeProvider } from "@/components/command/ChromeProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AchievementsProvider } from "@/components/vibe/Achievements";
import { PageTransition } from "@/components/vibe/PageTransition";
import { ScrollProgress } from "@/components/vibe/ScrollProgress";
import { getCurrentRecruitment, getMilestones, getSiteSettings } from "@/lib/content";
import { organizationJsonLd, JsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { default: `${s.name} — ${s.tagline}`, template: `%s · ${s.name}` },
    description: s.description,
    applicationName: s.name,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: s.name, locale: "en_IN" },
    twitter: { card: "summary_large_image", site: "@technojam_gu" },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, recruitment, milestones, draft] = await Promise.all([
    getSiteSettings(),
    getCurrentRecruitment(),
    getMilestones(),
    draftMode(),
  ]);
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <AchievementsProvider>
      <ScrollProgress />
      <PageTransition />
      <ChromeProvider
        consoleData={{
          tagline: settings.tagline,
          foundedYear: settings.foundedYear,
          githubOrg: settings.githubOrg,
          email: settings.email,
          recruitment: recruitment ? { title: recruitment.title, status: recruitment.status } : undefined,
          milestones: milestones.map(({ year, title }) => ({ year, title })),
        }}
      >
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 bg-cyan px-4 py-3 label-mono text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <div>
          <Navbar recruitmentOpen={recruitment?.status === "open"} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer settings={settings} />
        </div>
        <JsonLd data={organizationJsonLd(settings)} />
        {draft.isEnabled ? <VisualEditing /> : null}
        {plausible ? <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" /> : null}
      </ChromeProvider>
    </AchievementsProvider>
  );
}
