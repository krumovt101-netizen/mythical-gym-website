"use client";

/**
 * ScrollSequence — pinned, scroll-scrubbed image-sequence section.
 *
 * The section is `scrollLength` viewports tall; its inner viewport is sticky,
 * so the content pins while the user scrolls through it, and scroll progress
 * (0..1) picks a frame drawn onto a cover-fit canvas. The poster <img> is
 * always rendered under the canvas: it is the SSR-visible first paint, the
 * reduced-motion fallback, and the small-screen fallback, so there is never a
 * blank hero and never CLS.
 *
 * Expects frames at `${base}/frame-001.webp` … zero-padded to 3, plus
 * `${base}/poster.webp`. Dependency-free on purpose: no GSAP, no Lenis.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  /** Public path of the sequence dir, e.g. "/media/sequences/hero". */
  base: string;
  frameCount: number;
  /** Section height in viewport-heights of scroll. 2–3 feels cinematic. */
  scrollLength?: number;
  /** Below this viewport width the canvas is skipped and the poster shows. */
  minWidth?: number;
  posterAlt: string;
  /** true when this section is the page hero: the poster is the LCP. */
  priority?: boolean;
  /** Overlay content (headline, CTA). Rendered above the canvas. */
  children?: ReactNode;
  className?: string;
}

const pad3 = (n: number) => String(n).padStart(3, "0");

export default function ScrollSequence({
  base,
  frameCount,
  scrollLength = 2.5,
  minWidth = 768,
  posterAlt,
  priority = false,
  children,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // `active` stays false until we know motion is wanted: SSR and first paint
  // show only the poster, so reduced-motion/mobile users never fetch frames.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () =>
      setActive(!reduced.matches && window.innerWidth >= minWidth);
    decide();
    reduced.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => {
      reduced.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
    };
  }, [minWidth]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | null)[] = Array(frameCount).fill(null);
    let current = 0;
    let raf = 0;
    let disposed = false;

    // Cover-fit draw (object-fit: cover for canvas), DPR-aware so frames stay
    // sharp on retina without shipping 2x-sized files.
    const draw = (index: number) => {
      // Nearest loaded frame, so scrubbing never blanks while loading.
      let img = frames[index];
      if (!img) {
        for (let d = 1; d < frameCount && !img; d++) {
          img = frames[index - d] ?? frames[index + d] ?? null;
        }
        if (!img) return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight,
      );
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(
        img,
        (canvas.width - dw) / 2,
        (canvas.height - dh) / 2,
        dw,
        dh,
      );
    };

    const progressToFrame = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      return Math.round(progress * (frameCount - 1));
    };

    const onScroll = () => {
      if (raf) return; // rAF-throttle: at most one draw per painted frame
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = progressToFrame();
        if (next !== current) {
          current = next;
          draw(current);
        }
      });
    };

    // First frame immediately (it replaces the poster), rest with limited
    // concurrency so 60+ requests don't stampede slower connections.
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!disposed) {
            frames[i] = img;
            if (i === current || frames[current] === null) draw(current);
          }
          resolve();
        };
        img.onerror = () => resolve(); // missing frame → nearest-loaded fallback
        img.src = `${base}/frame-${pad3(i + 1)}.webp`;
      });

    load(0).then(async () => {
      const queue = Array.from({ length: frameCount - 1 }, (_, i) => i + 1);
      const workers = Array.from({ length: 6 }, async () => {
        while (queue.length && !disposed) await load(queue.shift()!);
      });
      await Promise.all(workers);
    });

    current = progressToFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, base, frameCount]);

  return (
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Poster: SSR first paint + reduced-motion + small-screen fallback. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- canvas swap needs a plain img, sized by its container */}
        <img
          src={`${base}/poster.webp`}
          alt={posterAlt}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {active && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </section>
  );
}
