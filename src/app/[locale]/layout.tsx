import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Main } from "@/components/Main";
import { LOCALES, isLocale, SITE, type Locale } from "@/content/site";

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
    title: {
      default: "Mythical Gym, Pombal",
      template: "%s · Mythical Gym",
    },
    description: pt
      ? "Ginásio na Zona Industrial da Formiga, em Pombal, com equipamento catalogado por marca e ano de fabrico. Aberto desde 1 de julho de 2026."
      : "A gym in the Formiga industrial estate, Pombal, with equipment catalogued by maker and year of manufacture. Open since 1 July 2026.",
    alternates: {
      canonical: `/${locale}`,
      languages: { pt: "/pt", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  /**
   * Dados estruturados. É o que faz o Google mostrar a morada e o resto do
   * cartão nos resultados, e para um ginásio novo e sem notoriedade é a peça de
   * SEO local que mais rende.
   *
   * Só entram campos que EXISTEM. O telefone, o código postal e o horário estão
   * por confirmar, e um campo inventado aqui é pior do que campo nenhum: o
   * Google publica-o como facto e a casa passa a ser responsável por ele. Por
   * isso os nulos são removidos antes de serializar, e não escritos como null.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: SITE.name,
    url: `${SITE.url}/${l}`,
    ...(SITE.phone.e164 ? { telephone: SITE.phone.e164 } : {}),
    foundingDate: SITE.opened.iso,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.street}, ${SITE.address.area}`,
      addressLocality: SITE.address.municipality,
      ...(SITE.address.postal ? { postalCode: SITE.address.postal } : {}),
      addressCountry: "PT",
    },
    sameAs: [SITE.social.instagram, SITE.social.facebook].filter(Boolean),
  };

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        // O objeto é nosso e estático, não há aqui entrada de utilizador.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="t-data sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-oxide-solid focus:px-4 focus:py-3 focus:text-carbon"
      >
        {l === "pt" ? "Saltar para o conteúdo" : "Skip to content"}
      </a>
      <Header locale={l} />
      <CartDrawer locale={l} />
      <Main locale={l}>{children}</Main>
      <Footer locale={l} />
    </CartProvider>
  );
}
