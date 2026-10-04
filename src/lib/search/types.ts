export type SearchGroup = "Actions" | "Pages" | "Projects" | "Events" | "Dexterix" | "Domains" | "People" | "Resources";

export interface SearchItem {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string;
  external?: boolean;
}

/**
 * Tiny ranked matcher — exact prefix > word prefix > substring > subsequence.
 * Good enough for a few hundred items; no dependency needed.
 */
export function scoreItem(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const title = item.title.toLowerCase();
  const hay = `${title} ${item.subtitle ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  if (title.startsWith(q)) return 100 - title.length / 100;
  if (title.split(/[\s\-–./]+/).some((w) => w.startsWith(q))) return 80;
  if (title.includes(q)) return 60;
  if (hay.includes(q)) return 40;
  const terms = q.split(/\s+/);
  if (terms.length > 1 && terms.every((t) => hay.includes(t))) return 30;
  let i = 0;
  for (const ch of title) if (ch === q[i]) i++;
  return i === q.length ? 10 : 0;
}

export function search(items: SearchItem[], query: string, limit = 40) {
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
