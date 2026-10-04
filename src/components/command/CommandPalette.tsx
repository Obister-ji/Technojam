"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { search, type SearchGroup, type SearchItem } from "@/lib/search/types";
import { ArrowRight, ArrowUpRight, Search, Terminal } from "@/components/ui/Icon";
import { useModalDialog } from "./useModalDialog";

const GROUP_ORDER: SearchGroup[] = ["Actions", "Pages", "Projects", "Events", "Dexterix", "Domains", "People", "Resources"];

export default function CommandPalette({
  index,
  onClose,
  onOpenConsole,
}: {
  index: SearchItem[];
  onClose: () => void;
  onOpenConsole: () => void;
}) {
  const ref = useModalDialog(onClose);
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const found = search(index, query, query ? 40 : 200);
    // Without a query, show a curated starting set rather than everything.
    const list = query ? found : found.filter((i) => i.group === "Actions" || i.group === "Pages");
    // With a query, groups appear in order of their best match.
    const order = query ? [...new Set(list.map((i) => i.group))] : GROUP_ORDER;
    return order.flatMap((g) => list.filter((i) => i.group === g));
  }, [index, query]);

  const go = (item: SearchItem) => {
    onClose();
    if (item.external) window.open(item.href, item.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
    else router.push(item.href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <dialog
      ref={ref}
      aria-label="Search TechnoJam"
      className="m-0 mx-auto mt-[8vh] w-[min(42rem,calc(100vw-2rem))] max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/80 backdrop:backdrop-blur-sm"
    >
      <div className="border border-line-strong bg-bg-raised shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 shrink-0 text-fg-muted" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Search pages, projects, events, domains and people"
            placeholder="Search pages, projects, events, people…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 w-full bg-transparent text-lg outline-none placeholder:text-fg-subtle"
          />
          <kbd className="label-mono hidden border border-line px-1.5 py-0.5 text-fg-subtle sm:block">ESC</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,32rem)] overflow-y-auto overscroll-contain p-2">
          {results.length === 0 ? (
            <li className="px-3 py-10 text-center text-fg-muted" role="presentation">
              No matches for “{query}”. Try a domain, an event or a year.
            </li>
          ) : null}
          {results.map((item, i) => {
            const header =
              item.group !== results[i - 1]?.group ? (
                <li key={`h-${item.group}`} role="presentation" className="label-mono px-3 pt-3 pb-1.5 text-fg-subtle">
                  {item.group}
                </li>
              ) : null;
            const selected = i === active;
            return [
              header,
              <li
                key={item.id}
                id={optionId(i)}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(i)}
                onClick={() => go(item)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 ${selected ? "bg-surface-hover" : ""}`}
              >
                <span className={`h-5 w-0.5 shrink-0 ${selected ? "bg-pulse" : "bg-transparent"}`} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.title}</span>
                  {item.subtitle ? <span className="block truncate text-sm text-fg-muted">{item.subtitle}</span> : null}
                </span>
                {item.external ? (
                  <ArrowUpRight className="shrink-0 text-fg-subtle" />
                ) : (
                  <ArrowRight className={`shrink-0 ${selected ? "text-fg" : "text-fg-subtle"}`} />
                )}
              </li>,
            ];
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
          <p className="label-mono hidden text-fg-subtle sm:block">↑↓ navigate · ↵ open</p>
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(onOpenConsole, 0);
            }}
            className="label-mono inline-flex items-center gap-2 text-fg-muted hover:text-fg"
          >
            <Terminal className="size-4" /> Open console
          </button>
        </div>
      </div>
    </dialog>
  );
}
