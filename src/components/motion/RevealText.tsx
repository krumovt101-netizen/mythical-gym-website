"use client";

import type { ElementType } from "react";
import { useShown } from "./useShown";

/**
 * Revelação de título SEM máscara de recorte. A versão anterior cortava
 * cada palavra numa janela overflow e fatiava os descendentes da serifa a
 * meio da transição — três capturas apanharam títulos partidos. Uma serifa
 * ótica precisa de ar; aqui o bloco inteiro sobe e assenta, uma vez por
 * secção, sem nunca cortar um glifo.
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
  return (
    <Tag
      ref={ref}
      data-reveal="rise"
      data-shown={shown}
      className={className}
      style={{ "--i": startIndex } as React.CSSProperties}
    >
      {text}
    </Tag>
  );
}
