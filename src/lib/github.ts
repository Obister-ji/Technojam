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

export async function getRepoMeta(fullName?: string): Promise<RepoMeta | null> {
  if (!fullName || !/^[\w.-]+\/[\w.-]+$/.test(fullName)) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
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
