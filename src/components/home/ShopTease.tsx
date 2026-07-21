import Link from "next/link";
import Image from "next/image";
import { Section } from "../registry/Section";
import { Button } from "../registry/Button";
import { ProvisionalStamp } from "../registry/ProvisionalStamp";
import { Reveal } from "../motion/Reveal";
import { DICT } from "@/content/dictionary";
import { featuredProducts, productRef } from "@/content/shop";
import type { Locale } from "@/content/site";

/**
 * A montra: agora com as peças À VISTA (maquetes geradas, lisas, com o
 * carimbo de provisório), preços como numerais de catálogo — o algarismo
 * grande em serifa, o € pequeno — e referências contíguas MY-01…04.
 */
export function ShopTease({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const products = featuredProducts();
  if (products.length === 0) return null;

  return (
    <Section band="base" ruleTop pad="regular">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <Reveal effect="rise">
          <h2 className="t-display text-[clamp(2rem,4.5vw,4rem)] text-cream">
            {d.shopTitle[locale]}
          </h2>
          <p className="t-lede mt-4 text-lg text-mercury">{d.shopBody[locale]}</p>
        </Reveal>
        <Reveal effect="fade" index={1}>
          <Button href={`/${locale}/loja`} variant="hairline">
            {d.shopLink[locale]}
          </Button>
        </Reveal>
      </div>

      <Reveal effect="rise" index={2}>
        <div className="mt-14 grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/loja/${p.slug}`}
              className="group bg-base transition-colors duration-300 hover:bg-base-2"
            >
              <span className="relative block aspect-4/5 overflow-hidden">
                {p.image ? (
                  <>
                    <Image
                      src={p.image}
                      alt={
                        p.draft
                          ? `${p.name[locale]}. ${DICT.common.provisionalAlt[locale]}`
                          : p.name[locale]
                      }
                      fill
                      sizes="(min-width: 1024px) 24vw, 46vw"
                      className="object-cover transition-transform duration-700 ease-(--ease-reg) group-hover:scale-[1.04]"
                    />
                    {p.draft && <ProvisionalStamp locale={locale} position="bottom-left" />}
                  </>
                ) : (
                  <span className="ruled absolute inset-0 opacity-40" aria-hidden />
                )}
                <span
                  className="t-ref absolute left-4 top-4 z-2 text-xs text-white/85"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                >
                  {productRef(p.slug)}
                </span>
              </span>
              <span className="flex items-baseline justify-between gap-4 p-5">
                <span className="t-body text-sm text-cream">{p.name[locale]}</span>
                <span className="t-display shrink-0 text-2xl text-cream">
                  {p.price}
                  <span className="t-data ml-1 align-super text-mercury">€</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
