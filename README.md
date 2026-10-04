# TechnoJam — technojam.in

The canonical home of **TechnoJam**, the student-led technical community of the School of Computing Science & Engineering at Galgotias University. *Throttle to Learn.*

Social media announces things, GitHub hosts code, Commudle hosts events, Dexterix has its own microsites. This site tells the whole story in one place: projects, events, Dexterix, recruitment, people and history. It also lets a non-developer lead keep it current without touching code.

> **Facts policy.** Every number, date and name on the site comes from a cited source and carries a `verification` record. Figures marked *pending* stay in the CMS but never render publicly. Pre-event targets are stored separately from post-event outcomes and are always labelled. See [`docs/01-research-and-architecture.md`](docs/01-research-and-architecture.md).

---

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [CMS setup](#cms-setup)
- [Development workflow](#development-workflow)
- [Deployment](#deployment)
- [Content editing](#content-editing)
- [Contributing](#contributing)
- [Branch strategy](#branch-strategy)
- [Code quality](#code-quality)

---

## Architecture

```
src/
├─ app/
│  ├─ (site)/                 public site: layout (nav, footer, palette, console) + every page
│  │  ├─ page.tsx             homepage
│  │  ├─ projects/ events/ dexterix/ team/ join/ collaborate/ community/ about/ resources/
│  │  └─ **/opengraph-image.tsx  per-page social cards (Satori)
│  ├─ studio/[[...tool]]/     embedded Sanity Studio (noindex)
│  ├─ api/                    contact form · Sanity webhook revalidation · draft mode
│  ├─ search-index.json/      static search index for ⌘K + console (loaded on demand)
│  └─ sitemap.ts robots.ts manifest.ts icon.svg
├─ components/                UI by feature (home, projects, events, dexterix, join, team, command, layout, ui)
├─ content/seed/              verified fallback content + sources (used when Sanity isn't configured)
├─ lib/
│  ├─ content/                the ONLY data layer pages use — Sanity or seed, same types
│  ├─ search/ seo.tsx og.tsx github.ts analytics.ts collaborate.ts nav.ts
└─ sanity/                    schemas, GROQ queries, desk structure, presentation config
scripts/export-seed.ts        seed → Sanity NDJSON import
docs/                         research, IA, content model, design direction, editor guide
```

**Data flow.** Pages call `src/lib/content`. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, it queries Sanity with tagged ISR fetches (1 h) and serves drafts in draft mode. Otherwise it returns the seed. GROQ projections in `src/sanity/queries.ts` produce exactly the types in `src/lib/content/types.ts`, so components never know the source.

**Rendering.** Every public page is statically generated, with incremental regeneration hourly and on-demand revalidation by tag from a signed Sanity webhook. Only `/api/*` runs per request.

**Integrity rules in code.**

| Rule | Where |
|---|---|
| Pending facts never render | `isPublishable()` in `lib/content/derive.ts`, used by pages, sitemap and search |
| Actual ≠ target | `dexterixEdition.participantsActual` vs `participantsTarget`; `<DexterixFigure>` labels each one |
| People need consent | GROQ filters `person.consent == true` |
| Galleries need approval | GROQ filters `gallery.approved == true` |
| Event status is derived | `eventPhase()` computes upcoming / live / past from dates |

## Tech stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.2 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 (CSS-first tokens in `src/app/globals.css`) |
| CMS | Sanity 6, embedded Studio via `next-sanity` 13, Presentation tool for preview |
| Type | Archivo (variable, width axis) + JetBrains Mono via `next/font` |
| Motion | CSS + IntersectionObserver; one canvas for the hero. No animation library |
| Hosting | Vercel (any Node host works) |
| Analytics | Plausible (cookieless, optional) |

Runtime dependencies: `next`, `react`, `react-dom`, `sanity`, `next-sanity`, `@sanity/image-url`, `styled-components` (peer dependency of the Studio). Nothing else.

## Setup

Requirements: Node 20.9+ (tested on 23), npm 10.

```bash
npm install
cp .env.example .env.local   # optional — the site runs on seed content without it
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | prod | Canonical origin for metadata, sitemap, JSON-LD |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | for CMS | Enables Sanity. Unset → seed content |
| `NEXT_PUBLIC_SANITY_DATASET` | public | for CMS | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | public | no | Defaults to `2026-10-01` |
| `SANITY_API_READ_TOKEN` | server | for previews | Viewer token for draft mode / Presentation |
| `SANITY_API_WRITE_TOKEN` | server | for the form | Editor token; Collaborate form writes `inquiry` docs |
| `SANITY_REVALIDATE_SECRET` | server | for webhooks | Verifies `/api/revalidate` calls |
| `GITHUB_TOKEN` | server | no | Raises GitHub API limits for cached repo metadata |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | public | no | Enables cookieless analytics |

Server-only values are never imported into client components.

## CMS setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage), or run `npx sanity@latest init --env` and choose *existing project*.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
3. In **API → CORS origins**, add `http://localhost:3000` and your production URL (with credentials).
4. Import the verified starting content:
   ```bash
   npm run seed:export
   npx sanity dataset import scripts/out/seed.ndjson production --replace
   ```
5. Open `/studio`. Everything on the site is now editable there.
6. **Previews:** create a *Viewer* token and set it as `SANITY_API_READ_TOKEN`. The Presentation tool in the Studio opens the live site in draft mode.
7. **Instant updates:** in **API → Webhooks**, add `POST https://www.technojam.in/api/revalidate` (create/update/delete, projection `{_type}`, secret = `SANITY_REVALIDATE_SECRET`).
8. **Collaborate form:** create an *Editor* token and set it as `SANITY_API_WRITE_TOKEN`. Inquiries then appear under *Collaboration inquiries* in the Studio. Without it, the form tells people to email instead.

## Development workflow

```bash
npm run dev          # dev server (Turbopack)
npm run check        # route types + tsc + eslint
npm run format       # prettier (with Tailwind class sorting)
npm run build        # production build — all public routes prerender
npm run seed:export  # regenerate the Sanity import file from src/content/seed
```

- Read the bundled Next.js docs (`node_modules/next/dist/docs/`) before using an API you haven't used in v16. `AGENTS.md` explains why.
- New content type: add a schema in `src/sanity/schemaTypes`, a type in `src/lib/content/types.ts`, a GROQ projection in `src/sanity/queries.ts`, a getter in `src/lib/content/index.ts`, and a seed entry (or an empty array).
- Never hardcode facts in components. If it's a fact, it belongs in the CMS with a source.

## Deployment

**Vercel (recommended).** Import the repo, set the environment variables above, deploy. Point `technojam.in` and `www.technojam.in` at the project with `www` as primary (the canonical URLs assume it). Old paths (`/achievements`, `/gallery`, `/contact`, `/dexterix-5`) redirect permanently. See `next.config.ts`.

**Elsewhere.** `npm run build && npm start` on Node 20.9+. The contact form's rate limiter is in-memory: fine for one instance, best-effort on serverless. Swap in Upstash or Vercel KV if abuse appears.

## Content editing

Non-developer leads: see **[`docs/02-editing-guide.md`](docs/02-editing-guide.md)**. It covers publishing an event, opening or closing recruitment, adding and archiving members, Dexterix editions, galleries, sponsors and announcements.

## Contributing

1. Pick or open an issue. For content fixes (a wrong date, a missing event), a Studio edit with a source is enough. No PR needed.
2. Branch from `main` (see below), keep PRs small, describe *why*.
3. `npm run check && npm run build` must pass.
4. Any new number or claim needs a source. PRs that add unsourced facts will be asked for one.
5. Accessibility is part of done: keyboard path, focus state, alt text, reduced motion.

## Branch strategy

- `main` is production. Protected; deploys automatically.
- `feat/<thing>`, `fix/<thing>`, `content/<thing>`, `chore/<thing>` are short-lived branches, merged by PR with a preview deployment.
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `content:`).

## Code quality

- TypeScript `strict`; ESLint (`next/core-web-vitals` + TypeScript + React Compiler rules); Prettier with Tailwind class sorting.
- Accessibility target: WCAG AA. Skip link, visible focus, semantic landmarks, `aria-live` for filters, native `<dialog>` for overlays, `prefers-reduced-motion` respected everywhere (the hero canvas renders a single still frame).
- Performance: static pages, CSS inlined, fonts self-hosted, the search index and overlays loaded on demand, `content-visibility` on long pages, no client-side data fetching on load.
- Security: headers set in `next.config.ts`; form validated server-side with a honeypot, time trap and rate limit; JSON-LD escaped; CMS links scheme-checked; secrets server-only.
