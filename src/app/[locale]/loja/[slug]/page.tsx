import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductPlating, ProductPurchase } from "@/components/ShopClient";
import { Reveal } from "@/components/ui";
import { DICT } from "@/content/dictionary";
import { CATEGORIES, PRODUCTS, formatPrice, productBySlug, productRef } from "@/content/shop";
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
    <section className="bg-void pb-24 pt-12 sm:pb-32 sm:pt-16">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <Link
          href={`/${l}/loja`}
          className="t-data inline-flex items-center gap-2.5 text-steel transition-colors duration-300 hover:text-chalk"
        >
          <span aria-hidden>←</span>
          {DICT.shop.backToShop[l]}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ProductPlating product={product} locale={l} />
          </Reveal>

          <Reveal delay={60} className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="t-data text-oxide">{productRef(product.slug)}</span>
              <span aria-hidden className="h-px flex-1 bg-hairline" />
              <span className="t-data text-steel-dim">{category?.name[l]}</span>
            </div>

            <h1 className="t-display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] text-chalk">
              {product.name[l]}
            </h1>
            <p className="t-body mt-4 text-lg text-chalk-dim">{product.tagline[l]}</p>

            <p className="t-numeral mt-8 text-4xl text-chalk sm:text-5xl">
              {formatPrice(product.price, l)}
            </p>

            <p className="t-body mt-8 max-w-xl border-t border-hairline pt-8 text-base leading-relaxed text-steel">
              {product.description[l]}
            </p>

            <div className="mt-10">
              <ProductPurchase product={product} locale={l} />
            </div>

            <p className="t-body mt-8 max-w-xl border-t border-hairline-soft pt-6 text-xs leading-relaxed text-steel-dim">
              {DICT.shop.checkoutNote[l]}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
