"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Scene } from "@/lib/pixel";
import { useAchievements } from "./Achievements";
import { PixelArt } from "./PixelArt";
import { ScratchCover } from "./ScratchCover";

const PLANET = ["#020a1f", "#06204f", "#0d3f8f", "#1a6ad0", "#3aa0f0", "#7fd0ff", "#d4f3ff"];
const GRASS = ["#020904", "#06210c", "#0d3d16", "#1d6b25", "#3fa83a", "#8be05a"];

interface Rule {
  title: string;
  body: string;
  code: string[];
  scene: Scene;
}

/** The club's house rules, as phone wallpapers. Static module data so canvases paint once. */
const RULES: Rule[] = [
  {
    title: "Be kind,\nit's cool fr.",
    body: "Everyone here is fighting a bug you can't see. Help first. Roast never.",
    code: ["if (someone.isStuck) {", "  help(them);", "}", "// no exceptions"],
    scene: {
      sky: ["#1b4fb0", "#2f6fd6", "#4f93ea", "#7fb0ee", "#c99ab4"],
      clouds: { palette: ["#a8708a", "#e0a0a0", "#ffd0c0"], band: [0.72, 0.95] },
      seed: 3,
    },
  },
  {
    title: "Consistency\nmatters.",
    body: "One commit a day beats one all-nighter a month. Show up — even if it's little.",
    code: ["while (alive) {", "  commit(little);", "  sleep(enough);", "}"],
    scene: {
      sky: ["#020308", "#060a18", "#0b1430", "#121f44"],
      orb: { x: 0.55, y: 0.08, r: 0.28, palette: ["#05070f", "#0b1022", "#141c38", "#24305a"], rim: "#33447a" },
      wave: { y: 0.3, color: "#d6ebff" },
      stars: 0.012,
      seed: 5,
    },
  },
  {
    title: "Ship ugly.\nFix later.",
    body: "Perfect is a deadline you'll never hit. v0.1 beats v-never, every time.",
    code: ["git add .", 'git commit -m "it works"', "git push", "# polish tomorrow"],
    scene: {
      sky: ["#07020f", "#1a0730", "#3a0f5c", "#5c1a7a"],
      orb: { x: 0.85, y: 0.9, r: 0.3, palette: ["#3a0730", "#7a1452", "#c42a78", "#ff4d9d", "#ffb0d4"], rim: "#ff9ccc", clouds: true },
      stars: 0.02,
      seed: 9,
    },
  },
  {
    title: "No dumb\nquestions.",
    body: "Everyone has googled “how to exit vim”. Ask out loud — someone else was wondering too.",
    code: ['ask("how do I exit vim?");', "// → :q!", "// valid question.", "// always."],
    scene: {
      sky: ["#02060c", "#03141c", "#062a34", "#0c4a54", "#18808a"],
      clouds: { palette: ["#0a3a44", "#137078", "#3be3ff"], band: [0.05, 0.3] },
      stars: 0.015,
      seed: 12,
    },
  },
  {
    title: "Touch grass.\nThen code.",
    body: "Rest is part of the build. Burnt-out devs ship bugs. Log off, come back sharper.",
    code: ["setTimeout(code,", "  sleep(8 * HOURS)", ");", "// then hackathon"],
    scene: {
      sky: ["#010205", "#030814", "#06122b"],
      orb: { x: 1.1, y: 0.62, r: 0.42, palette: PLANET, rim: "#3be3ff", clouds: true },
      ground: { top: 0.8, palette: GRASS, glowX: 0.45 },
      stars: 0.02,
      seed: 21,
    },
  },
];

function RuleCard({
  rule,
  index,
  flipped,
  revealed,
  onFlip,
  onReveal,
}: {
  rule: Rule;
  index: number;
  flipped: boolean;
  revealed: boolean;
  onFlip: () => void;
  onReveal: () => void;
}) {
  const tilt = useRef<HTMLDivElement>(null);
  // set by the scratch layer when a drag just ended, so that click doesn't also flip the card
  const consumeClickRef = useRef(false);

  const onCardClick = () => {
    if (consumeClickRef.current) {
      consumeClickRef.current = false;
      return;
    }
    // first click / tap / Enter reveals the card; after that it flips
    if (!revealed) onReveal();
    else onFlip();
  };

  const move = (e: PointerEvent) => {
    const el = tilt.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const leave = () => {
    tilt.current?.style.setProperty("--rx", "0deg");
    tilt.current?.style.setProperty("--ry", "0deg");
  };

  const n = String(index + 1).padStart(2, "0");
  const heading = rule.title.replace("\n", " ");

  return (
    <li
      style={{ ["--i" as string]: index }}
      className="w-(--cw) shrink-0 snap-center lg:w-[min(calc((100cqw-4*1rem)/5),calc(100cqh*0.5625))]"
    >
      <div
        ref={tilt}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-300 ease-out"
      >
        <button
          type="button"
          onClick={onCardClick}
          aria-pressed={revealed ? flipped : undefined}
          aria-label={`Rule ${n}: ${heading} ${rule.body} — ${revealed ? "flip card" : "reveal card"}`}
          data-flipped={flipped}
          className="flip @container block aspect-[9/16] w-full text-left"
        >
          <span className="flip-inner block">
            {/* front: the wallpaper */}
            <span className="flip-face block overflow-hidden border border-line-strong bg-bg-raised shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]">
              <PixelArt scene={rule.scene} width={54} height={96} className="absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_28%,rgb(0_0_0/0.45)_42%,rgb(0_0_0/0.45)_68%,rgb(0_0_0/0.2))]" />
              <span className="absolute inset-x-0 top-[40%] block px-[8cqw]">
                <span className="block font-pixel text-[length:clamp(0.95rem,8.6cqw,1.6rem)] leading-[1.02] whitespace-pre-line text-white uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.6),0_0_18px_rgb(0_0_0/0.6)]">
                  {rule.title}
                </span>
                <span className="mt-[5cqw] block text-[length:clamp(0.7rem,5.2cqw,0.9rem)] leading-snug text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.8)]">
                  {rule.body}
                </span>
              </span>
              <span className="absolute inset-x-[8cqw] bottom-[6cqw] flex justify-between font-mono text-[length:clamp(0.5rem,3.8cqw,0.66rem)] tracking-[0.14em] text-white/70 uppercase">
                <span>rule {n}</span>
                <span className="transition-colors group-hover:text-white">tap to flip ↻</span>
              </span>
              <ScratchCover
                n={n}
                revealed={revealed}
                onReveal={onReveal}
                onDragEnd={() => {
                  // the click that ends a drag arrives straight away; if none does, don't swallow a later one
                  consumeClickRef.current = true;
                  window.setTimeout(() => (consumeClickRef.current = false), 120);
                }}
              />
              {/* glare that follows the cursor */}
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.18),transparent_45%)] group-hover:opacity-100" />
            </span>

            {/* back: the rule, as code */}
            <span className="flip-face flip-back flex flex-col justify-between border border-cyan/50 bg-bg-raised p-[8cqw]">
              <span className="font-mono text-[length:clamp(0.5rem,3.8cqw,0.66rem)] tracking-[0.14em] text-fg-muted uppercase">
                rule_{n}.ts
              </span>
              <code className="block font-mono text-[length:clamp(0.5rem,4.6cqw,0.82rem)] leading-relaxed">
                {rule.code.map((line, i) => (
                  <span
                    key={i}
                    className={`block whitespace-pre ${line.trim().startsWith("//") || line.startsWith("#") ? "text-fg-subtle" : "text-phosphor"}`}
                  >
                    <span className="mr-[3cqw] inline-block w-[1.2em] text-right text-fg-subtle select-none">{i + 1}</span>
                    {line}
                  </span>
                ))}
              </code>
              <span className="flex items-center justify-between">
                <span className="font-pixel text-[length:clamp(0.55rem,4.2cqw,0.72rem)] text-cyan">✓ rule acknowledged</span>
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-fg-muted uppercase">↻</span>
              </span>
            </span>
          </span>
        </button>
      </div>
    </li>
  );
}

export function HouseRules() {
  const [flipped, setFlipped] = useState<boolean[]>(() => RULES.map(() => false));
  const [revealed, setRevealed] = useState<boolean[]>(() => RULES.map(() => false));
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const { unlock } = useAchievements();
  const row = useRef<HTMLOListElement>(null);
  // the five cards are dealt once, the first time the row scrolls into view
  const [dealt, setDealt] = useState(false);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setDealt(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const markSeen = (i: number) => setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  const flip = (i: number) => {
    setFlipped((f) => f.map((v, j) => (j === i ? !v : v)));
    markSeen(i);
  };
  const reveal = (i: number) => {
    setRevealed((r) => r.map((v, j) => (j === i ? true : v)));
    markSeen(i);
  };

  useEffect(() => {
    if (seen.size === RULES.length) unlock("vibe");
  }, [seen, unlock]);

  return (
    <section
      id="vibe"
      aria-labelledby="rules-title"
      className="flex h-[100svh] min-h-[min(30rem,100svh)] scroll-mt-0 flex-col pt-[4svh] pb-[3svh]"
    >
      <div className="container-site">
        <div>
          <h2 id="rules-title" className="font-pixel text-[length:clamp(1.5rem,min(4vw,6vh),3.4rem)] leading-[1.02] uppercase">
            The vibe,
            <br />
            <span className="text-cyan">in five wallpapers.</span>
          </h2>
        </div>
      </div>

      <ol
        ref={row}
        data-dealt={dealt}
        aria-label="House rules"
        className="deal [container-type:size] mt-[3svh] flex min-h-0 flex-1 snap-x snap-mandatory [scrollbar-width:none] items-center gap-4 overflow-x-auto [--cw:min(18rem,76cqw,calc(100cqh*0.5625))] lg:justify-center lg:overflow-visible lg:px-(--gutter) [&::-webkit-scrollbar]:hidden"
      >
        {/* phones: spacers let the first and last card sit in the middle of the screen */}
        <li aria-hidden className="w-[calc((100cqw-var(--cw))/2-0.5rem)] shrink-0 lg:hidden" />
        {RULES.map((rule, i) => (
          <RuleCard
            key={rule.title}
            rule={rule}
            index={i}
            flipped={flipped[i]}
            revealed={revealed[i]}
            onFlip={() => flip(i)}
            onReveal={() => reveal(i)}
          />
        ))}
        <li aria-hidden className="w-[calc((100cqw-var(--cw))/2-0.5rem)] shrink-0 lg:hidden" />
      </ol>
      <p aria-live="polite" className="container-site mt-[1.5svh] font-mono text-[0.72rem] tracking-[0.12em] text-fg-muted uppercase">
        {seen.size}/{RULES.length} revealed{seen.size === RULES.length ? " — vibe check passed ✓" : " — scratch the cards"}
      </p>
    </section>
  );
}
