"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { search, type SearchGroup, type SearchItem } from "@/lib/search/types";
import { ArrowRight, ArrowUpRight, Terminal } from "@/components/ui/Icon";
import { PixelGlass } from "@/components/vibe/SearchTrigger";
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
      <div className="pixel-panel border-2 border-cyan/60 shadow-[0_0_60px_-12px_rgb(59_227_255/0.45)]">
        <div className="flex items-center gap-3 border-b-2 border-line px-4 font-mono">
          <PixelGlass className="size-4 shrink-0 text-cyan" />
          <span aria-hidden className="shrink-0 text-pulse">
            find
          </span>
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Search pages, projects, events, domains and people"
            placeholder="projects, events, people…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 w-full bg-transparent text-lg caret-cyan outline-none placeholder:text-fg-subtle"
          />
          <kbd className="hidden border border-b-[3px] border-line-strong px-1.5 py-px font-pixel text-[0.58rem] text-fg-muted sm:block">
            esc
          </kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,32rem)] overflow-y-auto overscroll-contain p-2">
          {results.length === 0 ? (
            <li className="px-3 py-10 text-center text-fg-muted" role="presentation">
              404: nothing for “{query}”. Try a domain, an event or a year.
            </li>
          ) : null}
          {results.map((item, i) => {
            const header =
              item.group !== results[i - 1]?.group ? (
                <li
                  key={`h-${item.group}`}
                  role="presentation"
                  className="px-3 pt-3 pb-1.5 font-pixel text-[0.62rem] tracking-[0.08em] text-pulse uppercase"
                >
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
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors ${selected ? "bg-cyan/10" : ""}`}
              >
                <span className={`w-3 shrink-0 font-pixel text-xs ${selected ? "text-cyan" : "text-transparent"}`} aria-hidden>
                  ▶
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.title}</span>
                  {item.subtitle ? <span className="block truncate text-sm text-fg-muted">{item.subtitle}</span> : null}
                </span>
                {item.external ? (
                  <ArrowUpRight className="shrink-0 text-fg-subtle" />
                ) : (
                  <ArrowRight className={`shrink-0 ${selected ? "text-cyan" : "text-fg-subtle"}`} />
                )}
              </li>,
            ];
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t-2 border-line px-4 py-2.5">
          <p className="hidden label-mono text-fg-subtle sm:block">↑↓ navigate · ↵ open</p>
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(onOpenConsole, 0);
            }}
            className="inline-flex items-center gap-2 label-mono text-phosphor hover:text-fg"
          >
            <Terminal className="size-4" /> Open console
          </button>
        </div>
      </div>
    </dialog>
  );
}
