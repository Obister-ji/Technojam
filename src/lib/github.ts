/**
 * Cached, server-only GitHub metadata. One request per repo per day,
 * optional token for higher limits, silent fallback on any failure —
 * the page renders from CMS data regardless.
 */
export interface RepoMeta {
  pushedAt: string;
  language: string | null;
  archived: boolean;
  openIssues: number;
  defaultBranch: string;
  license: string | null;
  topics: string[];
}

const headers = () => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

export async function getRepoMeta(fullName?: string): Promise<RepoMeta | null> {
  if (!fullName || !/^[\w.-]+\/[\w.-]+$/.test(fullName)) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: headers(),
      next: { revalidate: 86400, tags: ["github", `github:${fullName}`] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const r = (await res.json()) as {
      pushed_at: string;
      language: string | null;
      archived: boolean;
      open_issues_count: number;
      default_branch: string;
      license: { spdx_id: string } | null;
      topics?: string[];
    };
    return {
      pushedAt: r.pushed_at,
      language: r.language,
      archived: r.archived,
      openIssues: r.open_issues_count,
      defaultBranch: r.default_branch,
      license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
      topics: r.topics ?? [],
    };
  } catch {
    return null;
  }
}

/* ---------------- Transmission: org activity log ---------------- */

export interface ActivityLine {
  id: string;
  at: string; // ISO timestamp
  who: string; // public GitHub login
  verb: string;
  repo: string;
  url: string;
}

interface GhEvent {
  id: string;
  type: string;
  created_at: string;
  actor: { login: string };
  repo: { name: string };
  payload: { action?: string; ref_type?: string; pull_request?: { merged?: boolean }; size?: number };
}

interface GhRepo {
  id: number;
  name: string;
  pushed_at: string;
  html_url: string;
}

const VERBS: Record<string, (e: GhEvent) => string | null> = {
  PushEvent: (e) => (e.payload.size && e.payload.size > 1 ? `pushed ${e.payload.size} commits to` : "pushed to"),
  PullRequestEvent: (e) =>
    e.payload.action === "opened" ? "opened a pull request on" : e.payload.pull_request?.merged ? "merged a pull request into" : null,
  CreateEvent: (e) => (e.payload.ref_type === "repository" ? "started" : e.payload.ref_type === "branch" ? "branched" : null),
  IssuesEvent: (e) => (e.payload.action === "opened" ? "opened an issue on" : null),
  ReleaseEvent: () => "released",
  ForkEvent: () => "forked",
  WatchEvent: () => "starred",
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: 3600, tags: ["github", "github:activity"] },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Public activity across the organisation — real logins, real repos.
 * Cached for an hour. A quiet feed is topped up with the most recently
 * pushed repositories. Returns [] if GitHub is unreachable.
 */
export async function getOrgActivity(org: string, limit = 8): Promise<ActivityLine[]> {
  const [events, repos] = await Promise.all([
    getJson<GhEvent[]>(`https://api.github.com/orgs/${org}/events?per_page=60`),
    getJson<GhRepo[]>(`https://api.github.com/orgs/${org}/repos?sort=pushed&per_page=${limit}`),
  ]);

  const fromEvents: ActivityLine[] = (events ?? []).flatMap((e) => {
    const verb = VERBS[e.type]?.(e);
    if (!verb) return [];
    const repo = e.repo.name.split("/")[1] ?? e.repo.name;
    return [{ id: e.id, at: e.created_at, who: e.actor.login, verb, repo, url: `https://github.com/${e.repo.name}` }];
  });

  const fromRepos: ActivityLine[] = (repos ?? []).map((r) => ({
    id: `repo-${r.id}`,
    at: r.pushed_at,
    who: org,
    verb: "last push on",
    repo: r.name,
    url: r.html_url,
  }));

  const seen = new Set<string>();
  return [...fromEvents, ...fromRepos]
    .sort((a, b) => b.at.localeCompare(a.at))
    .filter((l) => {
      const key = `${l.who}|${l.repo}|${l.verb}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
