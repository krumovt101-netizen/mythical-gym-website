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
 * SUAVIDADE, e são duas peças distintas:
 * - O scrub tem INÉRCIA: a posição desenhada persegue o alvo do scroll num
 *   ciclo rAF (lerp, k≈0.16) em vez de saltar 1:1 com a roda. Fotogramas a
 *   12 fps lidos diretamente do scroll dão degraus visíveis; com a
 *   perseguição, o filme acelera e assenta como uma cabeça de reprodução
 *   com peso. Quem para de fazer scroll vê o plano assentar, não congelar.
 * - As BORDAS do pin dissolvem: uma cortina cor de vault funde o plano nos
 *   primeiros/últimos 12% de progresso (`edgeFade`), para a secção entrar e
 *   sair como um fade de filme e não como um corte seco no unpin.
 *
 * Espera fotogramas em `${base}/frame-001.webp` … (zero-padded a 3) e
 * `${base}/poster.webp`. Sem dependências de propósito: nada de GSAP nem
 * Lenis. Ver a skill scroll-video-animation para o pipeline completo.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  /** Caminho público da sequência, ex. "/media/sequences/abertura". */
  base: string;
  frameCount: number;
  /** Altura da secção em viewports de scroll. 2–3 lê-se cinematográfico. */
  scrollLength?: number;
  /** Abaixo desta largura o canvas não entra e fica o poster. */
  minWidth?: number;
  posterAlt: string;
  /** true no herói: o poster é o LCP da página. */
  priority?: boolean;
  /** true nos planos abaixo da dobra: os fotogramas só descarregam quando
      a secção está a menos de um viewport de distância. */
  lazy?: boolean;
  /** Dissolve nas bordas do pin: "both" nos planos a meio da página,
      "out" no herói (que não pode acordar tapado), "none" desliga. */
  edgeFade?: "none" | "out" | "both";
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
  edgeFade = "none",
  children,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  // `active` só passa a true quando se sabe que o movimento é desejado: o SSR
  // e o primeiro paint mostram apenas o poster, e quem tem reduced-motion ou
  // um ecrã pequeno nunca descarrega fotograma nenhum.
  const [active, setActive] = useState(false);
  // Planos lazy só descarregam quando estão a menos de um viewport.
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
    let current = -1; // último índice desenhado
    let displayed = 0; // posição da cabeça de reprodução, em fotogramas (float)
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

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      return scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : 0;
    };

    // A cortina de dissolve nas bordas do pin. Opacidade direta no estilo,
    // fora do React: muda a cada tick e um setState aqui seria um re-render
    // por fotograma.
    const updateCurtain = (p: number) => {
      const el = curtainRef.current;
      if (!el) return;
      let o = 0;
      if (edgeFade === "both") o = Math.max(1 - p / 0.12, (p - 0.88) / 0.12);
      else if (edgeFade === "out") o = (p - 0.88) / 0.12;
      el.style.opacity = String(Math.min(1, Math.max(0, o)));
    };

    /**
     * O ciclo de perseguição: corre enquanto a cabeça não assentou no alvo,
     * e morre sozinho quando assenta (zero trabalho em idle). Cada evento de
     * scroll só precisa de o acordar.
     */
    const tick = () => {
      raf = 0;
      if (disposed) return;
      const p = progress();
      updateCurtain(p);
      const target = p * (frameCount - 1);
      displayed += (target - displayed) * 0.16;
      if (Math.abs(target - displayed) < 0.04) displayed = target;
      const idx = Math.round(displayed);
      if (idx !== current) {
        current = idx;
        draw(idx);
      }
      if (displayed !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      current = -1; // força redesenho com o novo tamanho de canvas
      wake();
    };

    // O primeiro fotograma entra já (substitui o poster); o resto com
    // concorrência limitada para 60+ pedidos não afogarem ligações lentas.
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!disposed) {
            frames[i] = img;
            // Chegou o fotograma onde a cabeça está (ou ainda não há nada
            // desenhado): força um redesenho no próximo tick.
            if (i === current || current < 0 || frames[current] === null) {
              current = -1;
              wake();
            }
          }
          resolve();
        };
        img.onerror = () => resolve(); // falhou → fallback do mais próximo
        img.src = `${base}/frame-${pad3(i + 1)}.webp`;
      });

    // A cabeça acorda já na posição certa: entrar a meio da página não pode
    // disparar uma perseguição desde o fotograma 1.
    displayed = progress() * (frameCount - 1);
    current = Math.round(displayed);

    load(0).then(async () => {
      const queue = Array.from({ length: frameCount - 1 }, (_, i) => i + 1);
      const workers = Array.from({ length: 6 }, async () => {
        while (queue.length && !disposed) await load(queue.shift()!);
      });
      await Promise.all(workers);
    });

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
    };
  }, [active, near, base, frameCount, edgeFade]);

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
        {active && near && edgeFade !== "none" && (
          <div
            ref={curtainRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-vault"
            style={{ opacity: 0 }}
          />
        )}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </section>
  );
}
