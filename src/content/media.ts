/**
 * IMAGENS
 * =============================================================================
 * TODAS as imagens deste site são GERADAS POR COMPUTADOR e NÃO SÃO DO MYTHICAL
 * GYM. Não são fotografias de sítio nenhum: são ilustrações de atmosfera,
 * feitas de propósito para este desenho (v2 "O Registo"), numa só gradação
 * (quase-negro quente, tungsténio, latão), sem pessoas e sem marcas. Estão cá
 * para o site não se mostrar vazio antes de existirem as verdadeiras, e é
 * tudo o que são.
 *
 * PROVENIÊNCIA: Higgsfield (cinematic_studio_2_5), 2026-07-21. O id do job de
 * origem de cada uma está em `credit`, para que qualquer uma seja rastreável
 * e regenerável. As imagens de banco (Unsplash) do v1 foram substituídas por
 * estas: uma gradação única lê-se como uma casa; onze fotografias de onze
 * ginásios diferentes não.
 *
 * ENQUANTO `stock` FOR TRUE: cada imagem leva no ecrã o carimbo "Imagem
 * provisória", o `alt` diz o mesmo a quem usa leitor de ecrã, e
 * `npm run build` recusa-se a compilar para produção. É uma trava, não um
 * aviso. Ver SHOW_STOCK_TAGS em baixo para a desligar numa apresentação.
 *
 * COMO SUBSTITUIR PELAS REAIS:
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
 * Os carimbos "Imagem provisória" por cima das imagens.
 *
 * Ficam LIGADOS por omissão, e deve ser assim: protegem quem mostra o site de
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
  /** true = imagem provisória (gerada ou de banco), não é da casa. Bloqueia o build de produção. */
  stock: boolean;
  /** Origem da imagem provisória: id do job Higgsfield, enquanto for gerada. */
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
      pt: "Fila de máquinas de carga antigas contra uma parede de tijolo, sob uma luz quente, num pavilhão às escuras",
      en: "A row of vintage plate-loaded machines against a brick wall, under one warm light, in a dark hall",
    },
    spec: "A PRIMEIRA IMAGEM DO SITE, e a mais importante. Plano largo do pavilhão, na horizontal, mínimo 2400px, com uma zona calma à esquerda para o texto assentar. Tirada de um canto, ao nível do peito, com o ferro a fugir em profundidade. Sem pessoas em pose.",
    stock: true,
    credit: "higgsfield:379a40e3-4378-46b5-821a-91c4a20315e9",
    priority: 3,
  },
  {
    slot: "iron",
    src: "/media/iron.jpg",
    width: 2400,
    height: 1350,
    alt: {
      pt: "Fila cerrada de discos de ferro fundido gastos, com uma luz quente a raspar o metal",
      en: "A dense row of worn cast-iron plates, warm light raking across the metal",
    },
    spec: "A BANDA DO FERRO. Uma fila de máquinas ou de discos que mostre a densidade do equipamento. É o argumento visual do posicionamento inteiro.",
    stock: true,
    credit: "higgsfield:0df20f81-417f-4b45-b4e4-2b4fc844956c",
    priority: 4,
  },
  {
    slot: "cybex-leg-press",
    src: "/media/cybex-leg-press.jpg",
    width: 1600,
    height: 1200,
    alt: {
      pt: "Detalhe de discos gastos empilhados no carro de aço de uma máquina de carga antiga",
      en: "Detail of worn plates stacked on the steel carriage of a vintage loading machine",
    },
    spec: "A CYBEX, e é a substituição MAIS URGENTE do site inteiro. É a única máquina catalogada e a cara da casa. Quero duas fotos: a máquina inteira, e um grande plano da placa Cybex com o desgaste à vista. A segunda vai ser usada mais vezes. Enquanto não chegar, o que está aqui é um detalhe genérico que não finge ser a vossa prensa.",
    stock: true,
    credit: "higgsfield:e477b788-19a2-4954-a294-2d7aacd1ba16",
    priority: 1,
  },
  {
    slot: "space",
    src: "/media/space.jpg",
    width: 2000,
    height: 1500,
    alt: {
      pt: "Portão industrial de correr fechado, à noite, com um candeeiro quente por cima",
      en: "A closed industrial roller door at night, one warm lamp above it",
    },
    spec: "O EDIFÍCIO, por fora, ou a entrada, com a sinalética se já existir. É a foto que faz alguém reconhecer a porta à chegada, e a Zona Industrial da Formiga não é fácil à primeira. Tira-se do passeio em frente, com o telemóvel, em dois minutos.",
    stock: true,
    credit: "higgsfield:6a8cf967-d2d5-411d-8d2e-2ced14a9bc76",
    priority: 2,
  },
  {
    slot: "plate",
    src: "/media/plate.jpg",
    width: 1600,
    height: 1600,
    alt: {
      pt: "Grande plano do rebordo de um disco de ferro fundido gasto, com a luz quente a desenhar o relevo",
      en: "Close-up of the rim of a worn cast-iron plate, warm light tracing the relief",
    },
    spec: "Grande plano de uma placa de fabricante ou de um disco gasto, com o ano ou o peso legível. É a textura da marca toda, e é a foto mais barata de tirar do lote.",
    stock: true,
    credit: "higgsfield:90c518ae-a528-4d7b-ab8f-3d071e71d77c",
    priority: 5,
  },

  /* --- Fundos de cabeçalho das páginas interiores. --- */
  {
    slot: "header-gym",
    src: "/media/header-gym.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Silhuetas de racks e bancos ao fundo de um pavilhão às escuras, com um brilho quente ao longe",
      en: "Silhouettes of racks and benches across a dark hall, one warm glow in the distance",
    },
    spec: "Banda larga e baixa (2400x1000) para o cabeçalho da página do ginásio. Plano geral do pavilhão, com espaço morto em cima para o título assentar.",
    stock: true,
    credit: "higgsfield:8f923cfa-9f3b-42c5-accd-45135727501a",
    priority: 7,
  },
  {
    slot: "header-contact",
    src: "/media/header-contact.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Porta de entrada de um pavilhão industrial às escuras, com luz quente a entrar pelas frestas",
      en: "The entrance door of a dark industrial hall, warm light spilling through the seams",
    },
    spec: "Banda larga e baixa para o cabeçalho dos contactos. Idealmente a entrada do pavilhão vista de dentro.",
    stock: true,
    credit: "higgsfield:98a44e71-8dc8-4b7b-bf21-63e4fa158ebc",
    priority: 9,
  },
  {
    slot: "header-shop",
    src: "/media/header-shop.jpg",
    width: 2400,
    height: 1000,
    alt: {
      pt: "Corredor de um armazém às escuras, com uma luz quente ao fundo",
      en: "A dark warehouse aisle with one warm light at the far end",
    },
    spec: "Banda larga e baixa para o cabeçalho da loja.",
    stock: true,
    credit: "higgsfield:11d750a3-8a7b-44ba-84a1-54e0164fccf0",
    priority: 10,
  },
  {
    slot: "visit",
    src: "/media/visit.jpg",
    width: 2000,
    height: 1300,
    alt: {
      pt: "Pavilhão às escuras com mezanino e escada metálica, um candeeiro quente aceso",
      en: "A dark hall with a steel mezzanine and stair, one warm lamp lit",
    },
    spec: "A secção final da homepage, onde se convida a aparecer. Plano geral do espaço, acolhedor mas escuro.",
    stock: true,
    credit: "higgsfield:12cc8030-a774-4677-9ea7-012a29477456",
    priority: 11,
  },
];

/**
 * AS SEQUÊNCIAS DE SCROLL.
 *
 * No desenho v2 ("O Registo"), só a `mecanismo` — a vista explodida — vai ao
 * ecrã, dentro da secção da peça Nº 001 na homepage. As outras quatro são do
 * conceito v1 ("O Dia") e ficam em arquivo: os ficheiros continuam em
 * public/media/sequences/, prontos a religar, mas nenhuma página as pede.
 *
 * GERADAS POR COMPUTADOR, E NÃO SÃO O PAVILHÃO. Vale a mesma regra das
 * imagens: `stock: true` põe o carimbo "Imagem provisória" no ecrã, o alt
 * di-lo a quem ouve o site, e cada sequência sai no dia em que houver
 * filmagem real da casa. O pipeline para as refazer (fotogramas → vídeo →
 * sequência) está documentado na skill `scroll-video-animation`.
 *
 * `frameCount: 0` desliga uma sequência por completo.
 */
export interface SequenceShot {
  slot: string;
  base: string;
  /** 0 = sequência desligada. Tem de ser igual ao nº real de ficheiros frame-*. */
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

/** Para as secções onde o carimbo tem de ser desenhado por fora da imagem. */
export const isStock = (slot: string): boolean => shot(slot)?.stock === true;

/** Alimenta a trava do build e a página /pendentes, por ordem de urgência. */
export const stockShots = () =>
  SHOTS.filter((s) => s.stock).sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

/** As fotos que ainda não existem de todo. */
export const missingShots = () => SHOTS.filter((s) => s.src === null);
