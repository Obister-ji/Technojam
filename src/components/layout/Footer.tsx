import { FooterStage } from "@/components/layout/FooterStage";
import type { SiteSettings } from "@/lib/content/types";
import { JOIN_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  const navigation = [...PRIMARY_NAV, JOIN_NAV, ...SECONDARY_NAV].map(({ href, label }) => ({ href, label }));
  const socials = settings.socials.filter((s) => s.platform !== "email").map((s) => ({ href: s.url, label: s.label }));
  return (
    <footer className="relative">
      <FooterStage navigation={navigation} socials={socials} location={settings.location} email={settings.email} />
    </footer>
  );
}
