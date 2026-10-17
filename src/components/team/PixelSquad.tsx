"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ART_H, ART_W, paintHeroArt, pixelateImage, type ArtId, type ArtImage } from "@/lib/heroArt";

interface Hero {
  key: string;
  /** a drawn portrait, or an illustration to pixelate */
  art: ArtId | ArtImage;
  name: string;
  alias: string;
  rank: string;
  tagline: string;
  photo: string;
  /** where the face sits in the source photo (fractions) and how far to zoom in on it */
  face: [number, number];
  zoom: number;
  /** light portraits get dark type and a pale fade instead of white type on a dark one */
  tone: "dark" | "light";
}

const HEROES: Hero[] = [
  {
    key: "iron-man",
    art: { src: "/team/heroes/art/iron-man.webp", crop: [0.042, 0.08, 0.915, 0.9], colors: 14 },
    name: "Deepankar Patel",
    alias: "Iron Man",
    rank: "Club Head",
    tagline: "Genius, builder, club head. Runs TechnoJam on an arc reactor and about three hours of sleep.",
    photo: "/team/heroes/deepankar-patel.webp",
    face: [0.48, 0.32],
    zoom: 3,
    tone: "dark",
  },
  {
    key: "bane",
    art: { src: "/team/heroes/art/bane.webp", crop: [0.27, 0, 0.538, 0.74], colors: 5, width: 54 },
    name: "Anshul Tripathi",
    alias: "Bane",
    rank: "Senior · OG",
    tagline: "The OG. Was here before the CI pipeline and will be here after it breaks. Never asks permission to ship.",
    photo: "/team/heroes/anshul-tripathi.webp",
    face: [0.49, 0.3],
    zoom: 2.3,
    tone: "dark",
  },
  {
    key: "ronaldo",
    art: "ronaldo",
    name: "Pranav Raj",
    alias: "Ronaldo",
    rank: "Senior",
    tagline: "Never misses a deadline — or a penalty. Every merged PR gets a SIUUU.",
    photo: "/team/heroes/pranav-raj.webp",
    face: [0.62, 0.56],
    zoom: 1.7,
    tone: "light",
  },
  {
    key: "superman",
    art: { src: "/team/heroes/art/superman.webp", crop: [0.093, 0.02, 0.815, 0.96], colors: 7, width: 54, ink: true },
    name: "Rohit Joshi",
    alias: "Superman",
    rank: "Senior",
    tagline: "Faster than a failing build. Flies in when a junior is stuck, vanishes before the thank-you.",
    photo: "/team/heroes/rohit-joshi.webp",
    face: [0.52, 0.33],
    zoom: 2.4,
    tone: "dark",
  },
  {
    key: "baymax",
    art: "baymax",
    name: "Aditya Gupta",
    alias: "Baymax",
    rank: "3rd Year · Senior",
    tagline: "Your personal debugging companion. On a scale of one to ten, how bad is the stack trace?",
    photo: "/team/heroes/aditya-gupta.webp",
    face: [0.48, 0.28],
    zoom: 2,
    tone: "light",
  },
  {
    key: "psyduck",
    art: "psyduck",
    name: "Dakshita Singh",
    alias: "Psyduck",
    rank: "Senior · 2nd Year",
    tagline: "DSA | Python | SQL | ML enthusiast. Stares at a problem until it hurts — then cracks it anyway.",
    photo: "/team/heroes/dakshita-singh.webp",
    face: [0.477, 0.648],
    zoom: 4.8,
    tone: "dark",
  },
  {
    key: "virat",
    art: { src: "/team/heroes/art/virat.webp", crop: [0.15, 0.16, 0.82, 0.82], background: "#e3261f", colors: 12 },
    name: "Pradumn Tiwari",
    alias: "Virat Kohli",
    rank: "Senior · 2nd Year",
    tagline: "Backend + AI & Systems. Python, Django and FastAPI up top; C and C++ underneath.",
    photo: "/team/heroes/pradumn-tiwari.webp",
    face: [0.52, 0.42],
    zoom: 1.45,
    tone: "dark",
  },
  {
    key: "patrick-jane",
    art: { src: "/team/heroes/art/patrick-jane.webp", crop: [0.16, 0, 0.7875, 1], colors: 14 },
    name: "Anish Kumar Gupta",
    alias: "Patrick Jane",
    rank: "Senior · 2nd Year",
    tagline:
      "Mostly DSA. Frontends in HTML, CSS and JavaScript, backends in Java, a bit of DBMS — and reads your bug before you explain it.",
    photo: "/team/heroes/anish-kumar-gupta.webp",
    face: [0.5, 0.37],
    zoom: 2,
    tone: "dark",
  },
];

/** The wallpaper: a full-card pixel illustration, painted once and scaled up crisp. */
function ArtCanvas({ art }: { art: ArtId | ArtImage }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    if (typeof art === "string") {
      ctx.putImageData(paintHeroArt(art), 0, 0);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      const data = pixelateImage(img, art);
      ctx.canvas.width = data.width;
      ctx.canvas.height = data.height;
      ctx.putImageData(data, 0, 0);
    };
    img.src = art.src;
  }, [art]);
  return <canvas ref={ref} width={ART_W} height={ART_H} aria-hidden className="absolute inset-0 h-full w-full pixelated" />;
}

/** The real photo, cropped square around the face and drawn sharp at device resolution. */
function Photo({ hero }: { hero: Hero }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = new window.Image();
    img.onload = () => {
      const size = Math.round(canvas.clientWidth * Math.min(2, window.devicePixelRatio || 1)) || 480;
      canvas.width = size;
      canvas.height = size;
      const side = Math.min(img.naturalWidth, img.naturalHeight) / hero.zoom;
      const sx = Math.min(Math.max(hero.face[0] * img.naturalWidth - side / 2, 0), img.naturalWidth - side);
      const sy = Math.min(Math.max(hero.face[1] * img.naturalHeight - side / 2, 0), img.naturalHeight - side);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    };
    img.src = hero.photo;
  }, [hero]);
  return <canvas ref={ref} role="img" aria-label={hero.name} className="block aspect-square w-full" />;
}

function HeroCard({ hero, index }: { hero: Hero; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  const n = String(index + 1).padStart(2, "0");
  const light = hero.tone === "light";

  const move = (e: PointerEvent) => {
    const el = tilt.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
  };
  const leave = () => {
    tilt.current?.style.setProperty("--rx", "0deg");
    tilt.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <li
      style={{ ["--i" as string]: index }}
      className="pcard w-[min(17rem,74vw)] shrink-0 snap-center xl:w-[calc((100%-3rem)/4)]"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div
        ref={tilt}
        className="[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-300 ease-out"
      >
        <button
          type="button"
          id={hero.key}
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={`${hero.alias} — flip to see ${hero.name}`}
          data-flipped={flipped}
          className="flip @container block aspect-[9/16] w-full text-left"
        >
          <span className="flip-inner block">
            {/* front: the illustration */}
            <span className="flip-face block overflow-hidden border border-line-strong bg-bg-raised shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]">
              <ArtCanvas art={hero.art} />
              <span
                className={`absolute inset-0 ${
                  light
                    ? "bg-[linear-gradient(to_bottom,transparent_62%,rgb(255_255_255/0.7)_82%,rgb(255_255_255/0.92))]"
                    : "bg-[linear-gradient(to_bottom,transparent_68%,rgb(0_0_0/0.55)_84%,rgb(0_0_0/0.85))]"
                }`}
              />
              <span className={`absolute inset-x-0 bottom-[14cqw] block px-[8cqw] ${light ? "text-[#0d1020]" : "text-white"}`}>
                <span
                  className={`block font-pixel text-[length:clamp(1.1rem,11cqw,2rem)] leading-[1.02] uppercase ${
                    light ? "" : "[text-shadow:0_2px_0_rgb(0_0_0/0.6),0_0_18px_rgb(0_0_0/0.6)]"
                  }`}
                >
                  {hero.alias}
                </span>
                <span
                  className={`mt-[2.5cqw] block font-mono text-[length:clamp(0.55rem,4cqw,0.75rem)] font-semibold tracking-[0.14em] uppercase ${light ? "text-[#0b5a8a]" : "text-cyan"}`}
                >
                  {hero.rank}
                </span>
              </span>
              <span
                className={`absolute inset-x-[8cqw] bottom-[6cqw] flex justify-between font-mono text-[length:clamp(0.5rem,3.8cqw,0.66rem)] tracking-[0.14em] uppercase ${light ? "text-[#0d1020]/70" : "text-white/70"}`}
              >
                <span>hero {n}</span>
                <span>flip ↻</span>
              </span>
            </span>

            {/* back: the person, as pixels */}
            <span className="flip-face flip-back flex flex-col justify-between border border-cyan/50 bg-bg-raised p-[8cqw]">
              <span className="font-mono text-[length:clamp(0.5rem,3.8cqw,0.66rem)] tracking-[0.14em] text-fg-muted uppercase">
                hero_{n}.ts
              </span>
              <span className="mt-[3cqw] block border-2 border-cyan/60 p-[1.5cqw]">
                <Photo hero={hero} />
              </span>
              <span className="mt-[4cqw] block">
                <span className="block font-pixel text-[length:clamp(0.85rem,8cqw,1.4rem)] leading-[1.05] text-white uppercase">
                  {hero.name}
                </span>
                <span className="mt-[1.5cqw] block font-mono text-[length:clamp(0.5rem,3.8cqw,0.68rem)] tracking-[0.12em] text-phosphor uppercase">
                  {`class: ${hero.rank}`}
                </span>
              </span>
              <span className="mt-[3cqw] block font-mono text-[length:clamp(0.55rem,4cqw,0.78rem)] leading-snug text-fg-muted">{`// ${hero.tagline}`}</span>
              <span className="mt-[3cqw] flex items-center justify-between">
                <span className="font-pixel text-[length:clamp(0.55rem,4.2cqw,0.72rem)] text-cyan">✓ identity revealed</span>
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-fg-muted uppercase">↻</span>
              </span>
            </span>
          </span>
        </button>
      </div>
    </li>
  );
}

export function PixelSquad() {
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="heroes-title" className="container-site">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <h2 id="heroes-title" className="font-pixel text-[length:clamp(1.5rem,4vw,3.2rem)] leading-[1.02] uppercase">
          The hero squad,
          <br />
          <span className="text-cyan">in eight cards.</span>
        </h2>
        <p className="max-w-sm text-fg-muted">
          Every hero has a secret identity. Hover a card — or tap it — to see who&apos;s under the mask.
        </p>
      </div>

      <ol
        ref={row}
        data-dealt={dealt}
        aria-label="The hero squad"
        className="deal mt-10 flex snap-x snap-mandatory [scrollbar-width:none] items-start gap-4 overflow-x-auto pb-4 xl:flex-wrap xl:justify-center xl:gap-y-6 xl:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {HEROES.map((h, i) => (
          <HeroCard key={h.key} hero={h} index={i} />
        ))}
      </ol>
    </section>
  );
}
