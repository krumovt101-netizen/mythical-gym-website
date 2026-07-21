/**
 * IMAGENS
 * =============================================================================
 * TODAS as imagens deste site são de banco de imagens e NÃO SÃO DO MYTHICAL
 * GYM. São de outros ginásios, noutros países. Estão cá para o site não se
 * mostrar vazio antes de existirem as verdadeiras, e é tudo o que são.
 *
 * PROVENIÊNCIA E LICENÇA: todas do Unsplash, ao abrigo da Unsplash License
 * (uso comercial livre, sem atribuição obrigatória). Foram excluídas de
 * propósito as do Unsplash+ (`plus.unsplash.com`), que são de licença paga e
 * apareciam misturadas nos resultados de pesquisa. O ID de origem de cada uma
 * está em `credit`, para que qualquer uma seja rastreável e substituível.
 *
 * O CRITÉRIO DE ESCOLHA, que não é decorativo: quase todo o stock de ginásio é
 * health club claro, com luz de spa e gente a sorrir, ou seja, exatamente o
 * oposto do que esta casa é e do que o site argumenta. Foram filtradas de um
 * lote de 745 candidatos: escuras, sem pessoas, sem marca de terceiros legível,
 * e com ferro a sério. Uma foto clara de clube moderno aqui estaria a vender a
 * concorrência de Pombal.
 *
 * ------------------------------------------------------------------------
 * NOTA SOBRE DUAS DELAS, e é a única coisa aqui que vale a pena discutir
 * ------------------------------------------------------------------------
 * `cybex-leg-press` e `space` estiveram deliberadamente vazias, e foram
 * preenchidas depois, a pedido expresso do cliente, para o site não mostrar
 * chapas vazias. A razão original de as deixar em branco mantém-se válida e
 * fica aqui registada:
 *
 *   - `cybex-leg-press` ilustra a ÚNICA máquina que o registo afirma existir,
 *     com marca, modelo e ano. Uma imagem de banco aqui não é ambiente, é a
 *     legenda de uma afirmação factual concreta. A imagem escolhida é por isso
 *     um detalhe genérico de placas de carga, e NÃO uma prensa: não finge ser
 *     a máquina de que o texto ao lado fala.
 *   - `space` serve para quem nunca lá foi reconhecer o edifício à chegada. A
 *     imagem escolhida é uma porta industrial neutra, sem sinalética.
 *
 * São as duas primeiras a substituir, e as duas mais fáceis de tirar: ambas se
 * fazem do telemóvel, uma no pavilhão e outra do passeio em frente.
 * ------------------------------------------------------------------------
 *
 * ENQUANTO `stock` FOR TRUE: cada imagem leva no ecrã a etiqueta "Imagem
 * provisória", o `alt` diz o mesmo a quem usa leitor de ecrã, e
 * `npm run build` recusa-se a compilar para produção. É uma trava, não um
 * aviso. Ver SHOW_STOCK_TAGS em baixo para a desligar numa apresentação.
 *
 * COMO SUBSTITUIR:
 *   1. Põe a foto real em  public/media/<slot>.jpg  (respeita o `spec`).
 *   2. Muda `stock` para false e apaga o `credit`.
 *   3. Escreve um `alt` que descreva o que se vê de verdade, e aí sim com o
 *      nome do sítio ("A sala de musculação, no Mythical Gym").
 * Não é preciso tocar em mais nada. As páginas leem daqui.
 *
 * O BRIEFING, em duas linhas: fotografa o ferro, não o espaço. E fotografa com
 * a luz que lá está, sem flash: um armazém tem uma luz dura e alta que é
 * precisamente a atmosfera que estas imagens estão a imitar.
 */

import type { Locale } from "./site";

type L = Record<Locale, string>;

/**
 * As etiquetas "Imagem provisória" por cima das fotos.
 *
 * Ficam LIGADAS por omissão, e deve ser assim: protegem quem mostra o site de
 * ser lido como se aquele fosse o pavilhão. Para uma apresentação em que isso
 * já foi dito por palavras, põe-se a false. A trava do build NÃO depende disto
 * e continua armada de qualquer maneira.
 */
export const SHOW_STOCK_TAGS = true;

export interface Shot {
  slot: string;
  /** Caminho em /public. Null enquanto não houver ficheiro: entra a chapa desenhada. */
  src: string | null;
  width: number;
  height: number;
  alt: L;
  /** O que esta foto TEM de mostrar quando for a real. É o briefing para quem a for tirar. */
  spec: string;
  /** true = foto de banco de imagens, de outro ginásio. Bloqueia o build de produção. */
  stock: boolean;
  /** ID de origem no Unsplash, enquanto for de banco. */
  credit?: string;
  /** Ordem de prioridade para o cliente substituir. 1 = primeiro. */
  priority?: number;
}

export const SHOTS: Shot[] = [
  {
    slot: "hero",
    src: "/media/hero.jpg",
    width: 2400,
    height: 1350,
    alt: {
      pt: "Uma sala de musculação ampla, de teto industrial escuro, com filas de bancos e halteres",
      en: "A large weights floor with a dark industrial ceiling, rows of benches and dumbbells",
    },
    spec: "A PRIMEIRA IMAGEM DO SITE, e a mais importante. Plano largo do pavilhão, na horizontal, mínimo 2400px, com uma zona calma à esquerda para o texto assentar. Tirada de um canto, ao nível do peito, com o ferro a fugir em profundidade. Sem pessoas em pose.",
    stock: true,
    credit: "photo-1689877020200-403d8542d95d",
    priority: 3,
  },
  {
    slot: "iron",
    src: "/media/iron.jpg",
    width: 2400,
    height: 1350,
    alt: {
      pt: "Fila cerrada de discos e halteres num suporte, a preto e branco",
      en: "A dense row of plates and dumbbells on a rack, in black and white",
    },
    spec: "A BANDA DO FERRO. Uma fila de máquinas ou de discos que mostre a densidade do equipamento. É o argumento visual do posicionamento inteiro.",
    stock: true,
    credit: "photo-1544033527-b192daee1f5b",
    priority: 4,
  },
  {
    slot: "cybex-leg-press",
    src: "/media/cybex-leg-press.jpg",
    width: 1600,
    height: 1200,
    alt: {
      pt: "Grande plano das placas de carga de uma máquina, com os pesos marcados",
      en: "Close-up of a machine's weight stack, with the loads marked",
    },
    spec: "A CYBEX, e é a substituição MAIS URGENTE do site inteiro. É a única máquina catalogada e a cara da casa. Quero duas fotos: a máquina inteira, e um grande plano da placa Cybex com o desgaste à vista. A segunda vai ser usada mais vezes. Enquanto não chegar, o que está aqui é um detalhe genérico que não finge ser a vossa prensa.",
    stock: true,
    credit: "photo-1604053756182-415f6ac44686",
    priority: 1,
  },
  {
    slot: "space",
    src: "/media/space.jpg",
    width: 2000,
    height: 1500,
    alt: {
      pt: "Portões industriais de correr, fechados",
      en: "Closed industrial roller doors",
    },
    spec: "O EDIFÍCIO, por fora, ou a entrada, com a sinalética se já existir. É a foto que faz alguém reconhecer a porta à chegada, e a Zona Industrial da Formiga não é fácil à primeira. Tira-se do passeio em frente, com o telemóvel, em dois minutos.",
    stock: true,
    credit: "photo-1776316170808-f59232c1a85e",
    priority: 2,
  },
  {
    slot: "plate",
    src: "/media/plate.jpg",
    width: 1600,
    height: 1600,
    alt: {
      pt: "Grande plano de um disco de ferro preto, com o peso em relevo",
      en: "Close-up of a black iron plate with the weight in relief",
    },
    spec: "Grande plano de uma placa de fabricante ou de um disco gasto, com o ano ou o peso legível. É a textura da marca toda, e é a foto mais barata de tirar do lote.",
    stock: true,
    credit: "photo-1767404890859-73752f06716c",
    priority: 5,
  },

  /* --- Fundos de cabeçalho. Antes destes, os cabeçalhos das páginas interiores
   *     eram a grelha do caderno sobre carvão, e a área grande e vazia lia-se
   *     como uma caixa à espera de imagem em vez de como uma decisão. --- */
  {
    slot: "header-gym",
    src: "/media/header-gym.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Sala de musculação com racks de agachamento e parede de tijolo",
      en: "A weights floor with squat racks and a brick wall",
    },
    spec: "Banda larga e baixa (2400x1000) para o cabeçalho da página do ginásio. Plano geral do pavilhão, com espaço morto em cima para o título assentar.",
    stock: true,
    credit: "photo-1685633224767-361354e84e2b",
    priority: 7,
  },
  {
    slot: "header-contact",
    src: "/media/header-contact.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Interior de pavilhão com estrutura metálica e envidraçado",
      en: "A hall interior with steel structure and glazing",
    },
    spec: "Banda larga e baixa para o cabeçalho dos contactos. Idealmente a entrada do pavilhão vista de dentro.",
    stock: true,
    credit: "photo-1728486145245-d4cb0c9c3470",
    priority: 9,
  },
  {
    slot: "header-shop",
    src: "/media/header-shop.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Interior de ginásio em penumbra, com fila de aparelhos",
      en: "A dim gym interior with a row of machines",
    },
    spec: "Banda larga e baixa para o cabeçalho da loja.",
    stock: true,
    credit: "photo-1778828494354-9b717d36dc99",
    priority: 10,
  },
  {
    slot: "visit",
    src: "/media/visit.jpg",
    width: 2000,
    height: 1300,
    alt: {
      pt: "Pavilhão de treino com mezanino e escada metálica",
      en: "A training hall with a mezzanine and steel stairs",
    },
    spec: "A secção final da homepage, onde se convida a aparecer. Plano geral do espaço, acolhedor mas escuro.",
    stock: true,
    credit: "photo-1685633224597-294ff1adfd6f",
    priority: 11,
  },
];

/**
 * AS SEQUÊNCIAS DO DIA (scroll).
 *
 * A homepage é uma jornada de capítulos: secções pinadas que fazem scrub de
 * uma sequência de fotogramas conforme o scroll, a contar um dia de treino
 * das 05:30 às 23:00. O último fotograma de cada capítulo é também o poster
 * (o que o SSR pinta primeiro, e o que vê quem tem reduced-motion ou um ecrã
 * pequeno).
 *
 * GERADAS POR COMPUTADOR, E NÃO SÃO O PAVILHÃO. Vale a mesma regra das fotos
 * de banco: `stock: true` põe a etiqueta "Imagem provisória" no ecrã, o alt
 * di-lo a quem ouve o site, e cada sequência sai no dia em que houver
 * filmagem real da casa. O pipeline para as refazer (fotogramas → vídeo →
 * sequência) está documentado na skill `scroll-video-animation`.
 *
 * `frameCount: 0` desliga um capítulo por completo: a homepage salta-o e
 * nada mais muda. No herói, desligar devolve o herói fotográfico antigo.
 */
export interface SequenceShot {
  slot: string;
  base: string;
  /** 0 = capítulo desligado. Tem de ser igual ao nº real de ficheiros frame-*. */
  frameCount: number;
  /** Altura da secção em viewports de scroll. */
  scrollLength: number;
  stock: boolean;
  alt: L;
}

export const SEQUENCES: SequenceShot[] = [
  {
    slot: "hero",
    base: "/media/sequences/hero",
    frameCount: 61,
    scrollLength: 2.5,
    stock: true,
    alt: {
      pt: "Sala de máquinas escura de um pavilhão industrial, árvores de discos e máquinas de carga em primeiro plano, uma luz quente ao fundo",
      en: "A dark machine floor in an industrial hall, plate trees and plate-loaded machines up close, one warm light in the distance",
    },
  },
  {
    slot: "luz",
    base: "/media/sequences/luz",
    frameCount: 61,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "Luz da manhã a atravessar o chão escuro de um pavilhão de treino",
      en: "Morning light crossing the dark floor of a training hall",
    },
  },
  {
    slot: "mecanismo",
    base: "/media/sequences/mecanismo",
    frameCount: 61,
    scrollLength: 3,
    stock: true,
    alt: {
      pt: "Mecanismo de carga antigo em ferro, com discos e alavancas, a separar-se em peças no escuro",
      en: "A vintage iron loading mechanism, plates and levers, coming apart into its pieces in the dark",
    },
  },
  {
    slot: "cheio",
    base: "/media/sequences/cheio",
    frameCount: 61,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "Barra carregada sob luz quente ao fim do dia, pó de magnésio no ar",
      en: "A loaded bar under warm evening light, chalk dust in the air",
    },
  },
  {
    slot: "fecho",
    base: "/media/sequences/fecho",
    frameCount: 61,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "O pavilhão às escuras, a última luz a apagar-se",
      en: "The hall in darkness, the last light going out",
    },
  },
];

export const sequence = (slot: string): SequenceShot | undefined =>
  SEQUENCES.find((s) => s.slot === slot);

export const shot = (slot: string): Shot | undefined => SHOTS.find((s) => s.slot === slot);

/** Para as secções onde a etiqueta tem de ser desenhada por fora da foto. */
export const isStock = (slot: string): boolean => shot(slot)?.stock === true;

/** Alimenta a trava do build e a página /pendentes, por ordem de urgência. */
export const stockShots = () =>
  SHOTS.filter((s) => s.stock).sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

/** As fotos que ainda não existem de todo. */
export const missingShots = () => SHOTS.filter((s) => s.src === null);
