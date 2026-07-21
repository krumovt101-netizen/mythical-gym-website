import { SHOW_STOCK_TAGS } from "@/content/media";
import { DICT, t } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/** Onde assenta o carimbo. "off" para as imagens que já são do cliente;
    "inline" quando é o chamador a posicioná-lo (herói, composições próprias). */
export type StampPos = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "inline" | "off";

const POS: Record<Exclude<StampPos, "off">, string> = {
  "bottom-left": "absolute bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-right": "absolute bottom-3 right-3 sm:bottom-4 sm:right-4",
  "top-left": "absolute top-3 left-3 sm:top-4 sm:left-4",
  "top-right": "absolute top-3 right-3 sm:top-4 sm:right-4",
  inline: "",
};

/**
 * O carimbo que diz, em cima da própria imagem, que a imagem não é do
 * cliente. Chapa opaca escura para se ler por cima de qualquer fotografia:
 * mesmo sobre um pixel branco, branco sobre vault/85 passa de 12:1.
 *
 * Ninguém o liga à mão: sai do interruptor (`stock` em media.ts) e
 * desaparece no dia em que o interruptor mudar. SHOW_STOCK_TAGS desliga o
 * carimbo VISUAL para uma apresentação; não desliga o alt honesto nem a
 * trava do build — essas não se negoceiam.
 */
export function ProvisionalStamp({
  locale,
  position = "bottom-left",
  className = "",
}: {
  locale: Locale;
  position?: StampPos;
  className?: string;
}) {
  if (position === "off" || !SHOW_STOCK_TAGS) return null;
  return (
    <span
      className={`t-data pointer-events-none z-3 inline-flex items-center gap-2 border border-white/25 bg-vault/85 px-2.5 py-1.5 text-white ${POS[position]} ${className}`}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-brass-bright" />
      {t(DICT.common.provisional, locale)}
    </span>
  );
}
