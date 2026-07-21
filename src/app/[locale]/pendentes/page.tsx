import type { Metadata } from "next";
import { LOCALES, SITE, type Locale } from "@/content/site";
import { pendingClaims } from "@/content/registry";
import { pendingZones, DISCIPLINES, PRICING } from "@/content/gym";
import { missingShots, stockShots } from "@/content/media";
import { draftProducts, ORDER } from "@/content/shop";
import { MACHINES } from "@/content/machines";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Pendentes",
  robots: { index: false, follow: false },
};

/**
 * Estes dois vivem FORA do componente de propósito. Definidos lá dentro, seriam
 * recriados a cada render, o React trataria cada um como um tipo novo e
 * desmontaria a subárvore inteira em vez de a atualizar. O lint apanha-o.
 */
function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-12">
      <h2 className="t-headline text-2xl text-cream sm:text-3xl">{title}</h2>
      {lede && <p className="t-body mt-3 max-w-[70ch] text-mercury">{lede}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Item({ title, why }: { title: string; why: string }) {
  return (
    <li className="tick border-b border-rule-soft py-6 pl-6">
      <p className="t-headline text-lg text-cream">{title}</p>
      <p className="t-body mt-2 max-w-[80ch] text-sm text-mercury">{why}</p>
    </li>
  );
}

/**
 * PENDENTES
 * =============================================================================
 * Esta página não é para o público. É a lista de tudo o que o site se recusa a
 * publicar por não estar confirmado, e do que é preciso para desbloquear cada
 * coisa. Está fora do sitemap e bloqueada no robots.txt.
 *
 * Existe porque a alternativa é um email com uma lista que ninguém volta a
 * encontrar. Aqui a lista é gerada a partir dos próprios interruptores do
 * código: quando o cliente preencher um, ele desaparece daqui sozinho. Não há
 * uma segunda lista para manter sincronizada.
 */
export default async function PendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  /* Os bloqueios que vivem no site.ts e que não têm um registo próprio. */
  const configGaps = [
    {
      id: "logo",
      title: "Logótipo",
      blocked: true,
      why: "Não recebi ficheiro nenhum da marca. O que está no site é um wordmark tipográfico que desenhei, com uma placa de fabricante como símbolo. Funciona, mas é interino. Idealmente em SVG; um PNG com fundo transparente também serve.",
    },
    {
      id: "phone",
      title: "Telefone",
      blocked: SITE.phone.e164 === null,
      why: "Não existe número em fonte pública nenhuma. Enquanto não houver, todos os pontos do site que diriam 'ligue' dizem 'mande mensagem' e apontam ao Instagram. É o campo em falta que mais conversão custa.",
    },
    {
      id: "email",
      title: "Email",
      blocked: SITE.email.general === null,
      why: "Sem email público não há canal escrito para quem não usa Instagram, e não há como receber uma inscrição fora de horas.",
    },
    {
      id: "hours",
      title: "Horário",
      blocked: !SITE.hours.confirmed,
      why: "Não está publicado nem no Instagram da própria casa. É a primeira pergunta de quem se quer inscrever, e a mais fácil de responder.",
    },
    {
      id: "postal",
      title: "Código postal",
      blocked: SITE.address.postal === null,
      why: "Falta o sufixo de Pombal (3100-___). Entra na morada, nos dados estruturados do Google e no cartão de pesquisa local.",
    },
    {
      id: "domain",
      title: "Domínio",
      blocked: !SITE.domainConfirmed,
      why: `Não foi encontrado domínio registado. O site está a usar ${SITE.url} como marcador, e isso alimenta os canónicos e o sitemap. Uma linha a mudar, em src/content/site.ts.`,
    },
    {
      id: "pricing",
      title: "Preços",
      blocked: !PRICING.confirmed,
      why: "Nenhum valor está publicado. Nota de estratégia: em Pombal, o Pulse, o MoveUP e o Fitness Factory escondem todos o preço. Mostrá-lo é, neste mercado, um ato de autoridade, e para uma casa nova é a forma mais barata de tirar atrito à primeira inscrição.",
    },
    {
      id: "campaign-price",
      title: "Preço do pack de verão",
      blocked: true,
      why: "A campanha (15 de julho a 15 de setembro) está anunciada no site porque as datas são vossas e são públicas. O valor não, e por isso o site manda perguntar. Com o valor, a campanha passa a vender sozinha.",
    },
    {
      id: "disciplines",
      title: "O que se treina",
      blocked: !DISCIPLINES.confirmed,
      why: DISCIPLINES.note,
    },
    {
      id: "order-channel",
      title: "Canal de encomenda da loja",
      blocked: ORDER.whatsapp === null,
      why: "O carrinho está construído para enviar a encomenda por WhatsApp. Falta o número. Sem ele, o carrinho encaminha para o Instagram.",
    },
  ].filter((g) => g.blocked);

  const facts = pendingClaims();
  const zones = pendingZones();
  const shots = missingShots();
  const stock = stockShots();
  const drafts = draftProducts();
  const machinesNote = MACHINES.length <= 1;

  return (
    <div className="mx-auto max-w-[76rem] px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
      <p className="t-data text-brass">{l === "pt" ? "Documento interno" : "Internal document"}</p>
      <h1 className="t-display mt-6 text-[clamp(2.5rem,7vw,5rem)] text-cream">
        {l === "pt" ? "O que falta" : "What is missing"}
      </h1>
      <p className="t-body mt-8 max-w-[70ch] text-lg text-cream-dim">
        {l === "pt"
          ? "Tudo o que este site se recusa a publicar por não estar confirmado, e o que é preciso para desbloquear cada coisa. Esta lista é gerada a partir dos interruptores do próprio código: quando preencherem um, ele desaparece daqui sozinho."
          : "Everything this site refuses to publish because it is unconfirmed, and what is needed to unblock each item. This list is generated from the code's own switches: fill one in and it disappears from here by itself."}
      </p>

      <Section
        title={l === "pt" ? "Configuração da casa" : "House configuration"}
        lede={
          l === "pt"
            ? "Os campos base. São os mais rápidos de resolver e os que mais mudam o site."
            : "The base fields. Quickest to resolve, biggest effect on the site."
        }
      >
        <ul>
          {configGaps.map((g) => (
            <Item key={g.id} title={g.title} why={g.why} />
          ))}
        </ul>
      </Section>

      {machinesNote && (
        <Section
          title={l === "pt" ? "O registo do ferro" : "The record of the iron"}
          lede={
            l === "pt"
              ? "É a tarefa mais rentável desta lista, e a mais barata."
              : "The most valuable task on this list, and the cheapest."
          }
        >
          <ul>
            <Item
              title={l === "pt" ? "Catalogar o pavilhão" : "Catalogue the floor"}
              why={
                l === "pt"
                  ? "Há uma máquina catalogada: a Cybex Classic Leg Press. Tudo o resto que está no pavilhão é real mas não está registado, e o site não o inventa. Uma volta com o telemóvel, uma foto da placa e uma foto da máquina por cada aparelho, e a página do ferro passa a ser uma coisa que nenhum ginásio do distrito consegue responder. Nota importante: as marcas Nautilus, Icarian e Body Masters aparecem associadas a vocês nas pesquisas, mas são de um revendedor britânico cujas publicações vocês comentam. Não entraram no site, e só entram se estiverem lá dentro."
                  : "One machine is catalogued: the Cybex Classic Leg Press. Everything else on the floor is real but unrecorded, and the site does not invent it. One walk around with a phone, a photo of the maker's plate and a photo of the machine for each unit, and the iron page becomes something no gym in the district can answer. Important: Nautilus, Icarian and Body Masters show up associated with you in searches, but they belong to a British dealer whose posts you comment on. They are not on the site, and only go on if they are physically inside."
              }
            />
          </ul>
        </Section>
      )}

      {facts.length > 0 && (
        <Section
          title={l === "pt" ? "Números" : "Figures"}
          lede={
            l === "pt"
              ? "A barra de números da homepage só aparece com três ou mais confirmados. Hoje não aparece."
              : "The homepage figures bar only appears with three or more confirmed. Today it does not appear."
          }
        >
          <ul>
            {/* `name` e não `label`: o label é escrito para vir a seguir a um
                número ("450 m2 de área de treino") e sozinho lia-se como uma
                frase cortada a meio. */}
            {facts.map((f) => (
              <Item key={f.id} title={(f.name ?? f.label)[l]} why={f.note ?? ""} />
            ))}
          </ul>
        </Section>
      )}

      {zones.length > 0 && (
        <Section title={l === "pt" ? "Zonas do espaço" : "Areas of the space"}>
          <ul>
            {zones.map((z) => (
              <Item key={z.id} title={z.name[l]} why={z.note ?? ""} />
            ))}
          </ul>
        </Section>
      )}

      {stock.length > 0 && (
        <Section
          title={l === "pt" ? "Fotografia provisória no ar" : "Placeholder photography live"}
          lede={
            l === "pt"
              ? `${stock.length} imagens do site são de banco de imagens (Unsplash, licença de uso comercial livre) e NÃO são do vosso pavilhão. Foram escolhidas escuras e sem pessoas para não contradizer o posicionamento, mas continuam a ser de outros ginásios. Cada uma leva a etiqueta "Imagem provisória" no ecrã, e o build de produção está bloqueado enquanto aqui houver uma.`
              : `${stock.length} images on the site are stock (Unsplash, free commercial licence) and are NOT of your unit. They were picked dark and free of people so as not to contradict the positioning, but they remain other gyms. Each carries a "Placeholder image" label on screen, and the production build is blocked while any remain.`
          }
        >
          <ul>
            {stock.map((s) => (
              <Item
                key={s.slot}
                title={`${s.slot} (${s.credit ?? "banco de imagens"})`}
                why={s.spec}
              />
            ))}
          </ul>
        </Section>
      )}

      {shots.length > 0 && (
        <Section
          title={l === "pt" ? "Fotografia que NÃO pode ser de banco" : "Photography that must NOT be stock"}
          lede={
            l === "pt"
              ? "Estes dois lugares ficaram deliberadamente vazios, e não é a mesma coisa que estar à espera de uma foto melhor. Aqui uma imagem de banco não seria ambiente, seria prova falsa: um ilustra a única máquina que o registo afirma existir, o outro serve para reconhecer o edifício à chegada. São também as duas mais fáceis de tirar, do telemóvel."
              : "These two slots were left deliberately empty, which is not the same as waiting for a better photo. Here a stock image would not be atmosphere, it would be false evidence: one illustrates the only machine the record claims exists, the other is how someone recognises the building on arrival. They are also the two easiest to take, on a phone."
          }
        >
          <ul>
            {shots.map((s) => (
              <Item key={s.slot} title={s.slot} why={s.spec} />
            ))}
          </ul>
        </Section>
      )}

      {drafts.length > 0 && (
        <Section
          title={l === "pt" ? "Loja" : "Shop"}
          lede={
            l === "pt"
              ? `${drafts.length} produtos provisórios. Os nomes e os preços foram escritos por mim como estrutura, não são o vosso catálogo. O build de produção recusa-se a compilar enquanto houver um em pé. Se não houver loja para já, a decisão certa é esvaziar o catálogo e tirar a Loja do menu.`
              : `${drafts.length} provisional products. The names and prices are structure I wrote, not your catalogue. The production build refuses to compile while one remains. If there is no shop yet, the right call is to empty the catalogue and remove Shop from the menu.`
          }
        >
          <ul>
            {drafts.map((p) => (
              <Item
                key={p.slug}
                title={p.name[l]}
                why={
                  l === "pt"
                    ? "Confirmar nome, preço, tamanhos e foto, e pôr draft: false."
                    : "Confirm name, price, sizes and photo, then set draft: false."
                }
              />
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
