import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ThesisStrip } from "@/components/home/ThesisStrip";
import { LotSection } from "@/components/home/LotSection";
import { RegistryLedger } from "@/components/home/RegistryLedger";
import { FactsStrip } from "@/components/home/FactsStrip";
import { ShopTease } from "@/components/home/ShopTease";
import { VisitBand } from "@/components/home/VisitBand";
import type { Locale } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pt = locale === "pt";
  return {
    title: {
      absolute: pt
        ? "Mythical Gym, Pombal: ferro que já não se fabrica"
        : "Mythical Gym, Pombal: iron they no longer make",
    },
  };
}

/**
 * A HOMEPAGE: o catálogo da casa, na ordem de um catálogo.
 *
 *   herói tipográfico  →  a tese  →  A PEÇA (lote Nº 001: ficha em papel +
 *   vista explodida)  →  o livro de registo  →  os factos em estampa  →
 *   a montra da loja  →  a visita.
 *
 * Toda a copy vem de dictionary.ts e todos os dados de src/content/. Esta
 * página não sabe factos: compõe-nos.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale; // validado no layout

  return (
    <>
      <Hero locale={l} />
      <ThesisStrip locale={l} />
      <LotSection locale={l} />
      <RegistryLedger locale={l} />
      <FactsStrip locale={l} />
      <ShopTease locale={l} />
      <VisitBand locale={l} />
    </>
  );
}
