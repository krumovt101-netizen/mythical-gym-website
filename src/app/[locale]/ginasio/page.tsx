import type { Metadata } from "next";
import { Button, Reveal } from "@/components/ui";
import { Shot, HeaderMedia } from "@/components/Shot";
import { Plate } from "@/components/Wordmark";
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
import { confirmedMachines } from "@/content/machines";

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
      {/* ------------------------------------------------------------- CABEÇALHO */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-carbon grain">
        <HeaderMedia slot="header-gym" locale={l} />
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 pt-36 pb-20 sm:px-8 sm:pt-44 sm:pb-28">
          <p className="t-data rise text-oxide">{SITE.address.landmark[l]}</p>
          <h1 className="t-display rise mt-6 text-[clamp(2.75rem,8vw,6.5rem)] text-white">
            {c.title[l]}
          </h1>
          <p className="t-body rise mt-8 max-w-[58ch] text-lg text-white/85">{c.lede[l]}</p>
          <p className="t-headline rise mt-10 max-w-[42ch] text-2xl text-oxide sm:text-3xl">
            {c.thesis[l]}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ O REGISTO DO FERRO
          Tinha página própria (/ferro) e passou a ser uma secção desta, a pedido
          do cliente. A decisão sustenta-se: com uma máquina catalogada, uma
          página inteira era mais moldura do que quadro, e o menu ganhou uma
          entrada a menos. O tratamento em banda de papel veio de lá inteiro,
          porque um registo é um documento e um documento lê-se em papel.

          A âncora #ferro é usada pela homepage, pelo rodapé e pelo botão do
          herói. Se esta secção mudar de sítio, esses três links partem-se. */}
      <section
        id="ferro"
        className="relative isolate scroll-mt-24 overflow-hidden border-b border-hairline bg-paper py-20 text-ink sm:py-28 grain grain-ink"
      >
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <Reveal>
            <p className="t-data text-oxide-deep">{SITE.address.municipality}</p>
            <h2 className="t-display mt-4 text-[clamp(2.25rem,5vw,4rem)] text-ink">
              {DICT.iron.title[l]}
            </h2>
            <p className="t-body mt-5 max-w-[58ch] text-lg text-ink-dim">{DICT.iron.lede[l]}</p>
          </Reveal>

          {machines.length === 0 ? (
            <Reveal className="mt-12 border-t border-paper-line pt-10">
              <p className="t-body text-ink-dim">{DICT.iron.empty[l]}</p>
            </Reveal>
          ) : (
            <ul className="mt-12 border-t border-paper-line sm:mt-16">
              {machines.map((m, i) => {
                const photo = m.shot ? shot(m.shot)?.src : null;
                return (
                  <Reveal key={m.id} as="li" delay={i * 60} className="border-b border-paper-line">
                    <article className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start lg:gap-16">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                          <span className="t-data text-oxide-deep">{m.maker}</span>
                          <span className="t-data text-ink-dim">
                            {DICT.iron.eraLabel[l]}: {m.era[l]}
                          </span>
                        </div>
                        <h3 className="t-display mt-5 text-[clamp(1.75rem,4vw,3rem)] text-ink">
                          {m.name}
                        </h3>
                        <p className="t-body mt-6 max-w-[62ch] text-ink-dim">{m.blurb[l]}</p>
                      </div>

                      {photo && (
                        <Shot
                          slot={m.shot as string}
                          locale={l}
                          sizes="(max-width: 1024px) 100vw, 22rem"
                          className="aspect-4/3 w-full border border-paper-line"
                        />
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- AS ZONAS
          Só aparece se houver zonas confirmadas. Hoje não há: não vi o espaço e
          não vou dividir um armazém de cabeça. Ver ZONES em content/gym.ts. */}
      {zones.length > 0 && (
        <section className="relative border-b border-hairline bg-void py-20 sm:py-28">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <Reveal>
              <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                {c.zonesTitle[l]}
              </h2>
              <p className="t-body mt-5 max-w-[46ch] text-steel">{c.zonesBody[l]}</p>
            </Reveal>
            <ul className="mt-14 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
              {zones.map((z, i) => (
                <Reveal key={z.id} as="li" delay={i * 60} className="bg-void">
                  <div className="relative aspect-4/3 overflow-hidden bg-iron-2">
                    {shot(z.id)?.src ? (
                      <Shot
                        slot={z.id}
                        locale={l}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="size-full"
                      />
                    ) : (
                      <span className="grain grid size-full place-items-center">
                        <Plate size={48} className="text-steel-dim opacity-40" />
                      </span>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <h3 className="t-headline text-xl text-chalk">{z.name[l]}</h3>
                    <p className="t-body mt-3 text-sm text-steel">{z.blurb[l]}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- AS MARCAS */}
      {showBrands() && (
        <section id="equipamento" className="relative border-b border-hairline bg-iron py-20 sm:py-28">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <Reveal>
              <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                {c.equipmentTitle[l]}
              </h2>
              <p className="t-body mt-5 max-w-[52ch] text-steel">
                {DICT.home.equipmentBody[l]}
              </p>
            </Reveal>
            <ul className="mt-12 border-t border-hairline">
              {makers.map((b, i) => (
                <Reveal key={b.name} as="li" delay={i * 40} className="border-b border-hairline">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6">
                    <span className="t-display text-[clamp(1.5rem,3.5vw,2.5rem)] text-chalk-dim">
                      {b.name}
                    </span>
                    {b.note && <span className="t-data text-oxide">{b.note[l]}</span>}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- O QUE SE TREINA
          Bloqueada. Cada modalidade é uma promessa comercial, e nenhuma entra
          por suposição. Ver DISCIPLINES em content/gym.ts. */}
      {showDisciplines() && (
        <section className="relative border-b border-hairline bg-void py-20 sm:py-28">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <Reveal>
              <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                {c.disciplinesTitle[l]}
              </h2>
            </Reveal>
            <ul className="mt-10 flex flex-wrap gap-3">
              {DISCIPLINES.items.map((d, i) => (
                <Reveal key={d[l]} as="li" delay={i * 40}>
                  <span className="t-data inline-block border border-hairline px-4 py-3 text-chalk-dim">
                    {d[l]}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* --------------------------------------------------- HORÁRIO E PREÇOS
          Nenhum dos dois está publicado em fonte nenhuma, nem no Instagram da
          própria casa. O site diz isso e encaminha, em vez de inventar. É a
          diferença entre uma lacuna assumida e uma mentira pequena. */}
      <section className="relative border-b border-hairline bg-paper py-20 text-ink sm:py-28 grain grain-ink">
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="t-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">
                {c.hoursTitle[l]}
              </h2>
              {SITE.hours.confirmed ? (
                <dl className="mt-8 border-t border-paper-line">
                  {SITE.hours.draft.map((h) => (
                    <div
                      key={h.days[l]}
                      className="flex flex-wrap justify-between gap-4 border-b border-paper-line py-5"
                    >
                      <dt className="t-data text-ink-dim">{h.days[l]}</dt>
                      <dd className="t-numeral text-ink">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="t-body mt-6 max-w-[46ch] text-ink-dim">
                  {fill(c.hoursPending[l], { handle })}
                </p>
              )}
            </Reveal>

            <Reveal delay={120}>
              <h2 className="t-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">
                {c.pricingTitle[l]}
              </h2>
              {PRICING.confirmed ? (
                <ul className="mt-8 border-t border-paper-line">
                  {PRICING.tiers.map((tier) => (
                    <li
                      key={tier.name[l]}
                      className="flex flex-wrap items-baseline justify-between gap-4 border-b border-paper-line py-5"
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
                <p className="t-body mt-6 max-w-[46ch] text-ink-dim">
                  {fill(c.pricingPending[l], { handle })}
                </p>
              )}

              {campaignLive() && (
                <div className="mt-8 border-l-2 border-oxide-deep pl-5">
                  <p className="t-data text-oxide-deep">{CAMPAIGN.name[l]}</p>
                  <p className="t-body mt-2 text-ink-dim">
                    {fill(DICT.home.campaignBody[l], { dates: CAMPAIGN.dates[l] })}
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- COMO CHEGAR */}
      <section id="chegar" className="relative bg-void py-20 sm:py-28">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                {c.visitTitle[l]}
              </h2>
              <p className="t-body mt-6 max-w-[46ch] text-chalk-dim">{c.directionsBody[l]}</p>
              <address className="t-body mt-8 not-italic text-chalk">
                {SITE.address.street}
                <br />
                {SITE.address.area}
                <br />
                {SITE.address.postal ? `${SITE.address.postal}, ` : ""}
                {SITE.address.municipality}
              </address>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address.mapsQuery)}`}
                  external
                  variant="outline"
                >
                  {DICT.contact.directions[l]}
                </Button>
                <Button href={`/${l}/contactos#aderir`}>{DICT.nav.join[l]}</Button>
              </div>
            </Reveal>

            {/* Mesma regra da página de contactos: sem fotografia do edifício,
                não fica aqui uma chapa vazia a competir com a morada. */}
            {shot("space")?.src && (
              <Reveal delay={120}>
                <Shot
                  slot="space"
                  locale={l}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="aspect-4/3 w-full border border-hairline"
                />
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
