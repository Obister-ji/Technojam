"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "@/components/ui/primitives";

/**
 * Small game layer over the site: explore, poke things, unlock badges.
 * Progress lives in this browser only (localStorage) and never leaves it.
 */

export const ACHIEVEMENTS = {
  hello: { title: "Hello, World!", hint: "Show up.", note: "you showed up. that's literally step one.", xp: 10 },
  clicker: { title: "Pixel Pusher", hint: "Poke the sky.", note: "clicked the universe 10 times. it noticed.", xp: 20 },
  est: { title: "Est. 2015", hint: "Click the sky 11 times.", note: "the year it all started.", xp: 15 },
  vibe: { title: "Vibe Check: Passed", hint: "Read every rule.", note: "you know the code. welcome in.", xp: 40 },
  terminal: { title: "sudo make me a coder", hint: "Find the terminal.", note: "you found the console. obviously.", xp: 30 },
  scroller: { title: "Touched Grass (Digitally)", hint: "Reach the bottom.", note: "you scrolled the whole thing. respect.", xp: 20 },
  owl: { title: "Night Owl", hint: "Visit after midnight.", note: "go to sleep. (after this commit.)", xp: 25 },
  konami: { title: "Cheat Code", hint: "↑↑↓↓←→←→BA", note: "you're one of us now.", xp: 100 },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;
const IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];
const KEY = "tj-achievements";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

interface Ctx {
  unlocked: AchievementId[];
  xp: number;
  unlock: (id: AchievementId) => void;
}

const AchievementContext = createContext<Ctx | null>(null);

/** Safe outside the provider too (e.g. the global 404): it simply does nothing. */
export function useAchievements(): Ctx {
  return useContext(AchievementContext) ?? { unlocked: [], xp: 0, unlock: () => {} };
}

function load(): AchievementId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    return raw.filter((id): id is AchievementId => id in ACHIEVEMENTS);
  } catch {
    return [];
  }
}

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [toast, setToast] = useState<{ id: AchievementId; n: number } | null>(null);
  const ready = useRef(false);
  const toastTimer = useRef(0);

  const have = useRef<AchievementId[]>([]);

  const unlock = useCallback((id: AchievementId) => {
    if (!ready.current || have.current.includes(id)) return;
    const next = [...have.current, id];
    have.current = next;
    setUnlocked(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode: progress lasts for this visit only */
    }
    setToast((t) => ({ id, n: (t?.n ?? 0) + 1 }));
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4300);
  }, []);

  // Restore progress, then grant the arrival badges.
  useEffect(() => {
    have.current = load();
    setUnlocked(have.current);
    ready.current = true;
    const t = window.setTimeout(() => {
      unlock("hello");
      const hour = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
      if (hour < 5) unlock("owl");
    }, 1200);
    return () => clearTimeout(t);
  }, [unlock]);

  // ↑↑↓↓←→←→BA → party mode for a few seconds.
  useEffect(() => {
    let pos = 0;
    let timer = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        unlock("konami");
        document.documentElement.classList.add("party");
        clearTimeout(timer);
        timer = window.setTimeout(() => document.documentElement.classList.remove("party"), 6000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [unlock]);

  const xp = unlocked.reduce((sum, id) => sum + ACHIEVEMENTS[id].xp, 0);
  const value = useMemo(() => ({ unlocked, xp, unlock }), [unlocked, xp, unlock]);

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[80] overflow-hidden p-2">
        {toast ? (
          <div
            key={toast.n}
            className="toast-in pixel-panel flex max-w-[calc(100vw-2.5rem)] items-center gap-4 border-2 border-cyan bg-bg-raised py-3 pr-5 pl-3"
          >
            <Trophy className="size-9 shrink-0 text-cyan" />
            <div>
              <p className="font-pixel text-[0.62rem] tracking-[0.12em] text-pulse uppercase">Achievement unlocked</p>
              <p className="mt-1 font-pixel text-sm text-fg">{ACHIEVEMENTS[toast.id].title}</p>
              <p className="mt-0.5 text-xs text-fg-muted">
                {ACHIEVEMENTS[toast.id].note} <span className="text-cyan">+{ACHIEVEMENTS[toast.id].xp} XP</span>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </AchievementContext.Provider>
  );
}

/** Trophy button in the navbar: shows progress, opens the badge list. */
export function AchievementBadge() {
  const { unlocked, xp } = useAchievements();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="achievement-list"
        className="inline-flex h-11 items-center gap-2 border-2 border-line-strong px-2.5 font-pixel text-[0.7rem] text-fg transition-colors hover:border-cyan hover:text-cyan md:h-10"
      >
        <Trophy className="size-4 text-cyan" />
        <span>
          {unlocked.length}/{IDS.length}
        </span>
        <span className="sr-only">achievements unlocked — show list</span>
      </button>
      {open ? (
        <div
          id="achievement-list"
          className="pixel-panel absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(22rem,calc(100vw-2rem))] border border-line-strong p-5 shadow-2xl shadow-black/60 max-md:fixed max-md:inset-x-4 max-md:top-[4.5rem] max-md:right-4 max-md:w-auto"
        >
          <div className="flex items-baseline justify-between">
            <p className="font-pixel text-sm text-fg">Achievements</p>
            <p className="font-pixel text-xs text-cyan">{xp} XP</p>
          </div>
          <div className="mt-3 h-2 bg-bg-sunken" aria-hidden>
            <div
              className="h-full bg-[image:var(--spectrum)] transition-[width] duration-700"
              style={{ width: `${(unlocked.length / IDS.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 grid gap-2.5">
            {IDS.map((id) => {
              const a = ACHIEVEMENTS[id];
              const got = unlocked.includes(id);
              return (
                <li key={id} className={cx("flex items-start gap-3", !got && "opacity-55")}>
                  <span
                    aria-hidden
                    className={cx(
                      "mt-0.5 grid size-5 shrink-0 place-items-center font-pixel text-[0.6rem]",
                      got ? "bg-cyan text-bg" : "border border-line-strong text-fg-subtle",
                    )}
                  >
                    {got ? "✓" : "?"}
                  </span>
                  <span>
                    <span className="block font-pixel text-[0.72rem] text-fg">{got ? a.title : "???"}</span>
                    <span className="block text-xs text-fg-muted">{got ? a.note : a.hint}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-[0.7rem] text-fg-subtle">Saved in this browser only. Nothing is tracked.</p>
        </div>
      ) : null}
    </div>
  );
}

export function Trophy({ className }: { className?: string }) {
  // 8×8 pixel trophy
  const px = ["01111110", "11111111", "01111110", "00111100", "00011000", "00011000", "00111100", "01111110"];
  return (
    <svg viewBox="0 0 8 8" className={className} aria-hidden shapeRendering="crispEdges" fill="currentColor">
      {px.flatMap((row, y) => [...row].map((b, x) => (b === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}
