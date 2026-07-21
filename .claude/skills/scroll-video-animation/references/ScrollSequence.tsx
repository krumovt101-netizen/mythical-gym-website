"use client";

/**
 * ScrollSequence — secção pinada com scrub de sequência de fotogramas.
 *
 * A secção tem `scrollLength` viewports de altura; o interior é sticky, por
 * isso o conteúdo fica preso enquanto o scroll a atravessa, e o progresso
 * (0..1) escolhe o fotograma desenhado num canvas em cover. O poster <img>
 * fica sempre por baixo do canvas: é o primeiro paint do SSR, o fallback de
 * `prefers-reduced-motion` e o de ecrãs pequenos — nunca há herói vazio nem
 * CLS.
 *
 * Espera fotogramas em `${base}/frame-001.webp` … (zero-padded a 3) e
 * `${base}/poster.webp`. Sem dependências de propósito: nada de GSAP nem
 * Lenis. Ver a skill scroll-video-animation para o pipeline completo.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  /** Caminho público da sequência, ex. "/media/sequences/hero". */
  base: string;
  frameCount: number;
  /** Altura da secção em viewports de scroll. 2–3 lê-se cinematográfico. */
  scrollLength?: number;
  /** Abaixo desta largura o canvas não entra e fica o poster. */
  minWidth?: number;
  posterAlt: string;
  /** true no herói: o poster é o LCP da página. */
  priority?: boolean;
  /** true nos capítulos abaixo da dobra: os fotogramas só descarregam quando
      a secção está a menos de um viewport de distância. */
  lazy?: boolean;
  /** Conteúdo por cima (título, CTA). */
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
  lazy = false,
  children,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // `active` só passa a true quando se sabe que o movimento é desejado: o SSR
  // e o primeiro paint mostram apenas o poster, e quem tem reduced-motion ou
  // um ecrã pequeno nunca descarrega fotograma nenhum.
  const [active, setActive] = useState(false);
  // Capítulos lazy só descarregam quando estão a menos de um viewport.
  const [near, setNear] = useState(!lazy);

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
    if (!lazy || near) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setNear(true),
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, near]);

  useEffect(() => {
    if (!active || !near) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | null)[] = Array(frameCount).fill(null);
    let current = 0;
    let raf = 0;
    let disposed = false;

    // Desenho em cover (object-fit: cover para canvas), ciente do DPR para
    // ficar nítido em retina sem servir ficheiros 2x.
    const draw = (index: number) => {
      // O fotograma carregado mais próximo, para o scrub nunca ficar em branco.
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
      if (raf) return; // no máximo um desenho por frame pintado
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = progressToFrame();
        if (next !== current) {
          current = next;
          draw(current);
        }
      });
    };

    // O primeiro fotograma entra já (substitui o poster); o resto com
    // concorrência limitada para 60+ pedidos não afogarem ligações lentas.
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
        img.onerror = () => resolve(); // falhou → fallback do mais próximo
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
  }, [active, near, base, frameCount]);

  return (
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Poster: primeiro paint do SSR + fallback de reduced-motion e mobile. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- a troca por canvas pede um img simples, dimensionado pelo contentor */}
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
