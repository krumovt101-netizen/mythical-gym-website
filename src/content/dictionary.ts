/**
 * COPY
 * =============================================================================
 * Regras de voz, e não são decorativas:
 *
 *  1. Nunca um adjetivo onde cabe um facto. Nunca um slogan onde cabe uma data,
 *     uma marca ou um ano.
 *  2. Zero em-dashes. Zero tríades de streetwear ("Forte. Real. Sem desculpas.").
 *  3. Zero clichés de fitness: "supera-te", "a tua melhor versão", "vem fazer
 *     parte da família", "no pain no gain".
 *  4. Se uma frase pudesse aparecer no site de qualquer ginásio do país, está
 *     errada e sai.
 *
 * O CONTEXTO, porque a voz sai daqui:
 *
 * Em Pombal já há seis ginásios, e todos dizem a mesma coisa: aulas, cardio,
 * equipamento moderno, resultados. O Mythical não pode ganhar nesse terreno,
 * porque é o mais novo de todos e não tem nem notoriedade nem histórico.
 *
 * Mas tem uma coisa que nenhum deles tem: ferro da era dourada, que já não se
 * fabrica e que hoje só se encontra em segunda mão. Isso não é nostalgia, é uma
 * barreira à entrada. O Pulse pode comprar amanhã máquinas melhores; não pode
 * comprar máquinas de 1991.
 *
 * A PALAVRA "RESTAURADO" NÃO ENTRA AQUI, e não é por acaso. O site chegou a
 * dizer que as máquinas eram restauradas e que a casa as restaura. Ninguém
 * confirmou isso: o único facto verificado é uma Cybex do início dos anos 90.
 * Dizer que foi restaurada é uma afirmação sobre trabalho que não vimos, e este
 * site não faz afirmações dessas. Se um dia a casa confirmar que restaura o
 * ferro, volta a entrar, com fonte, como qualquer outro facto do registo.
 *
 * Portanto a voz desta casa é a de quem cataloga, não a de quem grita. Marca,
 * modelo, ano. Um site que se lê como um registo de inventário, porque é
 * exatamente isso que a concorrência não consegue responder.
 */

import type { Locale } from "./site";

export const DICT = {
  nav: {
    gym: { pt: "O Ginásio", en: "The Gym" },
    iron: { pt: "O Ferro", en: "The Iron" },
    shop: { pt: "Loja", en: "Shop" },
    contact: { pt: "Contactos", en: "Contact" },
    join: { pt: "Inscrever", en: "Join" },
    menu: { pt: "Menu", en: "Menu" },
    close: { pt: "Fechar", en: "Close" },
  },

  home: {
    heroKicker: { pt: "Pombal, Zona Industrial da Formiga", en: "Pombal, Formiga industrial estate" },
    heroLine1: { pt: "Ferro que já", en: "Iron they no" },
    heroLine2: { pt: "não se fabrica.", en: "longer make." },
    heroBody: {
      pt: "Um armazém em Pombal, com máquinas catalogadas uma a uma, por marca e por ano. Portas abertas desde 1 de julho de 2026.",
      en: "A warehouse in Pombal, with machines catalogued one by one, by maker and by year. Open since 1 July 2026.",
    },
    heroCtaGym: { pt: "Ver o ginásio", en: "See the gym" },
    heroCtaIron: { pt: "Ver o registo", en: "See the record" },

    /* A tese. Substitui o bloco "duas metades" do esqueleto original: o Mythical
       é uma coisa só, e diluí-lo em duas colunas era enfraquecê-lo. */
    thesisKicker: { pt: "Porque é que isto importa", en: "Why this matters" },
    thesisTitle: {
      pt: "Uma máquina de 1991 não se encomenda.",
      en: "A 1991 machine cannot be ordered.",
    },
    thesisBody: {
      pt: "Encontra-se, e compra-se a quem a tem. É a diferença entre um ginásio que abriu com um catálogo e um ginásio que abriu com uma procura. Qualquer casa em Pombal pode comprar equipamento melhor do que o nosso amanhã de manhã. Nenhuma pode comprar equipamento mais antigo.",
      en: "You find it, and you buy it from whoever has it. That is the difference between a gym that opened with a catalogue and a gym that opened with a search. Any club in Pombal can buy better equipment than ours tomorrow morning. None of them can buy older equipment.",
    },

    /* O registo do ferro. É o coração do site. */
    ironTitle: { pt: "O registo do ferro", en: "The record of the iron" },
    ironBody: {
      pt: "Cada máquina com a marca, o modelo e o ano em que saiu da fábrica. O registo começou no dia em que abrimos e cresce a cada peça que entra.",
      en: "Every machine with its maker, model and year of manufacture. The record began the day we opened and grows with each piece that arrives.",
    },
    ironLink: { pt: "Ver o registo completo", en: "See the full record" },
    ironEmpty: {
      pt: "O registo está a ser levantado.",
      en: "The record is being compiled.",
    },

    spaceTitle: { pt: "Um armazém, não um clube.", en: "A warehouse, not a club." },
    spaceBody: {
      pt: "Sem receção de hotel, sem música a competir com as séries, sem aulas a disputar o chão com quem está a levantar. Pé-direito de armazém e espaço para circular.",
      en: "No hotel lobby, no music competing with your sets, no classes fighting the floor with people who came to lift. Warehouse ceilings and room to move.",
    },

    equipmentTitle: { pt: "As marcas em casa", en: "The makers in the house" },
    equipmentBody: {
      pt: "Esta lista sai do registo, e não de um folheto. Só aparece aqui uma marca de que exista pelo menos uma máquina catalogada lá dentro.",
      en: "This list comes from the record, not from a brochure. A maker only appears here if at least one of its machines is catalogued inside.",
    },

    shopTitle: { pt: "Vestir a casa", en: "Wear the house" },
    shopBody: {
      pt: "Vestuário, com levantamento no ginásio.",
      en: "Apparel, collected at the gym.",
    },
    shopLink: { pt: "Ver a loja", en: "Browse the shop" },

    visitTitle: { pt: "Aparece", en: "Come in" },
    visitBody: {
      pt: "Rua José António Varela Pinto, armazém 4, na Zona Industrial da Formiga. Entre a Sumol e a Cuétara. Manda mensagem antes, se quiseres, mas a porta está aberta.",
      en: "Rua José António Varela Pinto, armazém 4, in the Formiga industrial estate. Between the Sumol and Cuétara plants. Message ahead if you like, but the door is open.",
    },

    campaignTitle: { pt: "Pack de verão", en: "Summer pack" },
    campaignBody: {
      pt: "A decorrer de {dates}. O valor não está publicado: manda mensagem no Instagram e pergunta.",
      en: "Running from {dates}. The price is not published: message on Instagram and ask.",
    },
  },

  gym: {
    title: { pt: "O ginásio", en: "The gym" },
    lede: {
      pt: "Rua José António Varela Pinto, armazém 4, na Zona Industrial da Formiga, em Pombal. Aberto a 1 de julho de 2026.",
      en: "Rua José António Varela Pinto, armazém 4, in the Formiga industrial estate, Pombal. Opened 1 July 2026.",
    },
    thesis: {
      pt: "Um pavilhão industrial reconvertido em sala de musculação. O que está lá dentro está catalogado, peça a peça.",
      en: "An industrial unit turned into a weights floor. What is inside is catalogued, piece by piece.",
    },
    ironTitle: { pt: "O ferro", en: "The iron" },
    zonesTitle: { pt: "As zonas", en: "The zones" },
    zonesBody: {
      pt: "Cada uma tem nome, e cada nome tem uma razão.",
      en: "Each one has a name, and each name has a reason.",
    },
    equipmentTitle: { pt: "As marcas", en: "The makers" },
    disciplinesTitle: { pt: "O que se treina", en: "What gets trained" },
    visitTitle: { pt: "Como chegar", en: "Getting here" },
    directionsBody: {
      pt: "A Zona Industrial da Formiga não é fácil à primeira. A referência é a Cuétara: o armazém 4 fica ao lado.",
      en: "The Formiga industrial estate is not easy to find first time. Use the Cuétara plant as your marker: armazém 4 is right beside it.",
    },
    pricingTitle: { pt: "Preços", en: "Pricing" },
    pricingPending: {
      pt: "Os valores ainda não estão publicados. Manda mensagem em {handle} e respondemos com o tabelário em vigor.",
      en: "Prices are not published yet. Message {handle} and we will reply with the current rates.",
    },
    hoursTitle: { pt: "Horário", en: "Opening hours" },
    hoursPending: {
      pt: "O horário ainda não está publicado. Confirma em {handle} antes de vires de longe.",
      en: "Opening hours are not published yet. Check {handle} before travelling.",
    },
  },

  iron: {
    title: { pt: "O registo do ferro", en: "The record of the iron" },
    lede: {
      pt: "Todas as máquinas do pavilhão, com marca, modelo e ano de fabrico. Uma máquina só entra nesta lista depois de estar lá dentro.",
      en: "Every machine on the floor, with maker, model and year of manufacture. A machine only enters this list once it is physically inside.",
    },
    empty: {
      pt: "O registo está a ser levantado, máquina a máquina. Volta daqui a uns dias.",
      en: "The record is being compiled, machine by machine. Come back in a few days.",
    },
    makerLabel: { pt: "Fabricante", en: "Maker" },
    eraLabel: { pt: "Fabrico", en: "Built" },
  },

  shop: {
    title: { pt: "Loja", en: "Shop" },
    lede: {
      pt: "Vestuário da casa. Encomenda online, levantamento no ginásio.",
      en: "The house's apparel. Order online, collect at the gym.",
    },
    all: { pt: "Tudo", en: "All" },
    addToCart: { pt: "Adicionar", en: "Add" },
    added: { pt: "Adicionado", en: "Added" },
    chooseSize: { pt: "Escolher tamanho", en: "Choose a size" },
    size: { pt: "Tamanho", en: "Size" },
    cart: { pt: "Carrinho", en: "Cart" },
    cartEmpty: { pt: "O carrinho está vazio.", en: "Your cart is empty." },
    cartEmptyBody: { pt: "Ainda não escolheste nada.", en: "Nothing chosen yet." },
    total: { pt: "Total", en: "Total" },
    remove: { pt: "Remover", en: "Remove" },
    decrease: { pt: "Diminuir quantidade", en: "Decrease quantity" },
    increase: { pt: "Aumentar quantidade", en: "Increase quantity" },
    checkout: { pt: "Encomendar por WhatsApp", en: "Order via WhatsApp" },
    checkoutNote: {
      pt: "A encomenda segue por WhatsApp para o ginásio. Confirmamos tamanho e disponibilidade, e pagas no levantamento.",
      en: "Your order goes to the gym by WhatsApp. We confirm size and stock, and you pay on collection.",
    },
    backToShop: { pt: "Voltar à loja", en: "Back to the shop" },
    orderIntro: { pt: "Olá! Queria encomendar:", en: "Hello! I would like to order:" },
  },

  contact: {
    title: { pt: "Contactos", en: "Contact" },
    address: { pt: "Morada", en: "Address" },
    phone: { pt: "Telefone", en: "Phone" },
    social: { pt: "Instagram", en: "Instagram" },
    directions: { pt: "Abrir no Google Maps", en: "Open in Google Maps" },
    joinTitle: { pt: "Inscrever", en: "Join" },
    joinBody: {
      pt: "A inscrição faz-se no ginásio. Aparece com calçado de treino, ou manda mensagem primeiro se quiseres perguntar alguma coisa.",
      en: "Sign-up happens at the gym. Come by with training shoes, or message first if you have questions.",
    },
    /* Não há telefone publicado. O site não finge que há. */
    phonePending: {
      pt: "Ainda não há telefone publicado. O canal que funciona é o Instagram.",
      en: "No phone line is published yet. Instagram is the channel that works.",
    },
    dm: { pt: "Mandar mensagem no Instagram", en: "Message on Instagram" },
  },

  common: {
    source: { pt: "Fonte", en: "Source" },
    sources: { pt: "Fontes", en: "Sources" },
    provisional: { pt: "Imagem provisória", en: "Placeholder image" },
    provisionalAlt: {
      pt: "Imagem provisória. Não é uma fotografia do Mythical Gym.",
      en: "Placeholder image. Not a photograph of Mythical Gym.",
    },
    photoPending: {
      pt: "Fotografia por chegar",
      en: "Photograph pending",
    },
    more: { pt: "Ver mais", en: "See more" },
    footerNote: {
      pt: "Os factos publicados neste site são os que estão confirmados. O que falta, falta à vista.",
      en: "The facts published on this site are the ones confirmed. What is missing is missing in plain sight.",
    },
    rights: { pt: "Todos os direitos reservados.", en: "All rights reserved." },
    langSwitch: { pt: "EN", en: "PT" },
    openedSince: { pt: "Aberto desde", en: "Open since" },
  },
} as const;

/** Colhe uma string traduzida de um par { pt, en }. */
export function t<T extends Record<Locale, string>>(entry: T, locale: Locale): string {
  return entry[locale];
}

/** Substitui {chaves} numa string de copy. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}
