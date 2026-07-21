/**
 * O GINÁSIO: zonas, marcas, modalidades, preços, campanha.
 *
 * `confirmed: false` significa que nada o sustenta e que o conteúdo NÃO é
 * renderizado. Não é uma nota, é um interruptor.
 */

import type { Locale } from "./site";
import { confirmedMakers } from "./machines";

type L = Record<Locale, string>;

export interface Zone {
  id: string;
  name: L;
  blurb: L;
  confirmed: boolean;
  source?: string;
  /** Nota interna para o cliente, visível em /pendentes. */
  note?: string;
}

/**
 * ZONAS: todas por confirmar.
 *
 * O Mythical ocupa um armazém na Zona Industrial da Formiga. Um armazém pode
 * ser um plano aberto único ou estar dividido por áreas, e as duas coisas dão
 * sites diferentes. Não vi o espaço e não o vou dividir de cabeça.
 *
 * Se for plano aberto, isso não é uma falha: é um argumento. Um piso único de
 * armazém, sem paredes a cortar o treino, é exatamente o contrário do ginásio
 * de centro comercial com que a concorrência de Pombal trabalha. Mas tem de
 * ser dito por quem lá esteve.
 */
export const ZONES: Zone[] = [
  {
    id: "planta",
    name: { pt: "As zonas do pavilhão", en: "The floor plan" },
    blurb: { pt: "", en: "" },
    confirmed: false,
    note: "Preciso de saber se o armazém é plano aberto ou dividido por áreas, e como se chamam essas áreas. Uma frase por zona e uma foto de cada chega para a página ficar completa.",
  },
];

export const confirmedZones = () => ZONES.filter((z) => z.confirmed);
export const pendingZones = () => ZONES.filter((z) => !z.confirmed);

/**
 * MARCAS: derivadas do registo do ferro, nunca escritas à mão.
 *
 * É de propósito. Se a marca aparecesse aqui à mão, o site podia anunciar uma
 * marca de que não existe uma única máquina catalogada, e as duas páginas
 * entravam em contradição. Assim não podem: a lista de marcas é, literalmente,
 * a lista de marcas do ferro que está no pavilhão.
 */
export const brands = (): { name: string; note: L | null }[] =>
  confirmedMakers().map((name) => ({ name, note: null }));

/**
 * A secção "As marcas" só se justifica com DUAS ou mais.
 *
 * Com uma, o site abre um título grande, três linhas de introdução e uma lista
 * de um item, e lê-se como uma consulta que falhou, não como uma escolha. É a
 * mesma regra de `showClaimsBar()` no registo de factos, e existe pela mesma
 * razão: a maqueta assume mais conteúdo do que a realidade tem, e a resposta
 * honesta é esconder a secção, não inventar marcas para a encher.
 */
export const showBrands = (): boolean => brands().length >= 2;

/**
 * MODALIDADES: por confirmar.
 * Que o Mythical é uma casa de musculação está evidente no que ele próprio
 * publica. O resto (aulas, cardio, treino personalizado, acompanhamento) não
 * está, e cada uma dessas linhas é uma promessa comercial. A secção só aparece
 * com três ou mais, para não ficar uma lista de um item.
 */
export const DISCIPLINES = {
  confirmed: false,
  items: [] as L[],
  note: "Diz-me o que se treina lá: só musculação, ou também cardio, aulas, treino personalizado, acompanhamento nutricional. Cada linha destas é uma promessa ao sócio, por isso nenhuma entra por suposição.",
};

export const showDisciplines = (): boolean =>
  DISCIPLINES.confirmed && DISCIPLINES.items.length >= 3;

/**
 * PREÇOS: bloqueados.
 * Não há um único preço do Mythical em fonte pública.
 *
 * Nota estratégica, e vale dinheiro: em Pombal, o Pulse, o MoveUP e o Fitness
 * Factory escondem todos o valor da mensalidade e empurram para uma visita ou
 * um formulário. Num mercado onde toda a gente esconde, mostrar o preço é um
 * ato de autoridade: só quem tem medo da comparação é que esconde. Para uma
 * casa nova, sem notoriedade, é também a forma mais barata de tirar atrito à
 * primeira inscrição. A decisão é do cliente, e o site está pronto para os dois
 * caminhos.
 */
export const PRICING = {
  confirmed: false,
  tiers: [] as { name: L; price: string; period: L; features: L[] }[],
};

/**
 * CAMPANHA A DECORRER.
 * O Mythical anunciou no Instagram um pack de verão, de 15 de julho a 15 de
 * setembro. As datas são dele. O PREÇO não foi publicado, e por isso não está
 * aqui: o site anuncia a campanha e manda perguntar, que é o que a própria casa
 * está a fazer.
 *
 * Isto tem prazo. Passado 15 de setembro de 2026, `active` passa a false, ou a
 * homepage fica a promover uma campanha que já acabou.
 */
export const CAMPAIGN = {
  active: true,
  endsIso: "2026-09-15",
  name: { pt: "Pack de verão", en: "Summer pack" },
  dates: { pt: "15 de julho a 15 de setembro", en: "15 July to 15 September" },
  priceConfirmed: false,
  source: "https://www.instagram.com/mythical.gym/",
};

/**
 * A campanha ainda está a decorrer?
 *
 * CUIDADO, e é uma limitação real e não um detalhe: isto corre no BUILD, não no
 * browser. Num site exportado estaticamente, a data congela no momento em que se
 * compilou. Se o site não for reconstruído depois de 15 de setembro de 2026, a
 * campanha continua no ar em novembro.
 *
 * Duas saídas honestas: agendar um rebuild para o dia seguinte ao fim da
 * campanha, ou pôr `CAMPAIGN.active` a false à mão nesse dia. A terceira, que
 * seria avaliar a data no cliente, faz o conteúdo saltar depois da página
 * pintar, e não vale a pena por uma caixa.
 */
export function campaignLive(now: Date = new Date()): boolean {
  return CAMPAIGN.active && now <= new Date(`${CAMPAIGN.endsIso}T23:59:59Z`);
}
