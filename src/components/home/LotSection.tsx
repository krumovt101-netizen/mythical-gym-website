import ScrollSequence from "../ScrollSequence";
import { Section } from "../registry/Section";
import { Eyebrow } from "../registry/Eyebrow";
import { RefNumber } from "../registry/RefNumber";
import { SpecTable } from "../registry/SpecTable";
import { Button } from "../registry/Button";
import { ProvisionalStamp } from "../registry/ProvisionalStamp";
import { Reveal } from "../motion/Reveal";
import { RevealText } from "../motion/RevealText";
import { DICT, t } from "@/content/dictionary";
import { confirmedMachines } from "@/content/machines";
import { sequence } from "@/content/media";
import type { Locale } from "@/content/site";

/**
 * A PEÇA: a entrada Nº 001 do registo com o tratamento de um lote de
 * leiloeira — a ficha em papel, e a seguir a vista explodida em scrub de
 * scroll (o único momento cinemático do site; um catálogo tem UMA prancha
 * técnica, não cinco).
 *
 * HONESTIDADE: a vista explodida é uma ilustração genérica de um mecanismo
 * da era, e a legenda di-lo por extenso. Os factos vivem na ficha, que lê de
 * machines.ts.
 */
export function LotSection({ locale }: { locale: Locale }) {
  const m = confirmedMachines()[0];
  if (!m) return null;
  const d = DICT.home.lot;
  const seq = sequence("mecanismo");

  return (
    <>
      <Section band="paper" id="lote" pad="loose">
        <div className="flex items-end justify-between gap-6">
          <Reveal effect="fade">
            <Eyebrow onPaper>{d.kicker[locale]}</Eyebrow>
          </Reveal>
          <Reveal effect="fade" index={1}>
            <RefNumber n={1} onPaper className="text-xl sm:text-2xl" />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText
              as="h2"
              text={`${m.maker} ${m.name}`}
              className="t-display max-w-[12ch] text-[clamp(2.8rem,6.5vw,5.75rem)] text-ink"
            />
            <Reveal effect="fade" index={3}>
              <p className="t-data mt-5 text-ink-dim">{m.era[locale]}</p>
            </Reveal>
            <Reveal effect="rise" index={4}>
              <p className="t-lede mt-9 max-w-2xl text-xl text-ink">{m.blurb[locale]}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <Reveal effect="rise" index={5}>
              <SpecTable
                rows={[
                  { term: d.maker[locale], value: m.maker },
                  { term: d.model[locale], value: m.name },
                  { term: d.era[locale], value: m.era[locale] },
                  { term: d.status[locale], value: d.statusValue[locale] },
                  {
                    term: d.source[locale],
                    value: d.sourceValue[locale],
                    href: m.source,
                  },
                ]}
              />
              <div className="mt-9">
                <Button href={`/${locale}/ginasio#ferro`} variant="paper">
                  {d.link[locale]}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* A prancha técnica: vista explodida em scrub. Poster para quem tem
          reduced-motion ou um ecrã pequeno; os fotogramas só descarregam
          quando a secção se aproxima (lazy). */}
      {seq && seq.frameCount > 0 && (
        <section className="relative bg-vault text-cream">
          <ScrollSequence
            base={seq.base}
            frameCount={seq.frameCount}
            scrollLength={seq.scrollLength}
            lazy
            posterAlt={`${t(seq.alt, locale)}. ${t(DICT.common.provisionalAlt, locale)}`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vault/85 via-transparent to-vault/35"
            />
            <div className="relative flex h-full flex-col justify-end">
              <div className="mx-auto w-full max-w-[92rem] px-5 pb-14 sm:px-8 sm:pb-16">
                <Eyebrow>{d.diagramKicker[locale]}</Eyebrow>
                <p className="t-headline mt-5 max-w-2xl text-2xl text-cream sm:text-3xl">
                  {d.diagramLine[locale]}
                </p>
              </div>
            </div>
            {seq.stock && <ProvisionalStamp locale={locale} position="top-right" />}
          </ScrollSequence>
        </section>
      )}
    </>
  );
}
