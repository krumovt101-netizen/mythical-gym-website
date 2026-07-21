import { Section } from "../registry/Section";
import { SpecTable } from "../registry/SpecTable";
import { Figure } from "../registry/Figure";
import { Button } from "../registry/Button";
import { Reveal } from "../motion/Reveal";
import { RevealText } from "../motion/RevealText";
import { DICT } from "@/content/dictionary";
import { confirmedMachines } from "@/content/machines";
import { SITE, type Locale } from "@/content/site";

/**
 * O DOSSIER Nº 001. Com uma só máquina catalogada, o registo não se
 * apresenta como lista (uma tabela de uma linha lê-se como maqueta vazia):
 * apresenta-se como um LOTE de leiloeira — o fólio monumental a sangrar da
 * margem do papel, a ficha à escala de documento, a peça em grande.
 * Profundidade em vez de vazio.
 */
export function LotSection({ locale }: { locale: Locale }) {
  const m = confirmedMachines()[0];
  if (!m) return null;
  const d = DICT.home.lot;

  return (
    <Section
      band="paper"
      id="registo"
      pad="none"
      className="scroll-mt-20"
      bleed={
        <span
          aria-hidden
          className="t-folio pointer-events-none absolute -right-[0.06em] -top-[0.06em] select-none text-[clamp(9rem,30vw,30rem)] text-brass-deep/12"
        >
          001
        </span>
      }
    >
      <div className="py-24 sm:py-36">
        <Reveal effect="fade">
          <p className="t-data text-ink-dim">
            {d.kicker[locale]} · Nº 001 · {DICT.common.openedSince[locale].toUpperCase()}{" "}
            {SITE.opened.label[locale].toUpperCase()}
          </p>
        </Reveal>

        <RevealText
          as="h2"
          text={`${m.maker} ${m.name}`}
          className="t-display mt-9 max-w-[13ch] text-[clamp(3rem,8.5vw,8.5rem)] text-ink"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal effect="rise">
              <SpecTable
                large
                rows={[
                  { term: d.maker[locale], value: m.maker },
                  { term: d.model[locale], value: m.name },
                  { term: d.era[locale], value: m.era[locale] },
                  { term: d.status[locale], value: d.statusValue[locale] },
                  { term: d.source[locale], value: d.sourceValue[locale], href: m.source },
                ]}
              />
              <p className="t-lede mt-10 max-w-md text-lg text-ink-dim">{m.blurb[locale]}</p>
              <div className="mt-10">
                <Button href={`/${locale}/ginasio#ferro`} variant="ink" arrow>
                  {d.link[locale]}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal effect="rise" index={1}>
              <Figure
                slot="cybex-leg-press"
                locale={locale}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-4/3 w-full"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
