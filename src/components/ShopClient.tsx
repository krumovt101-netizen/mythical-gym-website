"use client";

/**
 * LOJA: a parte interativa.
 * =============================================================================
 * O catálogo inteiro é provisório (`draft: true` em shop.ts) e as imagens dos
 * produtos estão a null de propósito: merch de banco de imagens era vender
 * roupa de outra gente. A chapa desenhada (grelha + placa da marca) é a peça
 * do sistema, não um remendo.
 *
 * A REGRA DO LATÃO vale aqui como em todo o site: texto sobre chapa de latão
 * é sempre ESCURO (text-vault), e o hover clareia. O v1 tinha cinco sítios
 * com branco sobre latão (1,8:1); não voltam.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Plate } from "./Wordmark";
import { ProvisionalStamp } from "./registry/ProvisionalStamp";
import { Reveal } from "./motion/Reveal";
import { DICT } from "@/content/dictionary";
import { CATEGORIES, PRODUCTS, productRef, type Category, type Product } from "@/content/shop";
import type { Locale } from "@/content/site";

/** Referência de arquivo. O catálogo é um registo numerado, não uma montra. */
const categoryName = (id: Category, locale: Locale) =>
  CATEGORIES.find((c) => c.id === id)?.name[locale] ?? "";

/* ---------------------------------------------------------------------------
   Adicionar: confirma no botão durante 1,5 s e abre o carrinho.
   ------------------------------------------------------------------------ */

function useAdder() {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const commit = (slug: string, size: string | null) => {
    add(slug, size);
    setOpen(true);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };

  return { added, commit };
}

/* ---------------------------------------------------------------------------
   Seletor de tamanho
   ------------------------------------------------------------------------ */

function SizePicker({
  sizes,
  value,
  onSelect,
  locale,
  name,
}: {
  sizes: string[];
  value: string | null;
  onSelect: (size: string) => void;
  locale: Locale;
  name: string;
}) {
  return (
    <div>
      <p className="t-data mb-2.5 text-mercury">{DICT.shop.size[locale]}</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${DICT.shop.size[locale]}: ${name}`}>
        {sizes.map((s) => {
          const on = value === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(s)}
              className={`t-numeral min-w-11 border px-3 py-2 text-xs transition-colors duration-200 ${
                on
                  ? "border-brass bg-brass text-vault"
                  : "border-rule-strong text-mercury hover:border-cream hover:text-cream"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Chapa: a moldura do produto. Foto se houver, placa gravada se não houver.
   ------------------------------------------------------------------------ */

function Plating({
  product,
  locale,
  sizes,
  plate,
  className = "",
}: {
  product: Product;
  locale: Locale;
  sizes: string;
  plate: number;
  className?: string;
}) {
  // Com foto por baixo, os cantos gravados assentam em pixels que não
  // controlamos: ganham chapa opaca (branco sobre vault/85 passa de 12:1).
  const corner = product.image ? "bg-vault/85 px-2 py-1 text-white" : "text-mercury";

  return (
    <div className={`grain relative overflow-hidden bg-base-2 ${className}`}>
      {product.image ? (
        <Image
          src={product.image}
          alt={
            product.draft
              ? `${product.name[locale]}. ${DICT.common.provisionalAlt[locale]}`
              : product.name[locale]
          }
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <>
          <span aria-hidden className="ruled absolute inset-0 opacity-50" />
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center opacity-30 transition-opacity duration-500 group-hover:opacity-60"
          >
            <Plate size={plate} />
          </span>
        </>
      )}
      <span className={`t-ref absolute left-3 top-3 z-2 text-xs ${corner}`}>
        {productRef(product.slug)}
      </span>
      <span className={`t-data absolute bottom-3 right-3 z-2 ${corner}`}>
        {categoryName(product.category, locale)}
      </span>
      {product.draft && product.image && (
        <ProvisionalStamp locale={locale} position="bottom-left" />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Cartão do catálogo
   ------------------------------------------------------------------------ */

function Card({ product, locale }: { product: Product; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/loja/${product.slug}`}
      className="group flex w-full flex-col bg-base-2"
      aria-label={product.name[locale]}
    >
      <Plating
        product={product}
        locale={locale}
        plate={64}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
        className="aspect-4/5 w-full border-b border-rule"
      />
      <span className="flex items-baseline justify-between gap-4 p-5 sm:p-6">
        <span className="min-w-0">
          <span className="t-headline block text-lg text-cream transition-colors duration-300 group-hover:text-brass">
            {product.name[locale]}
          </span>
          <span className="t-body mt-1.5 block text-sm text-mercury">{product.tagline[locale]}</span>
        </span>
        <span className="t-display shrink-0 text-2xl text-cream">
          {product.price}
          <span className="t-data ml-1 align-super text-mercury">€</span>
        </span>
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------------------
   Catálogo
   ------------------------------------------------------------------------ */

export function ShopClient({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<Category | "all">("all");

  const shown = useMemo(
    () => (filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  );

  const tabs: { id: Category | "all"; name: string; count: number }[] = [
    { id: "all", name: DICT.shop.all[locale], count: PRODUCTS.length },
    ...CATEGORIES.map((c) => ({
      id: c.id as Category | "all",
      name: c.name[locale],
      count: PRODUCTS.filter((p) => p.category === c.id).length,
    })),
  ];

  return (
    <section className="border-t border-rule bg-base py-10 sm:py-12">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        {/* O h1 vive na página; os cartões são h3. Sem este h2 o índice de
            cabeçalhos saltava um nível e o catálogo ficava sem nome. */}
        <h2 className="sr-only">{DICT.shop.title[locale]}</h2>

        <div className="no-scrollbar -mx-5 mb-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {tabs.map((tab) => {
              const on = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(tab.id)}
                  className={`t-data flex shrink-0 items-center gap-2.5 border px-4 py-2.5 transition-colors duration-300 ${
                    on
                      ? "border-brass bg-brass text-vault"
                      : "border-rule-strong text-mercury hover:border-cream hover:text-cream"
                  }`}
                >
                  {tab.name}
                  <span className={`t-numeral text-[0.65rem] ${on ? "text-vault/70" : "text-mercury/70"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* As linhas da grelha são BORDAS DAS CÉLULAS, e não um `gap-px` com
            fundo: com 5 produtos em 3 colunas sobraria uma célula fantasma
            cinzenta. Com bordas nas células o problema não pode acontecer. */}
        <div className="grid border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal
              key={p.slug}
              index={i % 3}
              className="flex border-b border-r border-rule bg-base-2"
            >
              <Card product={p} locale={locale} />
            </Reveal>
          ))}
          {/* A célula que sobra fecha o documento em vez de ficar caixa vazia. */}
          <div className="flex min-h-32 items-end border-b border-r border-rule bg-base p-6">
            <p className="t-data text-mercury/70">
              {locale === "pt"
                ? `Fim do catálogo · ${shown.length} artigo${shown.length === 1 ? "" : "s"}`
                : `End of catalogue · ${shown.length} item${shown.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Compra na página de produto
   ------------------------------------------------------------------------ */

export function ProductPurchase({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const [size, setSize] = useState<string | null>(null);
  const { added, commit } = useAdder();

  const needsSize = product.sizes !== null;
  const blocked = needsSize && size === null;

  const label = added
    ? DICT.shop.added[locale]
    : blocked
      ? DICT.shop.chooseSize[locale]
      : DICT.shop.addToCart[locale];

  return (
    <div className="flex flex-col gap-7">
      {product.sizes && (
        <SizePicker
          sizes={product.sizes}
          value={size}
          onSelect={setSize}
          locale={locale}
          name={product.name[locale]}
        />
      )}

      <button
        type="button"
        disabled={blocked}
        onClick={() => commit(product.slug, size)}
        className={`t-data w-full border px-6 py-4 transition-colors duration-300 sm:w-auto sm:min-w-72 ${
          blocked
            ? "cursor-not-allowed border-rule text-mercury/60"
            : added
              ? "border-brass bg-brass text-vault"
              : "border-brass bg-brass text-vault hover:bg-brass-bright"
        }`}
      >
        {label}
      </button>
    </div>
  );
}

/** Reexportada para a página de produto desenhar a mesma chapa. */
export function ProductPlating({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  return (
    <Plating
      product={product}
      locale={locale}
      plate={104}
      sizes="(min-width: 1024px) 45vw, 92vw"
      className="group aspect-4/5 w-full border border-rule"
    />
  );
}
