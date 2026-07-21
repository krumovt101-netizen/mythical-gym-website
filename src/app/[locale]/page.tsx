import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, Reveal } from "@/components/ui";
import { Shot, ProvisionalTag } from "@/components/Shot";
import { Plate } from "@/components/Wordmark";
import { DICT, fill } from "@/content/dictionary";
import { SITE, type Locale } from "@/content/site";
import { shot, isStock, sequence } from "@/content/media";
import ScrollSequence from "@/components/ScrollSequence";
import DayClock from "@/components/DayClock";
import Blueprint from "@/components/Blueprint";
import { publicClaims, showClaimsBar } from "@/content/registry";
import { brands, showBrands, CAMPAIGN, campaignLive } from "@/content/gym";
import { confirmedMachines } from "@/content/machines";
import { featuredProducts, formatPrice } from "@/content/shop";

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
    description: pt
      ? "Ginásio na Zona Industrial da Formiga, em Pombal, com equipamento catalogado por marca e ano de fabrico. Aberto desde 1 de julho de 2026."
      : "A gym in the Formiga industrial estate, Pombal, with equipment catalogued by maker and year of manufacture. Open since 1 July 2026.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = DICT.home;
  const claims = publicClaims();
  const machines = confirmedMachines();
  const makers = brands();
  const products = featuredProducts();
  const heroPhoto = shot("hero")?.src;
  const heroSeq = sequence("hero")!;
  const heroSequence = heroSeq.frameCount > 0;

  /* Os véus do herói, partilhados pelos dois heróis possíveis (sequência e
     fotografia). A calibração está comentada mais abaixo, junto ao herói
     original; é UMA calibração, e é por isso que isto é um fragmento e não
     duas cópias. */
  const heroVeils = (
    <>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-1 h-[80%] bg-gradient-to-t from-carbon from-10% via-carbon/72 via-55% to-transparent"
      />
      <div aria-hidden className="absolute inset-0 z-1 bg-carbon/8" />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-1 w-full bg-gradient-to-r from-carbon/72 via-carbon/48 via-30% to-transparent to-58%"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-1 h-32 bg-gradient-to-b from-carbon/85 to-transparent"
      />
    </>
  );

  const heroText = (
    <div className="relative z-2 mx-auto w-full max-w-[92rem] px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
      <p className="t-data rise text-oxide">{c.heroKicker[l]}</p>

      <h1 className="mt-6 sm:mt-8">
        <span className="t-display rise block text-[clamp(2.75rem,8.5vw,7.5rem)] text-white">
          {c.heroLine1[l]}
        </span>
        <span
          className="t-display rise block text-[clamp(2.75rem,8.5vw,7.5rem)] text-oxide"
          style={{ animationDelay: "90ms" }}
        >
          {c.heroLine2[l]}
        </span>
      </h1>

      <div
        className="rise mt-10 grid gap-8 border-t border-white/20 pt-8 sm:mt-12 lg:grid-cols-[minmax(0,44ch)_minmax(0,1fr)] lg:items-center lg:gap-16"
        style={{ animationDelay: "180ms" }}
      >
        <p className="t-body text-base text-white/85 sm:text-lg">{c.heroBody[l]}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-5 lg:justify-end">
          <Button href={`/${l}/ginasio`}>{c.heroCtaGym[l]}</Button>
          <Button href={`/${l}/ginasio#ferro`} variant="outline-invert">
            {c.heroCtaIron[l]}
          </Button>
        </div>
      </div>
    </div>
  );

  /* UM CAPÍTULO DO DIA: secção pinada que faz scrub da sua sequência. Se a
     sequência estiver desligada (frameCount 0), o capítulo não existe e a
     página flui como antes: os capítulos são cinema por cima do conteúdo,
     nunca o contrário. */
  const chapter = (
    slot: string,
    cap: { kicker: Record<Locale, string>; line: Record<Locale, string> },
    opts: { id?: string; children?: ReactNode } = {},
  ) => {
    const s = sequence(slot);
    if (!s || s.frameCount === 0) return null;
    return (
      <div id={opts.id}>
        <ScrollSequence
          base={s.base}
          frameCount={s.frameCount}
          scrollLength={s.scrollLength}
          posterAlt={`${s.alt[l]}. ${DICT.common.provisionalAlt[l]}`}
          lazy
          className="isolate bg-carbon"
        >
          <div aria-hidden className="grain absolute inset-0" />
          {/* Um véu só: os capítulos têm menos texto que o herói, e o texto
              vive no fundo do ecrã. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-1 h-[55%] bg-gradient-to-t from-carbon from-8% via-carbon/60 via-50% to-transparent"
          />
          <div className="flex h-full items-end">
            <div className="relative z-2 mx-auto w-full max-w-[92rem] px-5 pb-16 sm:px-8 sm:pb-24">
              <p className="t-data text-oxide">{cap.kicker[l]}</p>
              <p className="t-display mt-4 max-w-[24ch] text-[clamp(1.75rem,4.5vw,3.5rem)] text-white">
                {cap.line[l]}
              </p>
              {opts.children}
            </div>
          </div>
          {s.stock && (
            <ProvisionalTag locale={l} position="bottom-right" className="z-3" />
          )}
        </ScrollSequence>
      </div>
    );
  };

  return (
    <>
      {/* O relógio do dia: fixo, percorre 05:30→23:00 até ao fim do último
          capítulo. Só na homepage, que é onde o dia se conta. */}
      <DayClock endId="fecho" />

      {heroSequence ? (
        /* ------------------------------------------------------------- HERO
           COM SEQUÊNCIA DE SCROLL. O scroll faz scrub de um dolly-out: começa
           num detalhe das árvores de discos e recua até ao plano largo do
           pavilhão — o detalhe revela-se parte de um plano maior. A sequência
           é gerada por computador e leva a etiqueta de provisório como
           qualquer imagem de banco; ver SEQUENCES em content/media.ts,
           e a skill scroll-video-animation para o pipeline. */
        <ScrollSequence
          base={heroSeq.base}
          frameCount={heroSeq.frameCount}
          scrollLength={heroSeq.scrollLength}
          posterAlt={`${heroSeq.alt[l]}. ${DICT.common.provisionalAlt[l]}`}
          priority
          className="isolate bg-carbon"
        >
          {/* O grão vive no viewport preso, não na secção alta: senão a
              textura esticava pelos 250vh e diluía-se. */}
          <div aria-hidden className="grain absolute inset-0" />
          {heroVeils}
          <div className="flex h-full items-end">{heroText}</div>
          {heroSeq.stock && (
            <ProvisionalTag locale={l} position="bottom-right" className="z-3" />
          )}
        </ScrollSequence>
      ) : (
      /* ---------------------------------------------------------------- HERO
          NÃO HÁ FOTOGRAFIA DESTE GINÁSIO, e o herói foi desenhado a contar com
          isso e não a lamentá-lo. Enquanto não houver foto, o fundo é a grelha
          do caderno de registo e o grão: o herói é tipográfico, e a tipografia
          condensada e pesada aguenta o ecrã sozinha.

          No dia em que a fotografia chegar, basta escrever o `src` em media.ts:
          ela entra por trás com o mesmo véu, e nada aqui muda. */
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-carbon grain">
        {heroPhoto ? (
          /* Sem scrim no próprio Shot: o escurecimento é todo feito em baixo,
             em duas camadas medidas. Com o scrim do Shot por cima destas, a
             fotografia desaparecia por completo e o herói ficava igual ao que
             era sem foto nenhuma, que é desperdiçar a imagem. */
          <div className="absolute inset-0 z-0">
            <Shot
              slot="hero"
              locale={l}
              sizes="100vw"
              priority
              scrim="none"
              className="size-full"
              tag="off"
              objectPosition="center 42%"
            />
          </div>
        ) : (
          <>
            <div className="ruled absolute inset-0 z-0 opacity-30" aria-hidden />
            {/* A placa em marca de água. É o símbolo da casa a fazer de imagem,
                em vez de uma fotografia que não é dela. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 top-1/2 z-0 -translate-y-1/2 text-oxide opacity-[0.07] sm:right-0"
            >
              <Plate size={620} />
            </div>
          </>
        )}

        {/* OS VÉUS, e estão dimensionados e não estimados.

            O texto vive no terço de baixo. Portanto o escurecimento também: uma
            banda que é opaca onde o texto assenta e morre antes de chegar ao
            meio do ecrã. Em cima a fotografia fica visível, que é a razão de ela
            existir. Um véu uniforme forte resolveria o contraste e apagava a
            imagem; um véu fraco mostrava a imagem e deixava o texto ilegível
            sobre um teto claro. É por isso que são duas camadas e não uma.

            O TERCEIRO VÉU, o da coluna do texto, é o que resolve o problema a
            sério: a fotografia tinha projetores de teto a 239/255 e o latão do
            título media 1,51:1 contra os 3:1 da norma. Escurecer só a coluna
            esquerda resolve o contraste e deixa a imagem respirar à direita.
            Estes valores são o mínimo que sustenta o latão acima de 3:1 sobre
            o pior pixel debaixo dos glifos, medido e não estimado. Não subir
            sem medir outra vez. Os quatro véus estão em `heroVeils`, em cima,
            partilhados com o herói de sequência. */}
        {heroVeils}

        {heroText}

        {/* A etiqueta sai DE DENTRO da foto e assenta por cima dos véus.
            Dentro do <Shot> ela ficava por baixo dos três gradientes e não se
            via, e o resultado era uma fotografia de banco sem aviso visível
            enquanto a da secção seguinte o tinha: honestidade a meias lê-se
            pior do que honestidade nenhuma. Canto direito, que é o lado que o
            texto não ocupa. */}
        {isStock("hero") && <ProvisionalTag locale={l} position="bottom-right" className="z-3" />}
      </section>
      )}

      {/* ------------------------------------------------- CAPÍTULO: 07:00 */}
      {chapter("luz", c.journey.luz)}

      {/* ------------------------------------------------------ BARRA DE NÚMEROS
          Só aparece com três ou mais factos verificados. Hoje há um, portanto
          não aparece. Uma barra de estatísticas com um número parece um erro de
          maquetagem, e este site tem argumentos melhores para pôr no lugar.
          Ver `showClaimsBar()` em content/registry.ts. */}
      {showClaimsBar() && (
        <section className="relative border-y border-hairline bg-iron">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {claims.map((f, i) => (
                <Reveal
                  key={f.id}
                  as="li"
                  delay={i * 60}
                  className="border-b border-hairline-soft px-1 py-8 sm:border-b-0 sm:py-10 lg:border-r lg:last:border-r-0 lg:pr-6 lg:pl-0 lg:first:pl-0"
                >
                  <p className="t-numeral text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none text-chalk">
                    {f.value}
                  </p>
                  <p className="t-data mt-3 max-w-[16ch] text-steel">{f.label[l]}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- A TESE
          O esqueleto original tinha aqui duas colunas, porque servia um negócio
          com duas metades. O Mythical é uma coisa só, e parti-lo em duas teria
          sido enfraquecê-lo. Uma coluna, um argumento, a largura toda. */}
      <section className="relative border-b border-hairline bg-void py-24 sm:py-32">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <div className="flex items-center gap-3">
                  <Plate size={16} className="text-oxide" />
                  <p className="t-data text-steel-dim">{c.thesisKicker[l]}</p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="t-display mt-8 max-w-[18ch] text-[clamp(2.5rem,6vw,5rem)] text-chalk">
                  {c.thesisTitle[l]}
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="t-body mt-8 max-w-[62ch] text-lg text-chalk-dim">
                  {c.thesisBody[l]}
                </p>
              </Reveal>
            </div>

            {/* O grande plano do ferro gasto. Aqui a imagem é CONTEÚDO, ao lado
                do texto, e não fundo por baixo dele: não há texto por cima,
                portanto não há contraste para negociar. */}
            {shot("plate")?.src && (
              <Reveal delay={120}>
                <Shot
                  slot="plate"
                  locale={l}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="aspect-square w-full border border-hairline"
                />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- CAPÍTULO: O MECANISMO */}
      {chapter("mecanismo", c.journey.mecanismo)}

      {/* A ficha técnica: do cinema para o documento. */}
      <Blueprint locale={l} />

      {/* -------------------------------------------------- O REGISTO DO FERRO
          A banda de papel. É a única secção clara do site, e é de propósito:
          o registo é o documento da casa, e um documento lê-se em papel.
          Esta secção é o coração do argumento comercial. */}
      <section className="relative isolate overflow-hidden bg-paper py-24 text-ink sm:py-32 grain grain-ink">
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-data text-oxide-deep">{SITE.address.municipality}</p>
              <h2 className="t-display mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink">
                {c.ironTitle[l]}
              </h2>
              <p className="t-body mt-5 max-w-[52ch] text-ink-dim">{c.ironBody[l]}</p>
            </div>
            <Link
              href={`/${l}/ginasio#ferro`}
              className="t-data group inline-flex items-center gap-2.5 border-b border-paper-line pb-1 text-ink transition-colors duration-300 hover:border-oxide-deep hover:text-oxide-deep"
            >
              {c.ironLink[l]}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>

          {machines.length > 0 ? (
            <ul className="mt-14 border-t border-paper-line sm:mt-16">
              {machines.map((m, i) => (
                <Reveal key={m.id} as="li" delay={i * 60} className="border-b border-paper-line">
                  <div className="grid gap-3 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8 sm:py-10">
                    <span className="t-data text-oxide-deep sm:w-28">{m.maker}</span>
                    <div className="min-w-0">
                      <p className="t-headline text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">
                        {m.name}
                      </p>
                      <p className="t-body mt-3 max-w-[60ch] text-sm text-ink-dim">{m.blurb[l]}</p>
                    </div>
                    <span className="t-data shrink-0 text-ink-dim">{m.era[l]}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal className="mt-14 border-t border-paper-line pt-10">
              <p className="t-body text-ink-dim">{c.ironEmpty[l]}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ O ESPAÇO */}
      <section className="relative isolate overflow-hidden border-y border-hairline bg-carbon grain">
        {shot("iron")?.src && (
          <div className="absolute inset-0 z-0">
            <Shot slot="iron" locale={l} sizes="100vw" scrim="strong" className="size-full" tag="off" />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-gradient-to-t from-carbon/90 via-carbon/60 to-carbon/40"
        />
        {!shot("iron")?.src && <div className="ruled absolute inset-0 z-0 opacity-25" aria-hidden />}

        <div className="relative z-2 mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <h2 className="t-display max-w-[14ch] text-[clamp(2.5rem,6.5vw,5.5rem)] text-white">
              {c.spaceTitle[l]}
            </h2>
            <p className="t-body mt-6 max-w-[52ch] text-lg text-white/85">{c.spaceBody[l]}</p>
          </Reveal>
        </div>

        {isStock("iron") && <ProvisionalTag locale={l} position="bottom-right" className="z-3" />}
      </section>

      {/* ----------------------------------------------------------- AS MARCAS
          A lista sai do registo do ferro, e não de um folheto. Se o registo
          tiver uma marca, aparece uma; se tiver oito, aparecem oito. Nunca pode
          contradizer a página do ferro, porque é a mesma fonte. */}
      {showBrands() && (
        <section className="relative bg-void py-24 sm:py-32">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <Reveal>
              <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                {c.equipmentTitle[l]}
              </h2>
              <p className="t-body mt-5 max-w-[52ch] text-steel">{c.equipmentBody[l]}</p>
            </Reveal>

            <ul className="mt-14 border-t border-hairline sm:mt-16">
              {makers.map((b, i) => (
                <Reveal key={b.name} as="li" delay={i * 40} className="border-b border-hairline">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6 sm:py-7">
                    <span className="t-display text-[clamp(1.75rem,4vw,3rem)] text-chalk-dim transition-colors duration-300 hover:text-chalk">
                      {b.name}
                    </span>
                    {b.note && <span className="t-data text-oxide">{b.note[l]}</span>}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ------------------------------------------------- CAPÍTULO: 18:30 */}
      {chapter("cheio", c.journey.cheio)}

      {/* -------------------------------------------------------- LOJA EM DESTAQUE */}
      {products.length > 0 && (
        <section className="relative border-t border-hairline bg-iron py-24 sm:py-32">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="t-headline text-[clamp(2rem,4vw,3.25rem)] text-chalk">
                  {c.shopTitle[l]}
                </h2>
                <p className="t-body mt-5 max-w-[42ch] text-steel">{c.shopBody[l]}</p>
              </div>
              <Link
                href={`/${l}/loja`}
                className="t-data group inline-flex items-center gap-2.5 border-b border-hairline pb-1 text-chalk transition-colors duration-300 hover:border-oxide hover:text-oxide"
              >
                {c.shopLink[l]}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </Reveal>

            <ul className="mt-14 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <Reveal key={p.slug} as="li" delay={i * 60} className="bg-iron">
                  <Link href={`/${l}/loja/${p.slug}`} className="group block h-full">
                    <div className="relative isolate aspect-4/5 overflow-hidden bg-iron-2">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name[l]}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span className="grain grid size-full place-items-center">
                          <Plate size={64} className="text-steel-dim opacity-40" />
                        </span>
                      )}
                    </div>
                    <div className="border-t border-hairline p-5 sm:p-6">
                      <p className="t-headline text-lg text-chalk">{p.name[l]}</p>
                      <p className="t-body mt-2 text-sm text-steel">{p.tagline[l]}</p>
                      <p className="t-numeral mt-5 text-chalk-dim transition-colors duration-300 group-hover:text-oxide">
                        {formatPrice(p.price, l)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------- VISITAR */}
      <section className="relative isolate overflow-hidden border-t border-hairline bg-carbon py-24 sm:py-32 grain">
        {/* Era a grelha do caderno sozinha, e uma área desta dimensão sem imagem
            lê-se como uma caixa à espera de fotografia, não como uma decisão. */}
        {shot("visit")?.src ? (
          <div className="absolute inset-0 z-0">
            <Shot slot="visit" locale={l} sizes="100vw" className="size-full" tag="off" />
          </div>
        ) : (
          <div className="ruled absolute inset-0 z-0 opacity-25" aria-hidden />
        )}
        <div
          aria-hidden
          className="absolute inset-0 z-1 bg-gradient-to-r from-carbon via-carbon/85 via-45% to-carbon/55"
        />
        <div aria-hidden className="absolute inset-0 z-1 bg-carbon/30" />
        <div className="relative z-2 mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="t-display text-[clamp(3rem,8vw,6.5rem)] text-chalk">
                {c.visitTitle[l]}
              </h2>
              <p className="t-body mt-6 max-w-[46ch] text-lg text-chalk-dim">{c.visitBody[l]}</p>
              <div className="mt-10">
                <Button href={`/${l}/contactos#aderir`}>{DICT.nav.join[l]}</Button>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:pt-4">
              <dl className="border-t border-hairline">
                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{DICT.contact.address[l]}</dt>
                  <dd className="t-body mt-3 text-chalk">
                    {SITE.address.street}
                    <br />
                    {SITE.address.area}
                    <br />
                    {SITE.address.postal ? `${SITE.address.postal}, ` : ""}
                    {SITE.address.municipality}
                  </dd>
                </div>

                {/* Não há telefone publicado. Em vez de o esconder, o site diz
                    qual é o canal que funciona, que é o Instagram. */}
                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{DICT.contact.social[l]}</dt>
                  <dd className="mt-3">
                    <a
                      href={SITE.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-numeral text-2xl text-chalk transition-colors duration-300 hover:text-oxide sm:text-3xl"
                    >
                      {SITE.social.instagramHandle}
                    </a>
                  </dd>
                </div>

                <div className="border-b border-hairline py-7">
                  <dt className="t-data text-steel-dim">{DICT.common.openedSince[l]}</dt>
                  <dd className="t-body mt-3 text-chalk">{SITE.opened.label[l]}</dd>
                </div>

                {/* A campanha caduca a 15 de setembro de 2026.
                    ATENÇÃO AO QUE ISTO SIGNIFICA DE VERDADE: `campaignLive()` é
                    avaliado no BUILD, não no browser. Num site estático, a caixa
                    só desaparece no build seguinte a essa data. Se ninguém
                    reconstruir o site, ele fica a promover um pack de verão em
                    novembro. Ou se agenda um rebuild, ou se apaga à mão.
                    Ver `campaignLive()` em content/gym.ts. */}
                {campaignLive() && (
                  <div className="border-b border-hairline py-7">
                    <dt className="t-data text-oxide">{c.campaignTitle[l]}</dt>
                    <dd className="t-body mt-3 text-chalk-dim">
                      {fill(c.campaignBody[l], { dates: CAMPAIGN.dates[l] })}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>
        </div>

        {isStock("visit") && <ProvisionalTag locale={l} position="bottom-right" className="z-3" />}
      </section>

      {/* ------------------------------------------------- CAPÍTULO: 23:00
          O dia fecha e o convite fica: o gesto final da narrativa é o mesmo
          botão de adesão que já existe em Visitar. */}
      {chapter("fecho", c.journey.fecho, {
        id: "fecho",
        children: (
          <div className="mt-10">
            <Button href={`/${l}/contactos#aderir`}>{DICT.nav.join[l]}</Button>
          </div>
        ),
      })}
    </>
  );
}
