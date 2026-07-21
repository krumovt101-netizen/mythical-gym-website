"use client";

/**
 * O RELÓGIO DO DIA. O mostrador fixo à direita que percorre 05:30→23:00 com
 * o scroll da homepage: é a barra de progresso da narrativa, o conceito do
 * HUD do build estático na sua primeira execução real (e o equivalente da
 * casa ao contador de profundidade de um site de expedição).
 *
 * É cromo narrativo e não um horário publicado: o horário verdadeiro
 * continua a viver em site.ts e no rodapé. Decorativo para leitores de ecrã
 * (aria-hidden), escondido em ecrãs pequenos e com prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";

const START = 5.5 * 60; // 05:30, em minutos
const END = 23 * 60; // 23:00

export default function DayClock({ endId }: { endId: string }) {
  const [minutes, setMinutes] = useState(START);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () =>
      setVisible(!reduced.matches && window.innerWidth >= 768);
    decide();
    reduced.addEventListener("change", decide);
    window.addEventListener("resize", decide);

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        // O dia acaba onde acaba o último capítulo, não onde acaba a página:
        // o rodapé fica fora da narrativa.
        const end = document.getElementById(endId);
        if (!end) return;
        const endBottom = end.getBoundingClientRect().bottom + window.scrollY;
        const total = endBottom - window.innerHeight;
        const p =
          total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        setMinutes(Math.round(START + p * (END - START)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      reduced.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
      window.removeEventListener("scroll", onScroll);
    };
  }, [endId]);

  if (!visible) return null;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  const progress = (minutes - START) / (END - START);

  return (
    <div
      aria-hidden
      data-dayclock
      className="t-data pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 text-oxide md:flex"
    >
      <span className="tracking-widest">
        {hh}:{mm}
      </span>
      <span className="relative block h-24 w-px bg-white/15">
        <span
          className="absolute top-0 left-0 w-px bg-oxide"
          style={{ height: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}
