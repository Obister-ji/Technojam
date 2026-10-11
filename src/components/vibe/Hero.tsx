"use client";

import { useEffect, useRef, useState } from "react";
import { PixelSpace } from "./PixelSpace";

const WORDS = ["weird stuff.", "at 2am.", "with friends.", "in public.", "then ship it."];

/** Types a word, waits, deletes it, moves on. Static first word without JS or with reduced motion. */
function Typer() {
  const [text, setText] = useState(WORDS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let word = 0;
    let len = WORDS[0].length;
    let deleting = true;
    let timer = window.setTimeout(function tick() {
      if (deleting) {
        len -= 1;
        if (len === 0) {
          deleting = false;
          word = (word + 1) % WORDS.length;
        }
      } else {
        len += 1;
      }
      setText(WORDS[word].slice(0, len));
      const done = !deleting && len === WORDS[word].length;
      if (done) deleting = true;
      timer = window.setTimeout(tick, done ? 2200 : deleting ? 45 : 85);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <span aria-hidden>
        {text}
        <span className="caret ml-2 inline-block h-[0.7em] w-[0.32em] translate-y-[0.02em] bg-pulse" />
      </span>
      <span className="sr-only">{WORDS.join(" ")}</span>
    </>
  );
}

export function Hero() {
  const pin = useRef<HTMLElement>(null);

  /*
   * Screen 1 → screen 2 as one move. A single scroll gesture (wheel, swipe, ↓, Page Down,
   * Space) on the opening screen plays the whole transition on its own — layers drift apart
   * while the page glides to the next section — instead of following every notch of the
   * wheel. Scrolling up from the top of screen 2 plays it back. --p (0 → 1) drives the art.
   */
  useEffect(() => {
    const el = pin.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const DURATION = 1100;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const target = () => el.offsetTop + el.offsetHeight;
    const setP = (p: number) => el.style.setProperty("--p", p.toFixed(4));
    let animating = false;
    let cooldownUntil = 0;
    let frame = 0;

    const play = (down: boolean) => {
      animating = true;
      const from = window.scrollY;
      const to = down ? target() : 0;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const k = ease(t);
        window.scrollTo({ top: from + (to - from) * k, behavior: "instant" });
        setP(down ? k : 1 - k);
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          animating = false;
          // trackpads keep sending momentum for a moment; don't let it trigger a second move
          cooldownUntil = performance.now() + 450;
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const atTop = () => window.scrollY < 8;
    const atScreen2 = () => Math.abs(window.scrollY - target()) < 8;
    /** Returns true if the gesture was taken over. */
    const handle = (down: boolean) => {
      if (animating || performance.now() < cooldownUntil) return animating || atTop() || atScreen2();
      const go = down ? atTop() : atScreen2();
      if (go) play(down);
      return go;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2 || e.ctrlKey) return;
      if (handle(e.deltaY > 0)) e.preventDefault();
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < 24) return;
      if (handle(dy > 0)) e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as Element | null)?.closest?.("input, textarea, select, [contenteditable], dialog");
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if ((down || up) && handle(down)) e.preventDefault();
    };

    // Dragging the scrollbar (or anything else) still keeps the art in step with the page.
    const onScroll = () => {
      if (!animating) setP(Math.min(1, Math.max(0, window.scrollY / target())));
    };

    onScroll();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    // One screen. A scroll gesture here plays the move to screen 2 (see above).
    <section ref={pin} data-pin aria-labelledby="hero-title" className="relative">
      {/* touch-pan-y: up/down still scrolls the page, but sideways finger drags reach the sky and draw the trail */}
      <div className="relative isolate h-[100svh] min-h-[min(32rem,100svh)] touch-pan-y overflow-hidden">
        <PixelSpace className="absolute inset-0 -z-10 h-full w-full" />
        {/* keeps copy readable where it crosses the planet on narrow screens */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(5_5_11/0.75)_0%,rgb(5_5_11/0.35)_55%,transparent_75%)] md:bg-none"
        />

        <div
          className="container-site flex h-full flex-col justify-center pt-(--nav-h) pb-[17svh] will-change-transform [@media(max-height:34rem)]:pt-14 [@media(max-height:34rem)]:pb-[14svh]"
          style={{ transform: "translateY(calc(var(--p, 0) * -24svh))", opacity: "calc(1 - var(--p, 0) * 1.5)" }}
        >
          <div className="max-w-6xl">
            {/* sized to the screen's height too, and kept to one line, so nothing jumps or overflows */}
            <h1
              id="hero-title"
              className="font-pixel text-[length:clamp(1.7rem,min(11.5vw_-_0.2rem,12.5vh),7rem)] leading-[1.08] uppercase glow lg:text-[length:clamp(1.7rem,min(7.5vw,12.5vh),7rem)] [@media(max-height:34rem)]:!text-[length:clamp(1.5rem,11vh,3.2rem)]"
            >
              <span className="rise block">We build</span>
              <span className="rise block min-h-[1.08em] whitespace-nowrap text-cyan" style={{ ["--rise-delay" as string]: "120ms" }}>
                <Typer />
              </span>
            </h1>

            <p
              className="rise mt-[clamp(0.75rem,2.2vh,1.25rem)] max-w-md text-[length:clamp(0.9rem,min(1.05vw,2vh),1rem)] leading-relaxed text-fg/85"
              style={{ ["--rise-delay" as string]: "260ms" }}
            >
              TechnoJam is a student tech club and a community for curious people. Hackathons, open source, robots, AI and games —
              that&apos;s our stuff.
            </p>
            <p
              className="rise mt-[clamp(0.75rem,2vh,1.25rem)] text-[length:clamp(0.9rem,min(1.05vw,2vh),1rem)] leading-snug font-medium [@media(max-height:30rem)]:hidden"
              style={{ ["--rise-delay" as string]: "360ms" }}
            >
              Where others gatekeep,
              <br />
              <span className="bg-[linear-gradient(90deg,#3be3ff,#4d8bff_45%,#8b7bff_75%,#ff6f9a)] bg-clip-text text-transparent">
                be the open source.
              </span>
            </p>
          </div>
        </div>

        {/* grass fades into the night below instead of stopping at an edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[11svh] bg-[linear-gradient(to_bottom,transparent,rgb(5_5_11/0.55)_45%,var(--color-bg))]"
        />
        {/* the stage dims a little as it hands over to screen 2 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: "calc((var(--p, 0) - 0.6) * 1.1)" }} />
      </div>
    </section>
  );
}
