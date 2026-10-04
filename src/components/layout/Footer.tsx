import Link from "next/link";
import { ConsoleButton } from "@/components/command/ConsoleButton";
import { SOCIAL_ICON } from "@/components/ui/Icon";
import type { SiteSettings } from "@/lib/content/types";
import { JOIN_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  const navigation = [...PRIMARY_NAV, JOIN_NAV, ...SECONDARY_NAV];
  return (
    <footer className="cv-auto relative mt-32 overflow-hidden border-t border-line bg-bg-sunken">
      <div className="container-site pt-20 pb-10">
        <p className="label-mono text-fg-subtle">{"// end of transmission"}</p>
        <p
          data-reveal="lines"
          className="font-wide mt-6 text-display-xl leading-[0.84] font-black tracking-[-0.04em] uppercase"
        >
          <span className="sr-only">{settings.tagline}.</span>
          <span className="line" aria-hidden style={{ ["--line-index" as string]: 0 }}>
            <span>Throttle</span>
          </span>
          <span className="line" aria-hidden style={{ ["--line-index" as string]: 1 }}>
            <span>
              to learn<span className="text-pulse">.</span>
            </span>
          </span>
        </p>
        <p className="mt-8 max-w-md text-lg text-fg-muted">Built by students who probably broke production at least once.</p>

        <div className="mt-20 grid gap-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-wide text-lg font-extrabold uppercase">{settings.name}</p>
            <address className="mt-3 not-italic leading-relaxed text-fg-muted">
              {settings.school}
              <br />
              {settings.institution}
              <br />
              {settings.location}
            </address>
            <a href={`mailto:${settings.email}`} className="mt-4 inline-block break-all underline decoration-line-strong underline-offset-4 hover:decoration-pulse">
              {settings.email}
            </a>
          </div>

          <nav aria-label="Footer" className="lg:col-span-4">
            <p className="label-mono text-fg-subtle">Navigate</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="label-mono text-fg-subtle">Connect</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {settings.socials
                .filter((s) => s.platform !== "email")
                .map((s) => {
                  const Icon = SOCIAL_ICON[s.platform];
                  return (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-fg-muted transition-colors hover:text-fg">
                        <Icon className="size-4" />
                        {s.label}
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-sm text-fg-muted">
            <span className="text-pulse">&gt;</span> technojam@community:~$ keep_building
            <span aria-hidden className="caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-fg-muted" />
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ConsoleButton />
            <p className="label-mono text-fg-subtle">
              Est. {settings.foundedYear} · © {new Date().getFullYear()} {settings.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
