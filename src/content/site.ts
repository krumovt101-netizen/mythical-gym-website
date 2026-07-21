/**
 * CONFIGURAÇÃO DA CASA
 * =============================================================================
 * Contactos, morada, redes. Tudo o que o cliente vai querer mudar sem abrir uma
 * página. Um sítio, um ficheiro.
 *
 * ESTADO DESTE FICHEIRO: o Mythical Gym abriu a 1 de julho de 2026. À data em
 * que isto foi escrito não existe telefone, email nem horário em fonte pública
 * nenhuma. O único canal oficial é o Instagram.
 *
 * Por isso vários campos aqui estão a `null`. Não é esquecimento, é a regra da
 * casa. Um telefone inventado põe alguém a ligar para o número de outra pessoa,
 * e um horário inventado põe um sócio à porta fechada. Enquanto for `null`, o
 * site encaminha para o Instagram, que é o canal que existe de facto.
 */

export const SITE = {
  name: "Mythical Gym",

  /**
   * DOMÍNIO POR CONFIRMAR.
   * Não foi encontrado domínio registado para o Mythical. Este valor é um
   * marcador: alimenta os canónicos, o sitemap e os dados estruturados, e é a
   * ÚNICA linha a mudar quando o domínio real existir.
   */
  url: "https://www.mythicalgym.pt",
  domainConfirmed: false,

  /**
   * Morada como a própria casa a publica no Instagram. A referência da Sumol e
   * da Cuétara vem de lá também, e vale mais do que o número da porta: quem
   * conhece Pombal chega por ali.
   */
  address: {
    street: "Rua José António Varela Pinto, armazém 4",
    area: "Zona Industrial da Formiga",
    /** Código postal por confirmar. Pombal é 3100, o sufixo não se adivinha. */
    postal: null as string | null,
    municipality: "Pombal",
    country: "Portugal",
    landmark: {
      pt: "Entre a Sumol e a Cuétara",
      en: "Between the Sumol and Cuétara plants",
    },
    source: "https://www.instagram.com/mythical.gym/",
    /** Coordenadas por confirmar. Um mapa errado manda pessoas ao sítio errado. */
    lat: null as number | null,
    lng: null as number | null,
    mapsQuery: "Rua José António Varela Pinto, Zona Industrial da Formiga, Pombal",
  },

  /**
   * TELEFONE: não existe em fonte pública nenhuma.
   * Enquanto for null, todos os sítios do site que pediriam "ligue" pedem
   * "mande mensagem", e apontam ao Instagram.
   */
  phone: {
    display: null as string | null,
    e164: null as string | null,
  },

  email: {
    general: null as string | null,
  },

  social: {
    instagram: "https://www.instagram.com/mythical.gym/",
    instagramHandle: "@mythical.gym",
    /** Não foi encontrada página de Facebook. Se existir, entra aqui. */
    facebook: null as string | null,
  },

  /**
   * ABERTURA. É o facto mais sólido que esta casa tem, e é dela própria:
   * anunciado no Instagram e cumprido. Um ginásio com semanas de vida não
   * finge história, e este site não lha inventa.
   */
  opened: {
    iso: "2026-07-01",
    label: { pt: "1 de julho de 2026", en: "1 July 2026" },
    source: "https://www.instagram.com/mythical.gym/",
  },

  /**
   * HORÁRIO: BLOQUEADO. Nenhuma fonte, nem sequer a própria casa, o publicou.
   * Enquanto `confirmed` for false o site não mostra horas nenhumas.
   */
  hours: {
    confirmed: false,
    draft: [] as { days: { pt: string; en: string }; time: string }[],
  },

  /**
   * VÍDEO: não existe. O site foi desenhado para não precisar: nenhuma secção
   * depende de vídeo para fazer sentido.
   */
  video: null,

  /** Dono por confirmar. Não foi encontrado nome em fonte pública. */
  owner: null as string | null,
} as const;

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Há telefone publicável? Governa todos os CTA de contacto do site. */
export const hasPhone = (): boolean => SITE.phone.e164 !== null;
