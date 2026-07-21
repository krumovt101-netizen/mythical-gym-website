import type { Metadata } from "next";
import { Button, Reveal } from "@/components/ui";
import { Shot, HeaderMedia } from "@/components/Shot";
import { DICT, fill } from "@/content/dictionary";
import { LOCALES, SITE, type Locale } from "@/content/site";
import { shot } from "@/content/media";
import { CAMPAIGN, campaignLive } from "@/content/gym";

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
    title: pt ? "Contactos" : "Contact",
    description: pt
      ? "Rua José António Varela Pinto, armazém 4, Zona Industrial da Formiga, Pombal. Entre a Sumol e a Cuétara."
      : "Rua José António Varela Pinto, armazém 4, Formiga industrial estate, Pombal. Between the Sumol and Cuétara plants.",
    alternates: { canonical: `/${locale}/contactos` },
  };
}

/**
 * CONTACTOS
 * =============================================================================
 * A página mais difícil deste site, e por uma razão simples: não há telefone
 * nem email publicados em lado nenhum. O único canal que existe de facto é o
 * Instagram.
 *
 * A tentação é desenhar uma página cheia de caixas vazias, ou pior, pôr lá um
 * formulário que envia para um email que ninguém lê. Esta faz o contrário:
 * assume que o canal é o Instagram, e põe-no ao centro, grande, com o gesto
 * certo. É honesto e converte melhor do que um formulário fantasma.
 *
 * Quando houver telefone, escreve-se em `SITE.phone` e a página passa a
 * mostrá-lo sozinha. Nada aqui precisa de ser tocado.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = DICT.contact;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    SITE.address.mapsQuery,
  )}`;
  const spacePhoto = Boolean(shot("space")?.src);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-hairline bg-carbon grain">
        <HeaderMedia slot="header-contact" locale={l} />
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 pt-36 pb-20 sm:px-8 sm:pt-44 sm:pb-28">
          <p className="t-data rise text-oxide">{SITE.address.municipality}</p>
          <h1 className="t-display rise mt-6 text-[clamp(2.75rem,8vw,6.5rem)] text-white">
            {c.title[l]}
          </h1>
          <p className="t-body rise mt-8 max-w-[52ch] text-lg text-white/85">
            {SITE.address.landmark[l]}.
          </p>
        </div>
      </section>

      <section className="relative border-b border-hairline bg-void py-20 sm:py-28">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
          {/* A COLUNA DA DIREITA SÓ EXISTE SE HOUVER FOTOGRAFIA.

              Estava aqui uma caixa 4:3 com borda e o monograma, ao lado de um
              botão para o Google Maps e por cima de uma legenda que promete
              orientação ("a Zona Industrial da Formiga não é fácil à primeira").
              Numa página de contactos, o elemento visual dominante não pode ser
              o único que não transporta informação nenhuma.

              As outras chapas vazias do site defendem-se: marcam o lugar de uma
              fotografia que o cliente vai dar. Esta não, porque competia com a
              informação em vez de a acompanhar. Sem foto, a página passa a uma
              coluna e a legenda de orientação encosta à morada, que é onde ela
              serve para alguma coisa. */}
          <div
            className={`grid gap-14 lg:gap-20 ${spacePhoto ? "lg:grid-cols-2" : "max-w-[62rem]"}`}
          >
            <Reveal>
              <dl className="border-t border-hairline">
                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{c.address[l]}</dt>
                  <dd className="t-body mt-3 text-chalk">
                    {SITE.address.street}
                    <br />
                    {SITE.address.area}
                    <br />
                    {SITE.address.postal ? `${SITE.address.postal}, ` : ""}
                    {SITE.address.municipality}
                  </dd>
                </div>

                {/* O canal que existe. Grande, porque é o único. */}
                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{c.social[l]}</dt>
                  <dd className="mt-3">
                    <a
                      href={SITE.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-numeral text-2xl text-chalk transition-colors duration-300 hover:text-oxide sm:text-3xl"
                    >
                      {SITE.social.instagramHandle}
                    </a>
                  </dd>
                </div>

                {/* Telefone: só se existir. Enquanto não existir, o site diz
                    porquê em vez de deixar uma linha vazia. */}
                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{c.phone[l]}</dt>
                  <dd className="mt-3">
                    {SITE.phone.e164 ? (
                      <a
                        href={`tel:${SITE.phone.e164}`}
                        className="t-numeral text-2xl text-chalk transition-colors duration-300 hover:text-oxide sm:text-3xl"
                      >
                        {SITE.phone.display}
                      </a>
                    ) : (
                      <span className="t-body text-steel">{c.phonePending[l]}</span>
                    )}
                  </dd>
                </div>

                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{DICT.common.openedSince[l]}</dt>
                  <dd className="t-body mt-3 text-chalk">{SITE.opened.label[l]}</dd>
                </div>
              </dl>

              {/* Sem fotografia, a orientação vem para junto da morada, que é
                  onde ela responde à pergunta que a pessoa tem. */}
              {!spacePhoto && (
                <p className="t-body mt-6 max-w-[52ch] text-steel">
                  {DICT.gym.directionsBody[l]}
                </p>
              )}

              {/* Os dois em outline, de propósito. Esta é a zona dos DADOS de
                  contacto; a conversão primária é a secção "Inscrever", em
                  baixo. Antes, a mesma ação aparecia aqui em latão cheio e lá
                  em baixo em outline, ou seja, o CTA forte vinha antes do
                  momento de decidir e o fraco no momento de decidir. */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={SITE.social.instagram} external variant="outline">
                  {c.dm[l]}
                </Button>
                <Button href={mapsHref} external variant="outline">
                  {c.directions[l]}
                </Button>
              </div>
            </Reveal>

            {spacePhoto && (
              <Reveal delay={120}>
                <Shot
                  slot="space"
                  locale={l}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="aspect-4/3 w-full border border-hairline"
                />
                <p className="t-body mt-5 text-sm text-steel">{DICT.gym.directionsBody[l]}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- INSCREVER */}
      <section
        id="aderir"
        className="relative isolate overflow-hidden bg-paper py-20 text-ink sm:py-28 grain grain-ink"
      >
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal>
              <h2 className="t-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
                {c.joinTitle[l]}
              </h2>
              <p className="t-body mt-6 max-w-[50ch] text-lg text-ink-dim">{c.joinBody[l]}</p>
              <div className="mt-10">
                <Button href={SITE.social.instagram} external variant="solid-on-paper">
                  {c.dm[l]}
                </Button>
              </div>
            </Reveal>

            {campaignLive() && (
              <Reveal delay={120} className="lg:pt-4">
                <div className="border-l-2 border-oxide-deep pl-6">
                  <p className="t-data text-oxide-deep">{CAMPAIGN.name[l]}</p>
                  <p className="t-body mt-3 text-ink-dim">
                    {fill(DICT.home.campaignBody[l], { dates: CAMPAIGN.dates[l] })}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
