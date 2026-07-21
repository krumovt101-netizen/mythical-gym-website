import type { Metadata } from "next";
import { ShopClient } from "@/components/ShopClient";
import { Section } from "@/components/registry/Section";
import { Eyebrow } from "@/components/registry/Eyebrow";
import { Figure } from "@/components/registry/Figure";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { DICT } from "@/content/dictionary";
import { PRODUCTS } from "@/content/shop";
import { LOCALES, SITE, type Locale } from "@/content/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: DICT.shop.title[l],
    description: DICT.shop.lede[l],
    alternates: {
      canonical: `/${l}/loja`,
      languages: { pt: "/pt/loja", en: "/en/loja" },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <>
      <Section
        band="vault"
        pad="none"
        bleed={
          <div className="absolute inset-0">
            <Figure
              slot="header-shop"
              locale={l}
              priority
              sizes="100vw"
              className="size-full"
              stamp="bottom-right"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-vault via-vault/55 to-vault/20"
            />
          </div>
        }
      >
        <div className="pb-16 pt-40 sm:pb-20 sm:pt-48">
          <Reveal effect="fade">
            <Eyebrow>{SITE.address.municipality}</Eyebrow>
          </Reveal>
          <RevealText
            as="h1"
            text={DICT.shop.title[l]}
            startIndex={1}
            className="t-display mt-5 text-[clamp(3rem,11vw,7.5rem)] text-cream"
          />
          <Reveal effect="rise" index={2}>
            <div className="mt-9 flex flex-col gap-8 border-t border-rule pt-8 sm:flex-row sm:items-start sm:justify-between">
              <p className="t-lede max-w-xl text-lg text-cream-dim">{DICT.shop.lede[l]}</p>
              {/* Com rótulo, o número é o que é: contagem do catálogo, não o
                  contador do carrinho ali ao lado. */}
              <p className="t-data flex shrink-0 items-baseline gap-3 text-mercury">
                <span className="t-numeral text-xl text-cream">{PRODUCTS.length}</span>
                {l === "pt" ? "artigos no catálogo" : "items in the catalogue"}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <ShopClient locale={l} />

      <Section band="paper" ruleTop pad="regular">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-16">
          <Reveal effect="rise">
            <p className="t-lede max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">
              {DICT.shop.checkoutNote[l]}
            </p>
          </Reveal>
          {/* NÃO HÁ TELEFONE. O canal que existe é o Instagram, e é esse que
              aqui vai. O bloco volta a telefone sozinho no dia em que
              SITE.phone existir. */}
          <Reveal effect="rise" index={1} className="md:justify-self-end">
            <div className="border-t border-paper-rule pt-5 md:text-right">
              {SITE.phone.e164 ? (
                <>
                  <p className="t-data text-ink-dim">{DICT.contact.phone[l]}</p>
                  <a
                    href={`tel:${SITE.phone.e164}`}
                    className="t-numeral mt-2 block text-2xl text-ink transition-colors duration-300 hover:text-brass-deep sm:text-3xl"
                  >
                    {SITE.phone.display}
                  </a>
                </>
              ) : (
                <>
                  <p className="t-data text-ink-dim">{DICT.contact.social[l]}</p>
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-numeral mt-2 block text-2xl text-ink transition-colors duration-300 hover:text-brass-deep sm:text-3xl"
                  >
                    {SITE.social.instagramHandle}
                  </a>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
