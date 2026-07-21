"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useShown } from "./useShown";

/**
 * Revelação ao scroll. A animação vive TODA no CSS (globals.css, atrás de
 * `html[data-js]` e de `prefers-reduced-motion: no-preference`); isto só
 * marca `data-shown`. `index` é o degrau da cascata (--i), não milissegundos.
 */
export function Reveal({
  children,
  effect = "rise",
  index = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  effect?: "rise" | "fade" | "wipe";
  index?: number;
  as?: ElementType;
  className?: string;
}) {
  const [ref, shown] = useShown<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal={effect}
      data-shown={shown}
      className={className}
      style={{ "--i": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
