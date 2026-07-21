import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ThesisStrip } from "@/components/home/ThesisStrip";
import { LotSection } from "@/components/home/LotSection";
import { FilmBeat } from "@/components/home/FilmBeat";
import { ShopTease } from "@/components/home/ShopTease";
import { Button } from "@/components/registry/Button";
import { DICT } from "@/content/dictionary";
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
 * A HOMEPAGE É O FILME. Três planos da mesma sala, esfregados pelo scroll,
 * com o registo como sistema de legendas entre eles:
 *
 *   ABERTURA (travelling pelo corredor, título gigante)
 *   → a tese, como movimento tipográfico
 *   → o DOSSIER Nº 001 em papel (o lote, não uma lista)
 *   → O FERRO (macro dos discos)
 *   → a montra
 *   → FECHO (o candeeiro apaga-se; o site acaba no escuro, com um gesto).
 *
 * Toda a copy vem de dictionary.ts e todos os dados de src/content/.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale; // validado no layout
  const film = DICT.home.film;

  return (
    <>
      <Hero locale={l} />
      <ThesisStrip locale={l} />
      <LotSection locale={l} />
      <FilmBeat
        slot="ferro"
        locale={l}
        kicker={film.ferroKicker[l]}
        line={film.ferroLine[l]}
      />
      <ShopTease locale={l} />
      <FilmBeat
        slot="fecho"
        locale={l}
        kicker={film.fechoKicker[l]}
        line={film.fechoLine[l]}
      >
        <Button href={`/${l}/contactos#aderir`} arrow>
          {DICT.nav.join[l]}
        </Button>
      </FilmBeat>
    </>
  );
}
