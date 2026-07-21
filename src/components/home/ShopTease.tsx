import Link from "next/link";
import { Section } from "../registry/Section";
import { Eyebrow } from "../registry/Eyebrow";
import { Button } from "../registry/Button";
import { Reveal } from "../motion/Reveal";
import { Plate } from "../Wordmark";
import { DICT } from "@/content/dictionary";
import { featuredProducts, productRef, formatPrice } from "@/content/shop";
import type { Locale } from "@/content/site";

/**
 * A montra da loja: grelha de filetes, sem cartões. Enquanto os produtos não
 * tiverem fotografia própria (image: null, de propósito — merch de banco de
 * imagens era vender roupa de outra gente), a chapa é a placa da marca.
 */
export function ShopTease({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const products = featuredProducts();
  if (products.length === 0) return null;

  return (
    <Section band="base" ruleTop pad="regular">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <Reveal effect="rise">
          <Eyebrow>{d.shopTitle[locale]}</Eyebrow>
          <h2 className="t-headline mt-5 text-3xl text-cream sm:text-4xl">
            {d.shopBody[locale]}
          </h2>
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
              className="group flex flex-col gap-6 bg-base p-6 transition-colors duration-300 hover:bg-base-2 sm:p-8"
            >
              <span className="t-ref text-xs text-mercury">{productRef(p.slug)}</span>
              <span className="grid aspect-square place-items-center">
                <Plate
                  size={52}
                  className="opacity-25 transition-opacity duration-500 group-hover:opacity-60"
                />
              </span>
              <span className="flex items-baseline justify-between gap-4">
                <span className="t-body text-sm text-cream">{p.name[locale]}</span>
                <span className="t-numeral shrink-0 text-sm text-brass">
                  {formatPrice(p.price, locale)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
