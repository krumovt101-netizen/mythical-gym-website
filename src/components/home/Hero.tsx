import ScrollSequence from "../ScrollSequence";
import { Button } from "../registry/Button";
import { ProvisionalStamp } from "../registry/ProvisionalStamp";
import { Reveal } from "../motion/Reveal";
import { DICT, t } from "@/content/dictionary";
import { sequence } from "@/content/media";
import type { Locale } from "@/content/site";

/**
 * O plano de abertura: o site começa DENTRO do filme. Um travelling lento
 * pelo corredor do pavilhão, esfregado pelo scroll, com o título gigante
 * por cima — a serifa no seu polo fino e monumental, quebrada de propósito
 * em duas linhas, a segunda avançada. Um CTA, e mais nada.
 */
export function Hero({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const seq = sequence("abertura");

  const overlay = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vault via-vault/10 to-vault/40"
      />
      <div className="relative flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[96rem] px-5 pb-12 sm:px-8 sm:pb-16">
          <Reveal effect="fade">
            <p className="t-data text-cream-dim">{d.heroKicker[locale]}</p>
          </Reveal>
          <Reveal effect="rise" index={1}>
            <h1 className="t-display mt-5 text-[clamp(3.4rem,11.5vw,11.5rem)] text-cream">
              <span className="block">{d.heroL1[locale]}</span>
              <span className="block pl-[6vw] sm:pl-[9vw]">{d.heroL2[locale]}</span>
            </h1>
          </Reveal>
          <Reveal effect="rise" index={2}>
            <div className="mt-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-7">
              <p className="t-lede max-w-md text-lg text-cream-dim">{d.heroBody[locale]}</p>
              <Button href="#registo" arrow>
                {d.heroCtaIron[locale]}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
      {seq?.stock && (
        <span className="absolute right-5 top-24 sm:right-8">
          <ProvisionalStamp locale={locale} position="inline" />
        </span>
      )}
    </>
  );

  if (!seq || seq.frameCount === 0) {
    return (
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-vault text-cream">
        {overlay}
      </section>
    );
  }

  return (
    <section className="relative bg-vault text-cream">
      <ScrollSequence
        base={seq.base}
        frameCount={seq.frameCount}
        scrollLength={seq.scrollLength}
        priority
        posterAlt={`${t(seq.alt, locale)}. ${t(DICT.common.provisionalAlt, locale)}`}
      >
        {overlay}
      </ScrollSequence>
    </section>
  );
}
