"use client";

import type { CSSProperties, ElementType } from "react";
import { useShown } from "./useShown";

/**
 * O título de catálogo: cada palavra sobe de dentro de uma janela cortada
 * (máscara de overflow), em cascata. Sem JS, e com reduced-motion, o texto
 * está simplesmente lá — a máscara só existe atrás de `html[data-js]`.
 *
 * Recebe uma STRING, não children: a divisão por palavras tem de ser
 * determinística no servidor e no cliente para a hidratação bater certo.
 */
export function RevealText({
  text,
  as: Tag = "h1",
  className = "",
  startIndex = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  startIndex?: number;
}) {
  const [ref, shown] = useShown<HTMLElement>();
  const words = text.split(" ");
  return (
    <Tag ref={ref} data-shown={shown} className={className}>
      {words.map((word, i) => (
        <span key={i} className="mask-w">
          <span style={{ "--i": startIndex + i } as CSSProperties}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
