import type { ReactNode } from "react";
import ScrollSequence from "../ScrollSequence";
import { ProvisionalStamp } from "../registry/ProvisionalStamp";
import { DICT, t } from "@/content/dictionary";
import { sequence } from "@/content/media";
import type { Locale } from "@/content/site";

/**
 * Um plano do filme: sequência esfregada pelo scroll com legenda em terço
 * inferior. Os fotogramas só descarregam quando o plano se aproxima (lazy);
 * reduced-motion e ecrãs pequenos recebem o poster.
 */
export function FilmBeat({
  slot,
  kicker,
  line,
  locale,
  big = false,
  align = "left",
  children,
}: {
  slot: string;
  kicker: string;
  line: string;
  locale: Locale;
  /** O plano final fala à escala do herói: um fecho não sussurra. */
  big?: boolean;
  align?: "left" | "right";
  children?: ReactNode;
}) {
  const seq = sequence(slot);
  if (!seq || seq.frameCount === 0) return null;

  return (
    <section className="relative bg-vault text-cream">
      <ScrollSequence
        base={seq.base}
        frameCount={seq.frameCount}
        scrollLength={seq.scrollLength}
        lazy
        edgeFade="both"
        posterAlt={`${t(seq.alt, locale)}. ${t(DICT.common.provisionalAlt, locale)}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vault/85 via-transparent to-vault/30"
        />
        <div className="relative flex h-full flex-col justify-end">
          <div
            className={`mx-auto w-full max-w-[96rem] px-5 pb-14 sm:px-8 sm:pb-16 ${
              align === "right" ? "text-right" : ""
            }`}
          >
            <p className="t-data text-cream-dim">{kicker}</p>
            <p
              className={`t-display mt-4 text-cream ${
                align === "right" ? "ml-auto" : ""
              } ${big ? "max-w-none text-[clamp(2.8rem,10vw,10rem)]" : "max-w-3xl text-[clamp(1.9rem,4.5vw,4rem)]"}`}
            >
              {line}
            </p>
            {children && <div className="mt-9">{children}</div>}
          </div>
        </div>
        {seq.stock && <ProvisionalStamp locale={locale} position="top-right" />}
      </ScrollSequence>
    </section>
  );
}
