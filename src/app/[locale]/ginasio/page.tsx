import type { Metadata } from "next";
import { Section } from "@/components/registry/Section";
import { Eyebrow } from "@/components/registry/Eyebrow";
import { RefNumber } from "@/components/registry/RefNumber";
import { EmptyState } from "@/components/registry/EmptyState";
import { Figure } from "@/components/registry/Figure";
import { Button } from "@/components/registry/Button";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { DICT, fill } from "@/content/dictionary";
import { LOCALES, SITE, type Locale } from "@/content/site";
import { shot } from "@/content/media";
import {
  brands,
  showBrands,
  confirmedZones,
  DISCIPLINES,
  showDisciplines,
  PRICING,
  CAMPAIGN,
  campaignLive,
} from "@/content/gym";
import { confirmedMachines, MACHINES } from "@/content/machines";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pt = locale === "pt";
  return {
    title: pt ? "O ginásio" : "The gym",
    description: pt
      ? "Rua José António Varela Pinto, armazém 4, na Zona Industrial da Formiga, em Pombal. Aberto desde 1 de julho de 2026."
      : "Rua José António Varela Pinto, armazém 4, Formiga industrial estate, Pombal. Open since 1 July 2026.",
    alternates: { canonical: `/${locale}/ginasio` },
  };
}

export default async function GymPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = DICT.gym;
  const zones = confirmedZones();
  const makers = brands();
  const machines = confirmedMachines();
  const handle = SITE.social.instagramHandle;

  return (
    <>
      {/* --------------------------------------------------------- CABEÇALHO
          Documento primeiro, sem fotografia: esta página É o registo, e um
          registo abre pelo cabeçalho do próprio documento. */}
      <Section band="vault" pad="none">
        <div className="pb-16 pt-36 sm:pb-20 sm:pt-44">
          <Reveal effect="fade">
            <p className="t-data text-mercury">{SITE.address.landmark[l]}</p>
          </Reveal>
          <RevealText
            as="h1"
            text={c.title[l]}
            startIndex={1}
            className="t-display mt-6 text-[clamp(3rem,10vw,9rem)] text-cream"
          />
          <Reveal effect="rise" index={2}>
            <div className="mt-10 grid gap-8 border-t border-rule pt-8 lg:grid-cols-12">
              <p className="t-lede text-lg text-cream-dim lg:col-span-5">{c.lede[l]}</p>
              <p className="t-headline text-xl text-brass lg:col-span-6 lg:col-start-7 sm:text-2xl">
                {c.thesis[l]}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------ O REGISTO DO FERRO
          A âncora #ferro é usada pela homepage, pelo rodapé e pelo herói.
          Se esta secção mudar de sítio, esses três links partem-se. */}
      <Section band="paper" id="ferro" className="scroll-mt-24">
        <Reveal effect="fade">
          <Eyebrow onPaper>{SITE.address.municipality}</Eyebrow>
        </Reveal>
        <RevealText
          as="h2"
          text={DICT.iron.title[l]}
          className="t-display mt-5 max-w-[16ch] text-[clamp(2.4rem,5.5vw,4.5rem)] text-ink"
        />
        <Reveal effect="rise" index={2}>
          <p className="t-lede mt-6 max-w-2xl text-lg text-ink-dim">{DICT.iron.lede[l]}</p>
        </Reveal>

        {machines.length === 0 ? (
          <Reveal effect="rise" index={3} className="mt-14 border-t border-paper-rule pt-4">
            <EmptyState nextN={1} line={DICT.iron.empty[l]} />
          </Reveal>
        ) : (
          <>
            <ul className="mt-14 border-t border-paper-rule sm:mt-16">
              {machines.map((m, i) => {
                const photo = m.shot ? shot(m.shot)?.src : null;
                return (
                  <Reveal key={m.id} as="li" index={i} className="border-b border-paper-rule">
                    <article className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                          <RefNumber n={i + 1} onPaper className="text-lg" />
                          <span className="t-data text-ink-dim">
                            {DICT.iron.eraLabel[l]}: {m.era[l]}
                          </span>
                        </div>
                        <h3 className="t-display mt-6 text-[clamp(1.9rem,4.5vw,3.4rem)] text-ink">
                          {m.maker} {m.name}
                        </h3>
                        <p className="t-lede mt-7 max-w-2xl text-lg text-ink-dim">{m.blurb[l]}</p>
                      </div>

                      {photo && (
                        <Figure
                          slot={m.shot as string}
                          locale={l}
                          sizes="(max-width: 1024px) 100vw, 24rem"
                          className="aspect-4/3 w-full border border-paper-rule"
                        />
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </ul>
            <EmptyState nextN={MACHINES.length + 1} line={DICT.home.ledgerOpen[l]} />
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------- AS ZONAS
          Só aparece com zonas confirmadas. Hoje não há: ninguém viu o espaço,
          e um armazém não se divide de cabeça. Ver ZONES em content/gym.ts. */}
      {zones.length > 0 && (
        <Section band="base" ruleTop>
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-cream sm:text-4xl">{c.zonesTitle[l]}</h2>
            <p className="t-lede mt-5 max-w-xl text-lg text-mercury">{c.zonesBody[l]}</p>
          </Reveal>
          <ul className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((z, i) => (
              <Reveal key={z.id} as="li" index={i} className="bg-base p-7 sm:p-9">
                <h3 className="t-headline text-xl text-cream">{z.name[l]}</h3>
                <p className="t-body mt-3 text-sm text-mercury">{z.blurb[l]}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------------------------------------------------------- AS MARCAS */}
      {showBrands() && (
        <Section band="base" id="equipamento" ruleTop>
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-cream sm:text-4xl">{c.equipmentTitle[l]}</h2>
            <p className="t-lede mt-5 max-w-2xl text-lg text-mercury">
              {DICT.home.equipmentBody[l]}
            </p>
          </Reveal>
          <ul className="mt-12 border-t border-rule">
            {makers.map((b, i) => (
              <Reveal key={b.name} as="li" index={i} className="border-b border-rule">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-7">
                  <span className="t-display text-3xl text-cream-dim sm:text-4xl">{b.name}</span>
                  {b.note && <span className="t-data text-brass">{b.note[l]}</span>}
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* ------------------------------------------------------- O QUE SE TREINA
          Bloqueada: cada modalidade é uma promessa comercial, e nenhuma entra
          por suposição. Ver DISCIPLINES em content/gym.ts. */}
      {showDisciplines() && (
        <Section band="base" ruleTop>
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-cream sm:text-4xl">
              {c.disciplinesTitle[l]}
            </h2>
          </Reveal>
          <ul className="mt-10 flex flex-wrap gap-3">
            {DISCIPLINES.items.map((d, i) => (
              <Reveal key={d[l]} as="li" index={i}>
                <span className="t-data inline-block border border-rule-strong px-4 py-3 text-cream-dim">
                  {d[l]}
                </span>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* --------------------------------------------------- HORÁRIO E PREÇOS
          Nenhum dos dois está publicado em fonte nenhuma. O site di-lo e
          encaminha, em vez de inventar: é a diferença entre uma lacuna
          assumida e uma mentira pequena. */}
      <Section band="paper" ruleTop>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-ink sm:text-[2.25rem]">{c.hoursTitle[l]}</h2>
            {SITE.hours.confirmed ? (
              <dl className="mt-8 border-t border-paper-rule">
                {SITE.hours.draft.map((h) => (
                  <div
                    key={h.days[l]}
                    className="flex flex-wrap justify-between gap-4 border-b border-paper-rule py-5"
                  >
                    <dt className="t-data text-ink-dim">{h.days[l]}</dt>
                    <dd className="t-numeral text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="t-lede mt-6 max-w-md text-lg text-ink-dim">
                {fill(c.hoursPending[l], { handle })}
              </p>
            )}
          </Reveal>

          <Reveal effect="rise" index={1}>
            <h2 className="t-headline text-3xl text-ink sm:text-[2.25rem]">{c.pricingTitle[l]}</h2>
            {PRICING.confirmed ? (
              <ul className="mt-8 border-t border-paper-rule">
                {PRICING.tiers.map((tier) => (
                  <li
                    key={tier.name[l]}
                    className="flex flex-wrap items-baseline justify-between gap-4 border-b border-paper-rule py-5"
                  >
                    <span className="t-headline text-lg text-ink">{tier.name[l]}</span>
                    <span className="t-numeral text-xl text-ink">
                      {tier.price}
                      <span className="t-data ml-2 text-ink-dim">{tier.period[l]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-lede mt-6 max-w-md text-lg text-ink-dim">
                {fill(c.pricingPending[l], { handle })}
              </p>
            )}

            {campaignLive() && (
              <div className="mt-9 border-l-2 border-brass-deep pl-5">
                <p className="t-data text-brass-deep">{CAMPAIGN.name[l]}</p>
                <p className="t-body mt-2 text-sm text-ink-dim">
                  {fill(DICT.home.campaignBody[l], { dates: CAMPAIGN.dates[l] })}
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------- COMO CHEGAR */}
      <Section band="base" id="chegar" ruleTop className="scroll-mt-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-cream sm:text-4xl">{c.visitTitle[l]}</h2>
            <p className="t-lede mt-6 max-w-md text-lg text-cream-dim">{c.directionsBody[l]}</p>
            <address className="mt-9 max-w-md not-italic">
              <div className="divide-y divide-rule border-y border-rule">
                <p className="t-body py-3.5 text-sm text-mercury">{SITE.address.street}</p>
                <p className="t-body py-3.5 text-sm text-mercury">
                  {SITE.address.area}
                  {SITE.address.postal ? `, ${SITE.address.postal}` : ""},{" "}
                  {SITE.address.municipality}
                </p>
                <p className="t-headline py-4 text-lg text-brass">{SITE.address.landmark[l]}</p>
              </div>
            </address>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={`/${l}/contactos#aderir`}>{DICT.nav.join[l]}</Button>
              <Button
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address.mapsQuery)}`}
                external
                variant="hairline"
              >
                {DICT.contact.directions[l]}
              </Button>
            </div>
          </Reveal>

          {/* Sem fotografia do edifício, não fica aqui uma chapa vazia a
              competir com a morada. */}
          {shot("space")?.src && (
            <Reveal effect="rise" index={2}>
              <Figure
                slot="space"
                locale={l}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="aspect-4/3 w-full border border-rule"
              />
            </Reveal>
          )}
        </div>
      </Section>
    </>
  );
}
