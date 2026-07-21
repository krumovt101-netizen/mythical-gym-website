import type { Metadata } from "next";
import { ShopClient } from "@/components/ShopClient";
import { HeaderMedia } from "@/components/Shot";
import { Reveal } from "@/components/ui";
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
      <section className="relative isolate overflow-hidden bg-carbon pb-16 pt-32 sm:pb-20 sm:pt-40 grain">
        <HeaderMedia slot="header-shop" locale={l} />
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <Reveal>
            <p className="t-data text-oxide">{SITE.address.municipality}</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display mt-5 text-[clamp(3rem,11vw,7.5rem)] text-chalk">
              {DICT.shop.title[l]}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 flex flex-col gap-8 border-t border-hairline pt-8 sm:flex-row sm:items-start sm:justify-between">
              <p className="t-body max-w-xl text-base text-chalk-dim sm:text-lg">
                {DICT.shop.lede[l]}
              </p>
              {/* O número tinha aqui um ícone minúsculo e nenhum rótulo, e a
                  poucos centímetros do saco do carrinho no cabeçalho: lia-se
                  como contador de carrinho e conflituava com ele. Com rótulo,
                  passa a ser o que é. */}
              <p className="t-data flex shrink-0 items-baseline gap-3 text-steel">
                <span className="t-numeral text-xl text-chalk">{PRODUCTS.length}</span>
                {l === "pt" ? "artigos no catálogo" : "items in the catalogue"}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ShopClient locale={l} />

      <section className="border-t border-hairline bg-paper py-16 text-ink sm:py-20">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-16">
            <Reveal>
              <p className="t-body max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">
                {DICT.shop.checkoutNote[l]}
              </p>
            </Reveal>
            {/* NÃO HÁ TELEFONE. Isto renderizava `tel:null` com o texto vazio:
                um rótulo TELEFONE por cima de um link para lado nenhum, na
                única página que promete que a encomenda segue por mensagem.
                O canal que existe é o Instagram, e é esse que aqui vai. O bloco
                volta a telefone sozinho no dia em que SITE.phone existir. */}
            <Reveal delay={60} className="md:justify-self-end">
              <div className="border-t border-paper-line pt-5 md:text-right">
                {SITE.phone.e164 ? (
                  <>
                    <p className="t-data text-ink-dim">{DICT.contact.phone[l]}</p>
                    <a
                      href={`tel:${SITE.phone.e164}`}
                      className="t-numeral mt-2 block text-2xl text-ink transition-colors duration-300 hover:text-oxide-deep sm:text-3xl"
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
                      className="t-numeral mt-2 block text-2xl text-ink transition-colors duration-300 hover:text-oxide-deep sm:text-3xl"
                    >
                      {SITE.social.instagramHandle}
                    </a>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
