import type { Metadata } from "next";
import { Section } from "@/components/registry/Section";
import { Figure } from "@/components/registry/Figure";
import { Button } from "@/components/registry/Button";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
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
 * A página mais difícil deste site: não há telefone nem email publicados em
 * lado nenhum. O único canal que existe de facto é o Instagram.
 *
 * A tentação era uma página de caixas vazias, ou um formulário que envia para
 * um email que ninguém lê. Esta faz o contrário: assume que o canal é o
 * Instagram e põe-no ao centro, grande, com o gesto certo. É honesto e
 * converte melhor do que um formulário fantasma.
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
      {/* Folha de contactos batida à máquina: o título e a referência que
          vale mais do que o número da porta. Sem fotografia de ambiente. */}
      <Section band="vault" pad="none">
        <div className="pb-14 pt-36 sm:pb-16 sm:pt-44">
          {/* Nesta página o monumento não é a palavra "Contactos": é a
              referência que faz alguém chegar lá. */}
          <Reveal effect="fade">
            <h1 className="t-data text-mercury">{c.title[l]}</h1>
          </Reveal>
          <RevealText
            as="p"
            startIndex={1}
            text={`${SITE.address.landmark[l]}.`}
            className="t-display mt-7 max-w-[16ch] text-[clamp(2.8rem,8.5vw,8rem)] text-cream"
          />
        </div>
      </Section>

      <Section band="base" ruleTop>
        {/* A COLUNA DA DIREITA SÓ EXISTE SE HOUVER FOTOGRAFIA. Numa página de
            contactos, o elemento visual dominante não pode ser o único que não
            transporta informação nenhuma. Sem foto, a legenda de orientação
            encosta à morada, que é onde serve para alguma coisa. */}
        <div className={`grid gap-14 lg:gap-20 ${spacePhoto ? "lg:grid-cols-2" : "max-w-4xl"}`}>
          <Reveal effect="rise">
            <dl className="border-t border-rule">
              <div className="border-b border-rule py-7">
                <dt className="t-data text-mercury">{c.address[l]}</dt>
                <dd className="t-body mt-3 text-cream">
                  {SITE.address.street}
                  <br />
                  {SITE.address.area}
                  <br />
                  {SITE.address.postal ? `${SITE.address.postal}, ` : ""}
                  {SITE.address.municipality}
                </dd>
              </div>

              {/* O canal que existe. Grande, porque é o único. */}
              <div className="border-b border-rule py-7">
                <dt className="t-data text-mercury">{c.social[l]}</dt>
                <dd className="mt-3">
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-numeral text-2xl text-cream transition-colors duration-300 hover:text-brass sm:text-3xl"
                  >
                    {SITE.social.instagramHandle}
                  </a>
                </dd>
              </div>

              {/* Telefone: só se existir. Enquanto não existir, o site diz
                  porquê em vez de deixar uma linha vazia. */}
              <div className="border-b border-rule py-7">
                <dt className="t-data text-mercury">{c.phone[l]}</dt>
                <dd className="mt-3">
                  {SITE.phone.e164 ? (
                    <a
                      href={`tel:${SITE.phone.e164}`}
                      className="t-numeral text-2xl text-cream transition-colors duration-300 hover:text-brass sm:text-3xl"
                    >
                      {SITE.phone.display}
                    </a>
                  ) : (
                    <span className="t-body text-mercury">{c.phonePending[l]}</span>
                  )}
                </dd>
              </div>

              <div className="border-b border-rule py-7">
                <dt className="t-data text-mercury">{DICT.common.openedSince[l]}</dt>
                <dd className="t-body mt-3 text-cream">{SITE.opened.label[l]}</dd>
              </div>
            </dl>

            {!spacePhoto && (
              <p className="t-body mt-6 max-w-xl text-mercury">{DICT.gym.directionsBody[l]}</p>
            )}

            {/* Os dois em hairline, de propósito: esta é a zona dos DADOS.
                A conversão primária é a secção "Inscrever", em baixo. O CTA
                forte não vem antes do momento de decidir. */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={SITE.social.instagram} external variant="hairline">
                {c.dm[l]}
              </Button>
              <Button href={mapsHref} external variant="hairline">
                {c.directions[l]}
              </Button>
            </div>
          </Reveal>

          {spacePhoto && (
            <Reveal effect="rise" index={2}>
              <Figure
                slot="space"
                locale={l}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="aspect-4/3 w-full border border-rule"
              />
              <p className="t-body mt-5 text-sm text-mercury">{DICT.gym.directionsBody[l]}</p>
            </Reveal>
          )}
        </div>
      </Section>

      {/* ---------------------------------------------------------- INSCREVER */}
      <Section band="paper" id="aderir" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <RevealText
              as="h2"
              text={c.joinTitle[l]}
              className="t-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink"
            />
            <Reveal effect="rise" index={2}>
              <p className="t-lede mt-7 max-w-xl text-xl text-ink-dim">{c.joinBody[l]}</p>
              <div className="mt-10">
                <Button href={SITE.social.instagram} external variant="ink">
                  {c.dm[l]}
                </Button>
              </div>
            </Reveal>
          </div>

          {campaignLive() && (
            <Reveal effect="rise" index={3} className="lg:pt-4">
              <div className="border-l-2 border-brass-deep pl-6">
                <p className="t-data text-brass-deep">{CAMPAIGN.name[l]}</p>
                <p className="t-body mt-3 text-ink-dim">
                  {fill(DICT.home.campaignBody[l], { dates: CAMPAIGN.dates[l] })}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  );
}
