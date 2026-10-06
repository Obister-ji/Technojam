# TechnoJam — research, information architecture & technical plan

_Researched 4 October 2026. Every fact used on the site is in `src/content/seed/*` with a source URL and a verification status._

---

## 1. Research summary

TechnoJam is the student-led technical community of the School of Computing Science & Engineering (SCSE) at Galgotias University, Greater Noida. It describes itself as established in 2015 and uses the line **“Throttle to Learn.”** Its public footprint is fragmented across:

| Surface | What lives there | URL |
|---|---|---|
| Previous website | Terminal/“Matrix” themed Next.js site. **Team & gallery sections are placeholder content** (generic names, Unsplash photos) | https://www.technojam.in |
| GitHub org `technojam` | 67 public repos (Aug 2018 → Sep 2026): event sites, recruitment tasks, apps, Hacktoberfest repos | https://github.com/technojam |
| GitHub user `technojam-gu` | 4 repos from 2018–19, including the first static site | https://github.com/technojam-gu |
| Commudle | Event pages + RSVPs; **2,023 members** (as of 2026-10-04) | https://www.commudle.com/communities/technojam |
| University pages | Official descriptions, Dexterix 3.0/4.0, Build with AI | galgotiasuniversity.edu.in |
| Dexterix 5.0 site | Space-themed microsite, prize tiers, targets | https://dexterix.technojam.in |
| LinkedIn / Instagram / X / Discord | Announcements | see `src/content/seed/settings.ts` |

The new site's job is to be the **canonical home** that ties these together.

## 2. Confirmed facts (used on the site)

| Fact | Source |
|---|---|
| Established 2015, tagline “Throttle to Learn” | LinkedIn, Commudle, `TJ-Web` README |
| “Official technical society of Galgotias University … practical and collaborative tech culture” | galgotiasuniversity.edu.in/p/TechnoJam |
| Contact: technojam@galgotiasuniversity.edu.in | technojam.in, Dexterix 5.0 site, GitHub org |
| First Dexterix: 20 Nov 2018, “Smart Sustainable Solutions”, 500+ students (press) | TenNews, 21 Nov 2018 |
| Dexterix 3.0: 11–12 Mar 2022, international hybrid, SCSE + ACM, hosted by TechnoJam, 8 domains, SIH 2022 problem statements | University report PDF + brochure |
| Dexterix 4.0: 13–14 Apr 2024, offline, corporate + student tracks, 12 domains, prize tiers ₹21k/15k/10k + girls/freshers ₹5k | University page, Commudle |
| Dexterix 5.0: 14–15 Feb 2026, 36-hour, offline at GU; **targets** 600+ participants / 100+ colleges; advertised prizes ₹50k/35k/20k/7.5k | TechnoJam LinkedIn post; dexterix.technojam.in |
| Build With AI 2025: 26 Apr 2025, SCSE × TechnoJam, supported by Google for Developers; agentic AI, LLM chatbot, prompt engineering, MCP/A2A/ADK; 4 speakers; 250+ registered | University page; Commudle |
| Other events: Expert Talk by Akshay Saini (24 Apr 2024), Meet the Clouds (8 Jun 2024), ML Math Clubs × TFUG Ghaziabad (6 Jul 2024), Turing's Class (22 Dec 2024 → 12 Jan 2025), Let's Talk Agents (23 Dec 2025), Agents 101 (16 Mar 2026), Fresher's Fest (15 Jan 2024, with Graphex) | Commudle |
| Recruitment 2026: `TJ-TASKS-2026`, 11 domains, tiered tasks, submit via GitHub repo + form, **deadline 7 Sep 2026** | GitHub |
| Recruitment 2025 deadline 15 Oct; 2024 deadline 16 Oct | GitHub |

## 3. Conflicting / unverified (kept out of public UI or shown with the conflict)

| Claim | Status | Handling |
|---|---|---|
| Dexterix 4.0 “700+ participants, 30 colleges” (cited in the brief) | **Not found** on any reachable first-party page | Stored as `participantsActual` with `verification.status = "pending"` → hidden publicly; shows in Studio “Needs verification” |
| Dexterix 4.0 prize pool | University: tiered ₹56k total; Commudle: “₹21,000 total” | Show university tiers + note |
| Dexterix 3.0 duration | Report: 24 h; repo description: 36 h | Show 24 h + note |
| Dexterix 3.0 prize | “₹2 lakh+” (report) vs ₹2.5 lakh (page) | Show “₹2 lakh+” + note |
| Dexterix origin year | 2018 (Dexterix 5.0 site, press) vs 2019 (Commudle) | 2018, backed by 2018 press coverage |
| Dexterix 2.0 year | Edition exists (archive); year unknown | Pending → hidden from timeline |
| Dexterix 5.0 outcomes | No post-event report found | Only targets shown, labelled TARGET; `postEventDataAvailable: false` |
| Team roster | Previous site is placeholder; university page names two student leads | **No roster published.** `/team` shows an honest empty state; members are added in the Studio with consent |
| Build With AI speaker affiliations | University vs Commudle differ for two speakers | University wording, noted |
| Follower counts, “500+ Discord members”, “nationally recognised” | Self-reported / promotional | Not used |
| SIH 2026 pre-qualifier at GU | Not attributed to TechnoJam by the source | Not used |

## 4. Audience analysis

| Audience | Question | Where they get the answer (≤ 2 interactions) |
|---|---|---|
| Prospective member | Why join? | Hero CTA → **/join** (status, domains, process, prep) |
| Current member | What's happening? | “Now at TechnoJam” strip → events / recruitment |
| Developer | What do they build? | **/projects** (filter by status/domain, real repos) |
| Hackathon participant | What events? | **/events**, **/dexterix** |
| Recruiter / company | What talent is here? | Projects, Dexterix, domains → **/collaborate** |
| Sponsor | Why partner? | **/collaborate** (sponsor Dexterix, host workshop) |
| Speaker / mentor | How to collaborate? | **/collaborate** intents (mentor, judge, speak) |
| Alumnus | Find my batch/history | **/team** (past teams by year), **/about** timeline |
| University visitor | What impact? | Verified metrics, history timeline, Dexterix editions |

## 5. Website goals

1. Explain TechnoJam completely in under a minute (community, engineering, learning, events, opportunity).
2. Convert curious students → recruitment, with an always-useful Join page (open *and* closed states).
3. Make engineering history discoverable (projects, repos, editions) without embedding GitHub.
4. Give partners a serious, separate path.
5. Never publish an unverifiable number — provenance is a feature.
6. Let non-developers run it (Sanity Studio at `/studio`).

## 6. Sitemap

```
/                      Home
/about                 Story, how we work, history timeline
/projects              Project index (status/domain filters)
/projects/[slug]       Project detail (+ cached GitHub metadata)
/events                Upcoming + past, filter by type
/events/[slug]         Event detail (agenda, speakers, figures, links)
/dexterix              Flagship: edition timeline + numbers
/dexterix/[slug]       Edition detail
/community             Peer learning, open source, partners, channels
/team                  Current team + past teams
/team/[year]           Team by year (persistent alumni URLs)
/join                  Recruitment (state-driven by CMS)
/collaborate           Sponsors, mentors, judges, speakers, partners (form)
/resources             Curated starting points per domain
/studio                Sanity Studio (noindex)
/api/revalidate        Sanity webhook → tag revalidation
/api/draft-mode/*      Preview
/api/contact           Collaboration form (validated, rate-limited)
/sitemap.xml /robots.txt  + per-route OG images
```

## 7. Homepage architecture

| # | Section | Density | Content source |
|---|---|---|---|
| 01 | Hero — THROTTLE TO LEARN + living TJ network | quiet/visual | siteSettings |
| 02 | Now at TechnoJam — status strip | dense | homepageFeature → open recruitment → upcoming event → latest event |
| 03 | “Not another coding club.” + five aspects | editorial | static copy |
| 04 | Signal — verified metrics with sources | dense | metrics (verified only) |
| 05 | Explore // domains (interactive) | interactive | domain + project + event |
| 06 | We ship things — featured projects | dense | project (featured) |
| 07 | Dexterix — cinematic edition timeline | cinematic | dexterixEdition |
| 08 | Events — next/latest | dense | event |
| 09 | History — git-graph timeline | quiet | milestone |
| 10 | Join CTA (state-aware) | loud | recruitmentCycle |
| 11 | Collaborate CTA | quiet | static |
| 12 | Footer — THROTTLE TO LEARN. + console | — | siteSettings |

## 8. Content models (Sanity)

`siteSettings` (singleton) · `socialLink` · `announcement` · `homepageFeature` · `domain` · `project` · `event` · `dexterixEdition` · `person` · `teamYear` · `recruitmentCycle` · `sponsor` · `partner` · `achievement` · `milestone` · `resource` · `gallery` · `inquiry` (form submissions).
Shared objects: `verification` (status / sourceName / sourceUrl / lastVerified / notes), `statFigure`, `eventFigure` (kind: actual / target / registered / reach), `speaker`, `link`, `accessibleImage` (alt required), `richText`.

Integrity rules baked into the model:
- `dexterixEdition.participantsActual` ≠ `participantsTarget`; same for institutions. Pending figures never render.
- `person.consent` must be true for a person to appear publicly (enforced in GROQ).
- `gallery.approved` must be true to render.
- Event status (upcoming / live / past) is derived from dates; editors only override for cancelled/postponed.

## 9. Design direction — “The Young Indian Computer Lab”

The homepage is nine screens for a fast-scrolling audience: **one screen = one idea = one strong line + one visual + one small interaction.** Opening (WE OPEN IT.) → Then/Now (CRT turns into a phone on scroll) → Question → Project reel (one project per screen) → Jam Night → People strip → The lab is alive (real GitHub feed) → Archive flash (collage of real artifacts) → Make something worth remembering. Rhythm alternates quiet and loud screens; motion is limited to reveals, the CRT power-on, the scroll crossfade, the teletype feed and a few-pixel cursor drift on the collage.

- **Palette:** aged copier paper , printer ink , beige hardware . One technological accent, CRT phosphor green ( printed,  on glass), and one physical accent, rubber-stamp red . No gradients, no glass. All text ≥ 4.5:1.
- **Type, three voices:** Archivo (wide, black) for statements; Newsreader serif for narrative; JetBrains Mono only for metadata, timestamps and terminal output.
- **Graphic language:** chapter headers with registration marks, document IDs, revisions and page numbers; dot-matrix perforations and green-bar stationery; one stamp per section at most; a signal cable that draws itself with scroll (CSS scroll timeline, no JS); the CRT is the only dark surface.
- **Photography:** documentary photos only, monochrome until hover. Until real photos exist, plates show a halftone *shot list* and **[ REAL DATA REQUIRED ]**.
- **Honesty rule:** anything without real data prints **[ REAL DATA REQUIRED ]** — Jam Night's schedule, member cards, makers, photos. Every timeline date and statistic carries a source.
- **One Hindi moment:** “कुछ बनाते हैं?” on the Jam Night notice.

## 10. Technology architecture

- **Next.js 16.3** (App Router, React 19.2, Turbopack), **TypeScript strict**, **Tailwind CSS 4** (CSS-first tokens), **Sanity 6** embedded at `/studio` via `next-sanity` 13.
- **Rendering**: static generation + ISR (1 h) + on-demand revalidation by tag from a signed Sanity webhook. Draft mode + Presentation tool for preview.
- **Content layer** (`src/lib/content`): one module; Sanity when configured, the verified seed otherwise. Components never import data directly.
- **GitHub**: cached (24 h) repo metadata per project, optional token, graceful fallback — no client-side API calls.
- **Motion**: CSS + IntersectionObserver reveals, one canvas for the hero; all respects `prefers-reduced-motion`. No animation library needed.
- **Analytics**: Plausible (cookieless), opt-in by env var.
- **Forms**: server-validated route handler, honeypot, per-IP rate limit, stored in Sanity as `inquiry` when a write token is present.

## 11. Assumptions

1. Canonical domain stays `https://www.technojam.in`.
2. Recruitment 2026 is treated as **closed** (deadline 7 Sep 2026 passed); the next cycle is not announced.
3. No approved photography is available yet — the site ships designed placeholders, not stock photos.
4. The official TechnoJam ribbon logo lives in `public/brand/` (webp for the site, png for social cards); app icons are generated from it.
5. The Discord invite from the previous website (`6ksUUABBkY`) is used; the 2026 task repo uses a different invite — confirm which is current.
