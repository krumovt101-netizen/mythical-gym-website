"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * O gatilho único do sistema de revelação: devolve `shown` quando o elemento
 * entra em viewport, UMA vez, e desliga-se sozinho.
 *
 * Detalhe que não é óbvio: se o preloader ainda está no ecrã
 * (`html[data-pre="1"]`), o observador só arma DEPOIS de ele sair. Sem isto,
 * as revelações do herói corriam todas atrás da cortina e, quando ela subia,
 * o herói já estava parado: pagava-se o preloader e perdia-se a entrada.
 *
 * Reduced-motion não precisa de ramo aqui: os estados iniciais escondidos só
 * existem no CSS atrás de `prefers-reduced-motion: no-preference`.
 */
export function useShown<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    let mo: MutationObserver | undefined;

    const arm = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            io?.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
      );
      io.observe(el);
    };

    if (document.documentElement.dataset.pre === "1") {
      mo = new MutationObserver(() => {
        if (document.documentElement.dataset.pre !== "1") {
          mo?.disconnect();
          arm();
        }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pre"] });
    } else {
      arm();
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);

  return [ref, shown];
}
