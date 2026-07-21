import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductPlating, ProductPurchase } from "@/components/ShopClient";
import { Reveal } from "@/components/motion/Reveal";
import { DICT } from "@/content/dictionary";
import { CATEGORIES, PRODUCTS, productBySlug, productRef } from "@/content/shop";
import { LOCALES, type Locale } from "@/content/site";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => PRODUCTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: product.name[l],
    description: product.tagline[l],
    alternates: {
      canonical: `/${l}/loja/${slug}`,
      languages: { pt: `/pt/loja/${slug}`, en: `/en/loja/${slug}` },
    },
  };
}

/** A página de produto como ficha de catálogo: referência, chapa, specs. */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const product = productBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.id === product.category);

  return (
    <section className="bg-base pb-24 pt-28 sm:pb-32 sm:pt-32">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <Link
          href={`/${l}/loja`}
          className="t-data inline-flex items-center gap-2.5 text-mercury transition-colors duration-300 hover:text-cream"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M10 6H2m0 0l3.5-3.5M2 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {DICT.shop.backToShop[l]}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal effect="rise">
            <ProductPlating product={product} locale={l} />
          </Reveal>

          <Reveal effect="rise" index={1} className="flex flex-col">
            {/* O NOME é o monumento; a referência é uma nota de latão. Um
                fólio gigante para uma t-shirt de 25 € era fardar demais. */}
            <div className="flex items-center gap-4">
              <span className="t-ref text-brass">{productRef(product.slug)}</span>
              <span aria-hidden className="h-px flex-1 bg-rule" />
              <span className="t-data text-mercury">{category?.name[l]}</span>
            </div>

            <h1 className="t-display mt-7 text-[clamp(2.8rem,7.5vw,6.5rem)] text-cream">
              {product.name[l]}
            </h1>
            <p className="t-lede mt-4 text-lg text-cream-dim">{product.tagline[l]}</p>

            <p className="t-display mt-8 text-5xl text-cream sm:text-6xl">
              {product.price}
              <span className="t-data ml-2 align-super text-mercury">€</span>
            </p>

            <p className="t-body mt-8 max-w-xl border-t border-rule pt-8 text-base leading-relaxed text-mercury">
              {product.description[l]}
            </p>

            <div className="mt-10">
              <ProductPurchase product={product} locale={l} />
            </div>

            <p className="t-body mt-8 max-w-xl border-t border-rule-soft pt-6 text-xs leading-relaxed text-mercury/80">
              {DICT.shop.checkoutNote[l]}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
