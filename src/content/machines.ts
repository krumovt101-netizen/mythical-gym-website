/**
 * O REGISTO DO FERRO
 * =============================================================================
 * Este ficheiro é o ativo do site, e vale a pena perceber porquê.
 *
 * Em Pombal já existem o Pulse, o MoveUP, o Fitness Factory, o Wefit, o
 * FitTraining e o In.Motion. Todos vendem a mesma coisa pela mesma ordem:
 * aulas, cardio, mensalidade. Num mercado assim, dizer "temos equipamento de
 * qualidade" não distingue ninguém, porque é exatamente o que todos dizem.
 *
 * O Mythical tem uma coisa que nenhum deles pode comprar amanhã: ferro da era
 * dourada, procurado, e já esgotado no mercado novo. Uma Cybex do início dos
 * anos 90 não se encomenda a um catálogo. Encontra-se e compra-se a quem a tem.
 *
 * NÃO ESCREVAS AQUI QUE O FERRO É RESTAURADO. Esteve escrito e saiu. O único
 * facto confirmado é que a máquina é do início dos anos 90; que tenha sido
 * restaurada, e por quem, ninguém verificou. É o mesmo critério que mantém as
 * marcas do revendedor britânico fora deste ficheiro: só entra o que se pode
 * confirmar no pavilhão.
 *
 * Portanto o site não fala de máquinas em geral. Cataloga-as, uma a uma, com
 * marca, modelo e ano. Um registo é mais difícil de imitar do que um slogan, e
 * é a única coisa que a concorrência não consegue copiar num fim de semana.
 *
 * A REGRA: `confirmed: false` não vai para o ar. Ver `confirmedMachines()`.
 * Nunca acrescentar aqui uma máquina que não esteja fisicamente no pavilhão.
 * Este registo só tem valor enquanto for verdade.
 */

import type { Locale } from "./site";

type L = Record<Locale, string>;

export interface Machine {
  id: string;
  /** Modelo, como está na placa da máquina. */
  name: string;
  maker: string;
  /** O ano ou a década. Texto, porque "início dos anos 90" é mais honesto que um ano falso. */
  era: L;
  /** Para ordenar. Aproximado é aceitável; serve para a lista, não para o ecrã. */
  eraSort: number;
  blurb: L;
  confirmed: boolean;
  source?: string;
  /** Slot em media.ts, quando houver fotografia. */
  shot?: string;
}

export const MACHINES: Machine[] = [
  {
    id: "cybex-classic-leg-press",
    name: "Classic Leg Press",
    maker: "Cybex",
    era: { pt: "Início dos anos 90", en: "Early 1990s" },
    eraSort: 1991,
    blurb: {
      pt: "A casa chama-lhe uma verdadeira lenda da indústria, e não está a exagerar: a prensa da Cybex desta geração é das peças mais procuradas no mercado de ferro vintage, e há trinta anos que não se fabrica.",
      en: "The house calls it a true legend of the industry, and that is not hyperbole: the Cybex press of this generation is among the most sought-after pieces in the vintage-iron market, and it has not been built in thirty years.",
    },
    confirmed: true,
    source: "https://www.instagram.com/mythical.gym/",
    shot: "cybex-leg-press",
  },

  /* -------------------------------------------------------------------------
   * O RESTO DO PAVILHÃO ESTÁ POR CATALOGAR.
   *
   * À data em que isto foi escrito, a Cybex acima é a ÚNICA máquina que o
   * Mythical documentou publicamente. Tudo o resto que lá está é real, mas eu
   * não o vi e não o vou escrever de cabeça.
   *
   * ATENÇÃO, e isto quase entrou no site por engano: nas pesquisas aparecem
   * ligadas ao Mythical as marcas Nautilus, Icarian, Body Masters e Elite
   * Fitness. NÃO SÃO DELE. São de um revendedor britânico de ferro vintage
   * (@elitefitnessredditch) cujas publicações o Mythical comenta. Pôr esses
   * nomes no site seria anunciar máquinas que a casa não tem, e é o tipo de
   * erro que um sócio deteta no primeiro treino.
   *
   * COMO PREENCHER (é o trabalho mais barato e mais rentável que há aqui):
   *   1. Uma volta ao pavilhão com o telemóvel.
   *   2. Por cada máquina: foto da placa (marca + modelo) e foto da máquina.
   *   3. Uma linha neste ficheiro por máquina, com `confirmed: true`.
   *
   * Vinte máquinas catalogadas fazem uma página que nenhum ginásio do distrito
   * consegue responder. É o argumento inteiro do negócio, e está a uma tarde
   * de distância.
   * ----------------------------------------------------------------------- */
];

/** O único caminho para o ecrã. */
export const confirmedMachines = (): Machine[] =>
  MACHINES.filter((m) => m.confirmed).sort((a, b) => a.eraSort - b.eraSort);

/** As marcas distintas já catalogadas. Alimenta a secção de equipamento. */
export const confirmedMakers = (): string[] => [
  ...new Set(confirmedMachines().map((m) => m.maker)),
];

/** A década mais antiga em registo. Usado como facto na homepage. */
export function oldestEra(locale: Locale): string | null {
  const first = confirmedMachines()[0];
  return first ? first.era[locale] : null;
}
