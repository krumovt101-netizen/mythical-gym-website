"use client";

/**
 * LOJA: a parte interativa.
 * =============================================================================
 * As fotos que estão nos produtos são de banco de imagens, como as do resto do
 * site, e o catálogo inteiro é provisório (`draft: true` em shop.ts). Enquanto
 * assim for, cada foto leva a etiqueta de provisório, exatamente como as do
 * ginásio. Quando o cliente puser as fotos e os preços verdadeiros, muda o
 * `draft` e a etiqueta cai sozinha.
 *
 * A chapa desenhada (ferro + grão + disco), para quando não há foto nenhuma, é
 * a peça do sistema e não um remendo: é o mesmo objeto do cabeçalho do site.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Plate } from "./Wordmark";
import { ProvisionalTag } from "./Shot";
import { Reveal } from "./ui";
import { DICT } from "@/content/dictionary";
import { CATEGORIES, PRODUCTS, formatPrice, productRef, type Category, type Product } from "@/content/shop";
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
      <p className="t-data mb-2.5 text-steel-dim">{DICT.shop.size[locale]}</p>
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
                  ? "border-oxide bg-oxide-solid text-white"
                  : "border-hairline text-steel hover:border-steel hover:text-chalk"
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
   Chapa: a moldura do produto. Foto se houver, disco gravado se não houver.
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
  // Com foto por baixo, os dois cantos gravados deixam de assentar em cinzento
  // liso e passam a assentar em pixels que não controlamos. Ganham chapa.
  const corner = product.image
    ? "bg-carbon/85 px-2 py-1 text-white"
    : "text-steel-dim";

  return (
    <div className={`grain relative overflow-hidden bg-iron-2 ${className}`}>
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
            className="absolute inset-0 grid place-items-center text-hairline transition-colors duration-500 group-hover:text-oxide"
          >
            <Plate size={plate} />
          </span>
        </>
      )}
      <span className={`t-data absolute left-3 top-3 z-[2] ${corner}`}>
        {productRef(product.slug)}
      </span>
      <span className={`t-data absolute bottom-3 right-3 z-[2] ${corner}`}>
        {categoryName(product.category, locale)}
      </span>
      {product.draft && product.image && (
        <ProvisionalTag locale={locale} position="bottom-left" />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Cartão do catálogo
   ------------------------------------------------------------------------ */

function Card({ product, locale }: { product: Product; locale: Locale }) {
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
    <article className="group flex w-full flex-col bg-iron transition-colors duration-300 hover:bg-iron-2">
      <Link
        href={`/${locale}/loja/${product.slug}`}
        className="block"
        aria-label={product.name[locale]}
      >
        <Plating
          product={product}
          locale={locale}
          plate={64}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="aspect-4/5 w-full border-b border-hairline"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="t-headline text-lg text-chalk">
              <Link
                href={`/${locale}/loja/${product.slug}`}
                className="transition-colors duration-300 hover:text-oxide"
              >
                {product.name[locale]}
              </Link>
            </h3>
            <p className="t-body mt-1.5 text-sm text-steel">{product.tagline[locale]}</p>
          </div>
          <p className="t-numeral shrink-0 text-lg text-chalk">
            {formatPrice(product.price, locale)}
          </p>
        </div>

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
          className={`t-data mt-auto w-full border px-5 py-3.5 transition-colors duration-300 ${
            blocked
              ? "cursor-not-allowed border-hairline-soft text-steel-dim"
              : added
                ? "border-oxide bg-oxide-solid text-white"
                : "border-hairline text-chalk hover:border-oxide hover:bg-oxide-solid hover:text-white"
          }`}
        >
          {label}
        </button>
      </div>
    </article>
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
    <section className="border-t border-hairline bg-void py-16 sm:py-20">
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
                      ? "border-oxide bg-oxide-solid text-white"
                      : "border-hairline text-steel hover:border-steel hover:text-chalk"
                  }`}
                >
                  {tab.name}
                  <span className={`t-numeral text-[0.65rem] ${on ? "text-chalk" : "text-steel-dim"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* As linhas da grelha são BORDAS DAS CÉLULAS, e não um fundo do
            container visto através de `gap-px`.

            O truque do `gap-px bg-hairline` é elegante enquanto o número de
            itens for múltiplo do número de colunas. Com 5 produtos em 3 colunas
            sobra uma célula que não existe, e o que se vê nela é o fundo do
            container: um retângulo cinzento que se lê como um cartão partido.
            Com bordas nas células o problema não pode acontecer, seja qual for
            a contagem. */}
        <div className="grid border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={(i % 3) * 60}
              className="flex border-b border-r border-hairline bg-iron"
            >
              <Card product={p} locale={locale} />
            </Reveal>
          ))}
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
            ? "cursor-not-allowed border-hairline-soft text-steel-dim"
            : added
              ? "border-oxide bg-oxide-solid text-white"
              : "border-oxide bg-oxide-solid text-white hover:bg-oxide-dim"
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
      className="aspect-4/5 w-full border border-hairline"
    />
  );
}
