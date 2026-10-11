"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { SearchItem } from "@/lib/search/types";
import { Close } from "@/components/ui/Icon";
import { useModalDialog } from "./useModalDialog";

export interface ConsoleData {
  tagline: string;
  foundedYear: number;
  githubOrg: string;
  email: string;
  recruitment?: { title: string; status: string };
  milestones: { year: number; title: string }[];
}

type Line = { id: number; kind: "in" | "out" | "err" | "sys"; content: ReactNode };

const ACCENTS = { pulse: "var(--color-pulse)", volt: "var(--color-volt)", violet: "var(--color-violet)" } as const;
type Accent = keyof typeof ACCENTS;

const PROMPT = "guest@technojam:~$";

const ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  projects: "/projects",
  events: "/events",
  dexterix: "/dexterix",
  community: "/community",
  team: "/team",
  join: "/join",
  collaborate: "/collaborate",
  resources: "/resources",
};

export default function TechnoJamConsole({ index, data, onClose }: { index: SearchItem[]; data: ConsoleData; onClose: () => void }) {
  const ref = useModalDialog(onClose);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [accent, setAccent] = useState<Accent>("pulse");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [lines, setLines] = useState<Line[]>(() => [
    { id: -2, kind: "sys", content: `TechnoJam console — est. ${data.foundedYear}. ${data.tagline}.` },
    { id: -1, kind: "sys", content: "Type `help` to see what this thing can do. Everything here is also in the normal navigation." },
  ]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const print = (kind: Line["kind"], content: ReactNode) => setLines((l) => [...l, { id: nextId.current++, kind, content }]);

  const go = (href: string, label: string) => {
    print("out", `→ opening ${label}…`);
    setTimeout(() => {
      onClose();
      router.push(href);
    }, 280);
  };

  const list = (group: SearchItem["group"], limit = 12) => {
    const items = index.filter((i) => i.group === group).slice(0, limit);
    if (!items.length) return print("out", "(empty — nothing verified to show yet)");
    print(
      "out",
      <ul className="grid gap-0.5">
        {items.map((i) => (
          <li key={i.id}>
            <button type="button" className="text-left hover:underline" onClick={() => go(i.href, i.title)}>
              <span style={{ color: ACCENTS[accent] }}>›</span> {i.title}
              {i.subtitle ? <span className="text-fg-subtle"> — {i.subtitle.slice(0, 60)}</span> : null}
            </button>
          </li>
        ))}
      </ul>,
    );
  };

  const run = (raw: string) => {
    const input = raw.trim();
    print("in", input);
    if (!input) return;
    setHistory((h) => [input, ...h].slice(0, 50));
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    switch (cmd.toLowerCase()) {
      case "help":
        return print(
          "out",
          <div className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-0.5">
            {[
              ["about", "who we are"],
              ["projects", "things we've shipped"],
              ["events", "recent events"],
              ["dexterix", "the flagship hackathon"],
              ["team", "the people (and past teams)"],
              ["join", "recruitment status"],
              ["history", "the timeline since 2015"],
              ["github", "open our GitHub org"],
              ["cd <page>", "navigate, e.g. cd events"],
              ["search <q>", "search everything"],
              ["theme <c>", "pulse · volt · violet"],
              ["clear", "clear the screen"],
              ["exit", "close the console"],
            ].map(([c, d]) => (
              <span key={c} className="contents">
                <span style={{ color: ACCENTS[accent] }}>{c}</span>
                <span className="text-fg-muted">{d}</span>
              </span>
            ))}
          </div>,
        );
      case "about":
      case "whoami":
        if (cmd.toLowerCase() === "whoami") return print("out", "guest — but that's easy to change. Try `join`.");
        print("out", "TechnoJam is a student tech club and a community for curious people.");
        print("out", "We learn technology by building it: projects, hackathons, workshops, open source — and Dexterix.");
        return;
      case "projects":
        return list("Projects");
      case "events":
        return list("Events", 8);
      case "dexterix":
        return list("Dexterix");
      case "team":
        return go("/team", "team");
      case "join": {
        const r = data.recruitment;
        if (r) print("out", `${r.title}: ${r.status.toUpperCase()}`);
        return go("/join", "join");
      }
      case "history":
        return print(
          "out",
          <ul className="grid gap-0.5">
            {data.milestones.map((m) => (
              <li key={`${m.year}-${m.title}`}>
                <span style={{ color: ACCENTS[accent] }}>{m.year}</span> {m.title}
              </li>
            ))}
          </ul>,
        );
      case "github":
        print("out", `→ github.com/${data.githubOrg}`);
        window.open(`https://github.com/${data.githubOrg}`, "_blank", "noopener");
        return;
      case "mail":
      case "contact":
        return print("out", data.email);
      case "cd":
      case "open": {
        const target = ROUTES[arg.replace(/^\/|\/$/g, "")];
        if (!arg || arg === "~") return go("/", "home");
        if (target) return go(target, arg);
        const match = index.find((i) => !i.external && i.title.toLowerCase() === arg);
        if (match) return go(match.href, match.title);
        return print("err", `cd: no such page: ${arg}. Try \`ls\`.`);
      }
      case "ls":
        return print("out", Object.keys(ROUTES).join("   "));
      case "search": {
        if (!arg) return print("err", "usage: search <query>");
        const hits = index.filter((i) => `${i.title} ${i.subtitle ?? ""} ${i.keywords ?? ""}`.toLowerCase().includes(arg));
        if (!hits.length) return print("out", `no results for "${arg}"`);
        return print(
          "out",
          <ul className="grid gap-0.5">
            {hits.slice(0, 10).map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  className="text-left hover:underline"
                  onClick={() => (i.external ? window.open(i.href, "_blank", "noopener") : go(i.href, i.title))}
                >
                  <span className="text-fg-subtle">[{i.group.toLowerCase()}]</span> {i.title}
                </button>
              </li>
            ))}
          </ul>,
        );
      }
      case "theme": {
        if (arg in ACCENTS) {
          setAccent(arg as Accent);
          return print("out", `accent set to ${arg}`);
        }
        return print("out", "available: pulse · volt · violet");
      }
      case "sudo":
        if (arg.startsWith("join")) return print("out", "Nice try. Recruitment doesn't take root access — it takes curiosity. Run `join`.");
        return print("err", "guest is not in the sudoers file. This incident will be reported to the core team. (Not really.)");
      case "throttle":
        return print("out", "▮▮▮▮▮▮▮▮▮▮ 100% — throttle to learn.");
      case "rm":
        return print("err", "rm: refusing to remove production. Someone already did that once.");
      case "clear":
        return setLines([]);
      case "exit":
      case "quit":
        return onClose();
      default:
        return print("err", `command not found: ${cmd}. Type \`help\`.`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
      setCursor(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <dialog
      ref={ref}
      aria-label="TechnoJam console"
      className="m-0 mx-auto mt-[6vh] w-[min(52rem,calc(100vw-2rem))] max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/85 backdrop:backdrop-blur-sm"
    >
      <div className="crt flex h-[min(78vh,40rem)] flex-col border border-line-strong font-mono text-[0.85rem] shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <p className="label-mono text-fg-muted">
            <span style={{ color: ACCENTS[accent] }}>{">_"}</span> technojam — console
          </p>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center text-fg-muted hover:text-fg" aria-label="Close console">
            <Close />
          </button>
        </div>
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l) => (
            <div key={l.id} className={l.kind === "err" ? "text-pulse" : l.kind === "sys" ? "text-fg-muted" : ""}>
              {l.kind === "in" ? (
                <span>
                  <span style={{ color: ACCENTS[accent] }}>{PROMPT}</span> {l.content}
                </span>
              ) : (
                l.content
              )}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 border-t border-line px-4 py-3">
          <span style={{ color: ACCENTS[accent] }} aria-hidden>
            {PROMPT}
          </span>
          <span className="sr-only">Console command</span>
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="flex-1 bg-transparent outline-none"
            style={{ caretColor: ACCENTS[accent] }}
          />
        </label>
      </div>
    </dialog>
  );
}
