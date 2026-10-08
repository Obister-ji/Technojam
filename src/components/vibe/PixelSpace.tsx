"use client";

import { useEffect, useRef } from "react";
import { hash, paintScene, type Scene } from "@/lib/pixel";
import { useAchievements } from "./Achievements";

const SPARK = ["#3be3ff", "#a46bff", "#ff4d9d", "#ffffff"];
const STAR = ["#ffffff", "#ffffff", "#bfeeff", "#ffc4e1"];

interface Star {
  x: number;
  y: number;
  z: number;
  phase: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size?: number;
}

/** Comet trail colours, head to tail: the logo ribbon. */
const TRAIL = ["#ffffff", "#bff6ff", "#3be3ff", "#4d8bff", "#a46bff", "#ff4d9d"];
const TRAIL_LIFE = 0.45;

/* Easter egg: 11 clicks in a row on one small spot spells the founding year in stars. */
const DIGITS: Record<string, string[]> = {
  "2": ["111", "001", "111", "100", "111"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "5": ["111", "100", "111", "001", "111"],
};
const FLAG = ["#3be3ff", "#a46bff", "#ff4d9d"];
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

interface YearEgg {
  t: number;
  pts: { x: number; y: number; sx: number; sy: number; c: string }[];
}

const REPEL = 22;

/**
 * The hero sky: a dithered pixel planet rising over a field at night,
 * twinkling stars that drift with the cursor, the odd shooting star,
 * and sparks wherever you move or click. Rendered at ¼ resolution and
 * scaled up crisp, so it stays cheap. Pauses when off-screen.
 */
export function PixelSpace({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { unlock } = useAchievements();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let S = 4;
    // two layers so they can move at different speeds: the planet, and the grass in front of it
    let planet: HTMLCanvasElement | null = null;
    let layer: HTMLCanvasElement | null = null;
    let stars: Star[] = [];
    const sparks: Particle[] = [];
    let meteor: Particle | null = null;
    let nextMeteor = 2.5;
    let mx = 0.5;
    let my = 0.5;
    let tmx = 0.5;
    let tmy = 0.5;
    let raf = 0;
    let running = false;
    let clicks = 0;
    let streak = 0;
    let anchor = { x: 0, y: 0, t: -10 };
    let gTop = 0.84;
    let year: YearEgg | null = null;
    // cursor, in canvas pixels; `seen` is when it last moved
    let cx = -999;
    let cy = -999;
    let seen = -10;
    const trail: { x: number; y: number; t: number }[] = [];
    const rings: { x: number; y: number; r: number; life: number; color: string }[] = [];
    let last = performance.now();
    let t = 0;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      S = r.width < 640 ? 3 : 4;
      W = Math.ceil(r.width / S);
      H = Math.ceil(r.height / S);
      canvas.width = W;
      canvas.height = H;
      const portrait = H > W * 1.1;
      const groundTop = portrait ? 0.86 : 0.84;
      const figureX = portrait ? 0.62 : 0.6;
      gTop = groundTop;

      const scene: Scene = {
        sky: [],
        orb: {
          // phones: a smaller planet rising behind the grass, clear of the copy
          x: portrait ? 1.02 : 1.02,
          y: portrait ? 0.84 : 0.64,
          r: portrait ? 0.2 : 0.37,
          palette: ["#01040f", "#031233", "#072a66", "#0f4a9e", "#1f78d0", "#4fb4f0", "#a8e4ff", "#e6f8ff"],
          rim: "#3be3ff",
          clouds: true,
        },
        ground: { top: groundTop, palette: ["#020904", "#06210c", "#0d3d16", "#1d6b25", "#3fa83a", "#8be05a"], glowX: figureX },
        seed: 7,
      };
      planet = document.createElement("canvas");
      planet.width = W;
      planet.height = H;
      planet.getContext("2d")!.putImageData(paintScene(W, H, { ...scene, ground: undefined }), 0, 0);

      layer = document.createElement("canvas");
      layer.width = W;
      layer.height = H;
      const lctx = layer.getContext("2d")!;
      lctx.putImageData(paintScene(W, H, { ...scene, orb: undefined }), 0, 0);

      // A soft haze along the horizon so sky, planet and grass blend instead of meeting at a hard line.
      const gy = groundTop * H;
      const haze = lctx.createLinearGradient(0, gy - 14, 0, gy + 6);
      haze.addColorStop(0, "rgba(59,227,255,0)");
      haze.addColorStop(0.65, "rgba(110,220,190,0.22)");
      haze.addColorStop(1, "rgba(60,170,80,0)");
      lctx.fillStyle = haze;
      lctx.fillRect(0, gy - 14, W, 20);

      // You, at 2am, on the grass with a laptop.
      const fx = Math.round(figureX * W);
      const fy = Math.round(groundTop * H) + 2;
      lctx.fillStyle = "#05050b";
      lctx.fillRect(fx, fy - 6, 2, 2); // head
      lctx.fillRect(fx - 1, fy - 4, 4, 3); // body
      lctx.fillRect(fx - 1, fy - 1, 1, 2); // legs
      lctx.fillRect(fx + 2, fy - 1, 1, 2);
      lctx.fillStyle = "#3be3ff";
      lctx.fillRect(fx + 3, fy - 3, 2, 1); // laptop glow
      lctx.fillStyle = "rgba(59,227,255,0.35)";
      lctx.fillRect(fx + 2, fy - 4, 4, 3);

      stars = Array.from({ length: Math.round((W * H) / 70) }, (_, i) => ({
        x: hash(i, 1) * W,
        y: hash(i, 2) * H * groundTop,
        z: 0.15 + hash(i, 3) * 0.85,
        phase: hash(i, 4) * Math.PI * 2,
        color: STAR[Math.floor(hash(i, 5) * STAR.length)],
      }));
      draw();
    };

    const startYear = (x: number, y: number) => {
      const ox = Math.min(W - 18, Math.max(18, x));
      const oy = Math.min(gTop * H - 16, Math.max(8, y - 12));
      const pts: YearEgg["pts"] = [];
      [..."2015"].forEach((ch, di) =>
        DIGITS[ch].forEach((row, r) =>
          [...row].forEach((b, c) => {
            if (b !== "1") return;
            for (let k = 0; k < 4; k++) {
              const tx = ox - 15 + di * 8 + c * 2 + (k % 2);
              const ty = oy - 5 + r * 2 + (k >> 1);
              const star = stars[Math.floor(Math.random() * stars.length)];
              pts.push({ x: tx, y: ty, sx: star?.x ?? tx, sy: star?.y ?? ty, c: FLAG[Math.min(2, Math.floor(((tx - ox + 15) / 31) * 3))] });
            }
          }),
        ),
      );
      year = { t, pts };
    };

    const stepEggs = () => {
      if (year && t - year.t > 2.9) {
        // scatter back into the sky
        for (const q of year.pts)
          sparks.push({ x: q.x, y: q.y, vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60, life: 0.9, color: q.c });
        year = null;
      }
    };

    /** 0 → 1 as the hero hands over to screen 2 (set as --p by the hero). */
    const pin = canvas.closest<HTMLElement>("[data-pin]");
    const scrollLift = () => (pin && !reduce ? Number(pin.style.getPropertyValue("--p")) || 0 : 0);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const lift = scrollLift();
      const px = (mx - 0.5) * -16;
      const py = (my - 0.5) * -10 - lift * H * 0.06;
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * (0.5 + s.z * 1.8) + s.phase);
        ctx.globalAlpha = twinkle * (0.3 + s.z * 0.7);
        ctx.fillStyle = s.color;
        let x = (s.x + px * s.z + W) % W;
        let y = s.y + py * s.z;
        const near = t - seen < 1.2 ? Math.hypot(x - cx, y - cy) : REPEL;
        if (near < REPEL) {
          // stars scatter away from the cursor and flare up
          const k = 1 - near / REPEL;
          x += ((x - cx) / (near || 1)) * k * 7;
          y += ((y - cy) / (near || 1)) * k * 7;
          ctx.globalAlpha = Math.min(1, ctx.globalAlpha + k);
          ctx.fillStyle = k > 0.5 ? "#bff6ff" : s.color;
        }
        x = Math.round(x);
        y = Math.round(y);
        if (s.z > 0.965) {
          // bright star: a little plus
          ctx.fillRect(x - 1, y, 3, 1);
          ctx.fillRect(x, y - 1, 1, 3);
        } else ctx.fillRect(x, y, 1, 1);
      }

      if (meteor) {
        for (let k = 0; k < 10; k++) {
          ctx.globalAlpha = meteor.life * (1 - k / 10);
          ctx.fillStyle = k < 2 ? "#ffffff" : "#bfeeff";
          ctx.fillRect(Math.round(meteor.x - meteor.vx * k * 0.012), Math.round(meteor.y - meteor.vy * k * 0.012), 1, 1);
        }
      }

      ctx.globalAlpha = 1;
      // scrolling: the planet rises, the grass sinks away below
      if (planet) ctx.drawImage(planet, 0, Math.round(-lift * H * 0.14));
      if (layer) ctx.drawImage(layer, 0, Math.round(lift * H * 0.4));

      ctx.globalCompositeOperation = "lighter";

      // "2015", assembled from stars
      if (year) {
        const age = t - year.t;
        const k = ease(age / 1.1);
        for (const q of year.pts) {
          ctx.globalAlpha = age > 1.1 ? 0.75 + 0.25 * Math.sin(t * 12 + q.x) : 0.4 + k * 0.6;
          ctx.fillStyle = q.c;
          ctx.fillRect(Math.round(q.sx + (q.x - q.sx) * k), Math.round(q.sy + (q.y - q.sy) * k), 1, 1);
        }
      }

      // shockwave rings from clicks
      for (const r of rings) {
        ctx.globalAlpha = Math.max(0, r.life);
        ctx.fillStyle = r.color;
        const steps = Math.max(12, Math.round(r.r * 6));
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          ctx.fillRect(Math.round(r.x + Math.cos(a) * r.r), Math.round(r.y + Math.sin(a) * r.r), 1, 1);
        }
      }

      // comet trail: a pixel line through recent cursor positions
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = (t - b.t) / TRAIL_LIFE;
        if (age >= 1) continue;
        const along = 1 - i / trail.length; // 0 at the head
        ctx.globalAlpha = (1 - age) * 0.9;
        ctx.fillStyle = TRAIL[Math.min(TRAIL.length - 1, Math.floor(along * TRAIL.length))];
        const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
        const thick = along < 0.35 && age < 0.5 ? 2 : 1;
        for (let k = 0; k <= n; k++) {
          ctx.fillRect(Math.round(a.x + ((b.x - a.x) * k) / n), Math.round(a.y + ((b.y - a.y) * k) / n), thick, thick);
        }
      }

      // the cursor star itself
      if (t - seen < 1.2) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 10);
        ctx.globalAlpha = (1 - (t - seen) / 1.2) * pulse;
        ctx.fillStyle = "#bff6ff";
        ctx.fillRect(Math.round(cx) - 2, Math.round(cy), 5, 1);
        ctx.fillRect(Math.round(cx), Math.round(cy) - 2, 1, 5);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.round(cx), Math.round(cy), 1, 1);
      }

      for (const p of sparks) {
        // twinkle as they fade
        ctx.globalAlpha = Math.max(0, p.life) * (0.65 + 0.35 * Math.sin(t * 30 + p.x));
        ctx.fillStyle = p.color;
        const size = p.size ?? 1;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), size, size);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - dt * 1.5;
        p.vy = p.vy * (1 - dt * 1.5) + 18 * dt;
        p.life -= dt * 1.1;
        if (p.life <= 0) sparks.splice(i, 1);
      }
      while (trail.length && t - trail[0].t > TRAIL_LIFE) trail.shift();
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += dt * 60 * (0.4 + r.life);
        r.life -= dt * 1.6;
        if (r.life <= 0) rings.splice(i, 1);
      }

      stepEggs();
      nextMeteor -= dt;
      if (!meteor && nextMeteor <= 0) {
        meteor = {
          x: Math.random() * W * 0.6,
          y: Math.random() * H * 0.25,
          vx: 160 + Math.random() * 80,
          vy: 60 + Math.random() * 40,
          life: 1,
          color: "",
        };
        nextMeteor = 4 + Math.random() * 6;
      }
      if (meteor) {
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        meteor.life -= dt * 0.9;
        if (meteor.life <= 0 || meteor.x > W) meteor = null;
      }

      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / S,
        y: (e.clientY - r.top) / S,
        fx: (e.clientX - r.left) / r.width,
        fy: (e.clientY - r.top) / r.height,
      };
    };

    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      tmx = p.fx;
      tmy = p.fy;
      if (reduce) return;
      const speed = Math.hypot(p.x - cx, p.y - cy);
      cx = p.x;
      cy = p.y;
      seen = t;
      trail.push({ x: p.x, y: p.y, t });
      if (trail.length > 40) trail.shift();
      // faster swipes throw more sparks
      const count = Math.min(5, 1 + Math.floor(speed / 3));
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: p.x + (Math.random() - 0.5) * 3,
          y: p.y + (Math.random() - 0.5) * 3,
          vx: (Math.random() - 0.5) * 40,
          vy: (Math.random() - 0.7) * 40,
          life: 0.7 + Math.random() * 0.6,
          color: SPARK[Math.floor(Math.random() * SPARK.length)],
          size: Math.random() < 0.25 ? 2 : 1,
        });
      }
      if (sparks.length > 400) sparks.splice(0, sparks.length - 400);
    };

    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button, input, [role=button]")) return;
      const p = toLocal(e);
      if (!reduce) {
        for (let i = 0; i < 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          const v = 30 + Math.random() * 70;
          sparks.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 10,
            life: 1 + Math.random() * 0.4,
            color: SPARK[i % SPARK.length],
            size: i % 4 === 0 ? 2 : 1,
          });
        }
        rings.push({ x: p.x, y: p.y, r: 2, life: 1, color: "#3be3ff" });
        rings.push({ x: p.x, y: p.y, r: 0, life: 0.8, color: "#ff4d9d" });
      }
      clicks += 1;
      if (clicks === 10) unlock("clicker");
      // the streak only grows while clicks keep landing near the first one, without long pauses
      const near = Math.hypot(p.x - anchor.x, p.y - anchor.y) * S <= 36 && t - anchor.t < 1.5;
      streak = near ? streak + 1 : 1;
      anchor = near ? { ...anchor, t } : { x: p.x, y: p.y, t };
      if (streak === 11) {
        // the founding year; then the count starts over so it can be found again
        unlock("est");
        if (!reduce) startYear(p.x, p.y);
        streak = 0;
      }
    };

    let pending = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(build);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onLeave = () => (seen = -10);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [unlock]);

  return <canvas ref={ref} aria-hidden className={`pixelated ${className ?? ""}`} />;
}
