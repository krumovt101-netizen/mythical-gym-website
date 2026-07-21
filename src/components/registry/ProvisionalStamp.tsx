import { SHOW_STOCK_TAGS } from "@/content/media";
import { DICT, t } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/** Onde assenta a anotação. "off" para as imagens que já são do cliente;
    "inline" quando é o chamador a posicioná-la. */
export type StampPos = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "inline" | "off";

const POS: Record<Exclude<StampPos, "off">, string> = {
  "bottom-left": "absolute bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-right": "absolute bottom-3 right-3 sm:bottom-4 sm:right-4",
  "top-left": "absolute top-3 left-3 sm:top-4 sm:left-4",
  "top-right": "absolute top-3 right-3 sm:top-4 sm:right-4",
  inline: "",
};

/**
 * A anotação de provisório, na voz do próprio documento: uma linha mono
 * minúscula com um filete à frente — como uma nota de margem de registo,
 * não um autocolante de QA. (A chapa amarela com borda que aqui estava
 * lia-se como overlay de debug, e era meia razão do site parecer inacabado.)
 *
 * A honestidade não mudou: sai do interruptor `stock`/`draft`, o alt
 * di-lo por extenso, e a trava do build continua armada. A sombra de texto
 * garante leitura sobre qualquer pixel da imagem.
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
      className={`t-data pointer-events-none z-3 inline-flex items-center gap-2.5 normal-case tracking-[0.08em] text-white/75 ${POS[position]} ${className}`}
      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)" }}
    >
      <span aria-hidden className="h-px w-5 bg-white/40" />
      {t(DICT.common.provisional, locale).toLowerCase()}
    </span>
  );
}
