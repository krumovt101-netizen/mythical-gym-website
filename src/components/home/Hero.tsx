import { Figure } from "../registry/Figure";
import { FoilStamp } from "../registry/FoilStamp";
import { ProvisionalStamp } from "../registry/ProvisionalStamp";
import { Eyebrow } from "../registry/Eyebrow";
import { Button } from "../registry/Button";
import { Reveal } from "../motion/Reveal";
import { RevealText } from "../motion/RevealText";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/**
 * O herói: tipográfico, não cinemático. A serifa gigante É o espetáculo;
 * a fotografia é atmosfera por baixo dela. `100svh` e não `100dvh`: o herói
 * não pode saltar quando a barra do browser se recolhe.
 */
export function Hero({ locale }: { locale: Locale }) {
  const d = DICT.home;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-vault text-cream">
      <div className="absolute inset-0">
        <Figure
          slot="hero"
          locale={locale}
          priority
          sizes="100vw"
          className="size-full"
          stamp="off"
          objectPosition="center 42%"
        />
        {/* Dois véus com papéis diferentes: o vertical assenta o texto no
            rodapé da banda; o horizontal escurece a esquerda, onde ele vive.
            A etiqueta de provisório fica por cima dos dois. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-vault via-vault/40 to-vault/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-vault/75 via-vault/25 to-transparent"
        />
        {/* O carimbo de provisório, posicionado à mão: os cantos do herói
            pertencem à barra fixa, e o carimbo não pode colidir com ela. */}
        <span className="absolute right-5 top-24 sm:right-8">
          <ProvisionalStamp locale={locale} position="inline" />
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-5 pb-16 pt-44 sm:px-8 sm:pb-20">
        <Reveal effect="fade" index={0}>
          <Eyebrow>{d.heroKicker[locale]}</Eyebrow>
        </Reveal>

        <RevealText
          as="h1"
          text={d.heroTitle[locale]}
          startIndex={1}
          className="t-display mt-7 max-w-[12ch] text-[clamp(3.2rem,9.5vw,8.75rem)] text-cream"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal effect="rise" index={4}>
            <p className="t-lede max-w-xl text-lg text-cream-dim sm:text-xl">
              {d.heroBody[locale]}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={`/${locale}/ginasio#ferro`}>{d.heroCtaIron[locale]}</Button>
              <Button href={`/${locale}/contactos#aderir`} variant="hairline">
                {DICT.nav.join[locale]}
              </Button>
            </div>
          </Reveal>
          <Reveal effect="fade" index={6} className="hidden lg:block">
            <FoilStamp>{d.heroStamp[locale]}</FoilStamp>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
