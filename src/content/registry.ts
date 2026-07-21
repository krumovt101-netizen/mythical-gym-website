/**
 * REGISTO DE FACTOS
 * =============================================================================
 * Todas as afirmações numéricas do site nascem aqui, e cada uma carrega a sua
 * fonte e o seu estado. A regra é imposta pelo tipo, não pela boa vontade:
 * `publicClaims()` só devolve o que está `verified`.
 *
 * LEIA-SE ISTO ANTES DE ACRESCENTAR SEJA O QUE FOR:
 *
 * O Mythical abriu a 1 de julho de 2026. Não tem imprensa, não tem diretórios,
 * não tem histórico. Isso não é um problema a esconder, é a situação real, e o
 * site foi construído para ser forte sem números: o argumento é o ferro
 * catalogado em `machines.ts`, não uma contagem.
 *
 * A tentação, num ginásio novo, é encher a homepage com números redondos que
 * ninguém contou. Um "mais de 100 máquinas" escrito por estimativa é uma frase
 * que qualquer visitante desmente em quinze minutos de treino, e a partir daí
 * duvida do resto do site.
 *
 * A BARRA DE NÚMEROS DA HOMEPAGE NÃO APARECE enquanto aqui não houver pelo
 * menos três factos verificados. Uma barra com um número é uma barra partida.
 * Ver `showClaimsBar()` em baixo, e a homepage.
 */

import { confirmedMachines } from "./machines";

export type FactStatus =
  /** Confirmado por documento, contagem própria ou canal oficial da casa. Vai ao ar. */
  | "verified"
  /** Só o cliente o pode confirmar. Não vai ao ar. */
  | "needs-client";

export interface Fact {
  id: string;
  /** O valor tal como aparece no ecrã. */
  value: string;
  /**
   * O rótulo POR BAIXO DO VALOR. Está escrito para ser lido a seguir a um
   * número ("450 m2 de área de treino"), e por isso quase todos começam por uma
   * preposição.
   */
  label: { pt: string; en: string };
  /**
   * O nome do facto quando ele aparece SOZINHO, sem valor à frente, como
   * acontece na lista de pendentes. Sem isto, a lista imprimia "de área de
   * treino" e lia-se como uma frase cortada a meio.
   */
  name?: { pt: string; en: string };
  status: FactStatus;
  source?: string;
  /** O que é preciso para o desbloquear, quando está bloqueado. */
  note?: string;
}

/** Quantos factos são precisos para a barra da homepage fazer sentido. */
export const CLAIMS_BAR_MINIMUM = 3;

export const FACTS: Fact[] = [
  {
    id: "machines-catalogued",
    value: String(confirmedMachines().length),
    label: { pt: "máquinas catalogadas", en: "machines catalogued" },
    status: "verified",
    source: "src/content/machines.ts",
  },

  /* --- Bloqueados. Só o cliente os pode libertar. Cada um destes é uma tarde
   *     de trabalho dele, e vale mais do que qualquer coisa que eu escreva. --- */
  {
    id: "area",
    value: "",
    name: { pt: "Área de treino", en: "Training floor area" },
    label: { pt: "de área de treino", en: "of training floor" },
    status: "needs-client",
    note: "Área do armazém em m2. Sai da licença de utilização ou de uma medição própria. Não estimar a partir de fotografias.",
  },
  {
    id: "machines-total",
    value: "",
    name: { pt: "Número total de aparelhos", en: "Total number of machines" },
    label: { pt: "aparelhos", en: "machines" },
    status: "needs-client",
    note: "Contagem física, feita uma vez, com data. Um número contado é defensável; um número arredondado não é. Quando existir, este facto substitui o de máquinas catalogadas.",
  },
  {
    id: "stations",
    value: "",
    name: { pt: "Postos de treino", en: "Training stations" },
    label: { pt: "postos de treino", en: "training stations" },
    status: "needs-client",
    note: "Quantas pessoas treinam ao mesmo tempo sem esperar. Contagem física.",
  },
  {
    id: "weight",
    value: "",
    name: { pt: "Peso total de discos e barras", en: "Total weight of plates and bars" },
    label: { pt: "de discos e barras", en: "of plates and bars" },
    status: "needs-client",
    note: "Só com inventário interno. Se não estiver pesado, não vai.",
  },
  {
    id: "hours",
    value: "",
    name: { pt: "Horas de abertura por dia", en: "Opening hours per day" },
    label: { pt: "horas por dia", en: "hours a day" },
    status: "needs-client",
    note: "O horário não está publicado em lado nenhum, nem no Instagram da casa. É o campo em falta mais caro do site inteiro: é a primeira pergunta de quem quer inscrever-se.",
  },
];

/** O único caminho para o ecrã. Um facto por confirmar não passa por aqui. */
export function publicClaims(): Fact[] {
  return FACTS.filter((f) => f.status === "verified" && f.value !== "");
}

/**
 * A barra da homepage só se justifica com três ou mais números. Com um, parece
 * um erro de maquetagem; e o site tem argumentos melhores para pôr no lugar.
 */
export function showClaimsBar(): boolean {
  return publicClaims().length >= CLAIMS_BAR_MINIMUM;
}

export function factById(id: string): Fact | undefined {
  return FACTS.find((f) => f.id === id);
}

/** Tudo o que está à espera do cliente. Alimenta a página /pendentes. */
export function pendingClaims(): Fact[] {
  return FACTS.filter((f) => f.status === "needs-client");
}
