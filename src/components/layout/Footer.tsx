import Link from "next/link";
import type { SiteSettings } from "@/lib/content/types";
import { JOIN_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  const navigation = [...PRIMARY_NAV, JOIN_NAV, ...SECONDARY_NAV];
  const socials = settings.socials.filter((s) => s.platform !== "email");
  return (
    <footer className="relative border-t-2 border-cyan/40 bg-bg-raised cv-auto">
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="font-pixel text-headline uppercase">
              Throttle to <span className="text-cyan">learn</span>
              <span className="text-pulse">.</span>
            </p>
            <p className="mt-4 text-fg-muted">Built by students who probably broke production at least once.</p>
            <p className="mt-8 text-sm leading-relaxed text-fg-muted">
              {settings.location}
              <br />
              <a href={`mailto:${settings.email}`} className="break-all text-fg hover:text-cyan">
                {settings.email}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <nav aria-label="Footer">
              <ul className="grid gap-2.5">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="grid content-start gap-2.5" aria-label="Social links">
              {socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-fg-muted transition-colors hover:text-fg">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
