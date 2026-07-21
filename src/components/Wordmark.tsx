import Image from "next/image";

/**
 * A MARCA
 * =============================================================================
 * Este é o logótipo real do Mythical Gym, fornecido pelo cliente: o monograma
 * angular em metal (o M e o Y fundidos num escudo) com o wordmark por baixo.
 *
 * ORIGEM E LIMITE, e isto é importante para quem mexer nisto a seguir. O que
 * recebi foi uma imagem de 446 px, com o emblema circular a ocupar menos de
 * metade dela: é a fotografia de perfil do Instagram, não um ficheiro de marca.
 * Os três ficheiros aqui usados foram extraídos dela por recorte e por
 * chave de luminância (a arte é clara sobre preto, portanto o brilho serve de
 * alfa), e é o melhor que essa fonte permite.
 *
 * ISTO CHEGA para os tamanhos em que o site o usa (até cerca de 60 px de
 * altura). NÃO CHEGA para grandes formatos, impressão, ou uma versão retina de
 * um herói. Pedir ao cliente o ficheiro vetorial (SVG, AI ou EPS) é a única
 * melhoria que falta aqui, e é uma linha de email.
 *
 * OS TRÊS FICHEIROS:
 *   marca.png  monograma sozinho, com transparência. Para fundos ESCUROS.
 *   logo.png   monograma + wordmark, com transparência. Para fundos ESCUROS.
 *   badge.png  o emblema completo com o disco preto. É o único que funciona
 *              sobre a banda de papel, porque o metal claro desaparece em
 *              fundo claro. Serve também de favicon.
 *
 * PORQUE É QUE O CABEÇALHO NÃO USA O logo.png. No lockup original o texto ocupa
 * cerca de um terço da altura: a 44 px de barra, "MYTHICAL" ficaria com 10 px
 * de altura, numa fonte rasterizada de baixa resolução. Aqui o monograma é a
 * imagem real e o wordmark é composto no tipo do site, com o mesmo tratamento
 * do original (caixa-alta, muito espaçado, e o GYM pequeno entre filetes).
 * Fica nítido em qualquer ecrã e é fiel à marca. Quando chegar o vetorial,
 * vale a pena reavaliar.
 */

/** O monograma sozinho. Para fundos escuros. */
export function Plate({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/media/marca.png"
      alt=""
      width={size}
      height={Math.round(size * (570 / 702))}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      style={{ width: size, height: "auto" }}
    />
  );
}

/**
 * O emblema com o disco preto. É o que se usa onde o fundo é claro: sobre o
 * papel, o metal do monograma tem contraste a mais para desaparecer e a menos
 * para se ler, e o disco resolve isso sem inventar uma versão da marca.
 */
export function Badge({ className = "", size = 44 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/media/badge.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * O logótipo completo: o monograma real e o wordmark composto.
 *
 * `onDark` existe por compatibilidade com o cabeçalho, que o passa quando a
 * barra está por cima do herói. Força o texto a branco puro; fora daí, herda o
 * creme da marca.
 */
export function Wordmark({
  className = "",
  compact = false,
  onDark = false,
}: {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
}) {
  const mark = compact ? 26 : 34;
  return (
    <span
      className={`inline-flex items-center gap-3 ${onDark ? "text-white" : "text-chalk"} ${className}`}
    >
      <Plate size={mark} />
      <span className="inline-flex flex-col items-start leading-none">
        <span
          className="font-semibold"
          style={{
            fontSize: compact ? "0.82rem" : "1rem",
            letterSpacing: "0.22em",
            lineHeight: 1,
          }}
        >
          MYTHICAL
        </span>
        {/* O GYM entre filetes, como no logótipo original. */}
        <span
          aria-hidden
          className="mt-1 flex w-full items-center gap-1.5 opacity-70"
          style={{ fontSize: compact ? "0.42rem" : "0.5rem", letterSpacing: "0.34em" }}
        >
          <span className="h-px flex-1 bg-current" />
          GYM
          <span className="h-px flex-1 bg-current" />
        </span>
      </span>
      <span className="sr-only">Mythical Gym, Pombal</span>
    </span>
  );
}
