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
      /* -15% em baixo: o elemento só dispara quando já entrou A SÉRIO no
         ecrã, para a transição terminar antes de ser lida. Disparar cedo
         deixava títulos a meio da animação nas capturas — pior que não
         animar. */
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            io?.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -15% 0px" },
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
