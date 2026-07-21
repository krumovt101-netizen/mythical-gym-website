/**
 * LOJA
 * =============================================================================
 * AVISO, e é o mais importante deste ficheiro: NÃO existe evidência nenhuma de
 * que o Mythical venda vestuário hoje. O ginásio abriu a 1 de julho de 2026 e
 * o que publicou até agora é sobre equipamento, não sobre merch.
 *
 * Portanto todo este catálogo é PROVISÓRIO: nomes, preços e descrições foram
 * escritos por mim como estrutura, não são o catálogo da casa. Cada produto tem
 * `draft: true`, e `npm run check:content` recusa o build de produção enquanto
 * houver um único em pé. Não é possível pôr preços inventados no ar por
 * distração.
 *
 * PARA O CLIENTE: substituir nome, descrição, preço, tamanhos e foto de cada
 * produto, e pôr `draft: false`. É o único ficheiro a mexer. Se não houver loja
 * nenhuma para já, a decisão correta é esvaziar `PRODUCTS` e tirar a Loja do
 * menu (em `Header.tsx` e `Footer.tsx`): uma loja vazia é pior do que nenhuma.
 *
 * O CANAL DE ENCOMENDA TAMBÉM NÃO EXISTE AINDA. Ver `ORDER`, no fim.
 */

import type { Locale } from "./site";

type L = Record<Locale, string>;

export type Category = "vestuario" | "equipamento";

export interface Product {
  slug: string;
  name: L;
  /** Uma linha. É o que aparece no cartão. */
  tagline: L;
  description: L;
  /** Em euros. */
  price: number;
  category: Category;
  sizes: string[] | null;
  /** Ficheiro em /public/media/loja/. Se não existir, entra a chapa desenhada. */
  image: string | null;
  /** PROVISÓRIO até o cliente confirmar. Bloqueia o build de produção. */
  draft: boolean;
  featured?: boolean;
}

export const CATEGORIES: { id: Category; name: L }[] = [
  { id: "vestuario", name: { pt: "Vestuário", en: "Apparel" } },
  { id: "equipamento", name: { pt: "Equipamento", en: "Equipment" } },
];

const TEE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

/**
 * As imagens estão todas a `null` de propósito. As que aqui estavam eram fotos
 * de banco de imagens do projeto anterior, e foram apagadas: mostrar merch
 * genérico de stock como se fosse o da casa é vender uma coisa que não existe.
 * Enquanto for null, entra a chapa desenhada com a placa da marca.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "t-shirt-wordmark",
    name: { pt: "T-shirt Wordmark", en: "Wordmark T-shirt" },
    tagline: { pt: "Algodão pesado, corte largo.", en: "Heavyweight cotton, relaxed cut." },
    description: {
      pt: "A t-shirt da casa. Algodão pesado que aguenta o balneário e a máquina de lavar, com o wordmark à frente e nada nas costas. Feita para treinar, não para posar.",
      en: "The house T-shirt. Heavyweight cotton that survives the locker room and the washing machine, wordmark on the front and nothing on the back. Made to train in, not to pose in.",
    },
    price: 25,
    category: "vestuario",
    sizes: TEE_SIZES,
    image: null,
    draft: true,
    featured: true,
  },
  {
    slug: "stringer",
    name: { pt: "Stringer", en: "Stringer" },
    tagline: { pt: "Cava aberta, costas em nadador.", en: "Deep cut, racer back." },
    description: {
      pt: "Cava aberta, costas em nadador. O uniforme de quem treina em época de preparação e não tem tempo para conversa.",
      en: "Deep armhole, racer back. The uniform of anyone training in prep season with no time for small talk.",
    },
    price: 22,
    category: "vestuario",
    sizes: TEE_SIZES,
    image: null,
    draft: true,
    featured: true,
  },
  {
    slug: "hoodie",
    name: { pt: "Hoodie", en: "Hoodie" },
    tagline: { pt: "Para o frio entre séries.", en: "For the cold between sets." },
    description: {
      pt: "Felpo pesado, capuz forrado, bolso de canguru. O que se veste por cima quando se sai a transpirar para o parque de estacionamento em janeiro.",
      en: "Heavy fleece, lined hood, kangaroo pocket. What you put on to walk out sweating into a January car park.",
    },
    price: 55,
    category: "vestuario",
    sizes: TEE_SIZES,
    image: null,
    draft: true,
  },
  {
    slug: "cinto-musculacao",
    name: { pt: "Cinto de musculação", en: "Lifting belt" },
    tagline: { pt: "Pele, 10 mm, fivela dupla.", en: "Leather, 10 mm, double prong." },
    description: {
      pt: "Pele genuína de 10 mm, largura constante, fivela de dois pinos. Não é um acessório de moda: é o que mantém a coluna no sítio quando o agachamento fica sério.",
      en: "Genuine 10 mm leather, uniform width, double-prong buckle. Not a fashion accessory: it is what keeps your spine where it belongs when the squat gets serious.",
    },
    price: 45,
    category: "equipamento",
    sizes: ["S", "M", "L", "XL"],
    image: null,
    draft: true,
    featured: true,
  },
  {
    slug: "magnesio",
    name: { pt: "Magnésio", en: "Lifting chalk" },
    tagline: { pt: "Bloco de 56 g.", en: "56 g block." },
    description: {
      pt: "Carbonato de magnésio em bloco. A coisa mais barata da loja e a que mais quilos acrescenta à barra.",
      en: "Block magnesium carbonate. The cheapest thing in the shop and the one that adds the most kilos to the bar.",
    },
    price: 8,
    category: "equipamento",
    sizes: null,
    image: null,
    draft: true,
    featured: true,
  },
];

export const featuredProducts = () => PRODUCTS.filter((p) => p.featured);
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const draftProducts = () => PRODUCTS.filter((p) => p.draft);

/** Referência de catálogo (MY-01). Função pura: vive aqui e não num módulo cliente. */
export const productRef = (slug: string) =>
  `MY-${String(PRODUCTS.findIndex((p) => p.slug === slug) + 1).padStart(2, "0")}`;

export const formatPrice = (euros: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: euros % 1 === 0 ? 0 : 2,
  }).format(euros);

/**
 * ENCOMENDA
 * O carrinho vive no browser e a encomenda sai por WhatsApp, com levantamento e
 * pagamento no ginásio. Zero custo mensal, zero burocracia de pagamentos.
 *
 * MAS O NÚMERO NÃO EXISTE. O Mythical não publicou telefone nenhum, e o número
 * que aqui estava era do ginásio do projeto anterior: teria mandado as
 * encomendas dos clientes deste para o WhatsApp de outra empresa, em Carcavelos.
 * Enquanto `whatsapp` for null, o carrinho encaminha para o Instagram.
 */
export const ORDER = {
  whatsapp: null as string | null,
  pickupOnly: true,
};

/** Há canal de encomenda? Governa o botão final do carrinho. */
export const canOrder = (): boolean => ORDER.whatsapp !== null;
