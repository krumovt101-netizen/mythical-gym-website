import Image from "next/image";
import { Plate } from "./Wordmark";
import { shot, SHOW_STOCK_TAGS } from "@/content/media";
import { DICT, t } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/** Onde assenta a etiqueta de provisório. "off" para as imagens que já são do cliente. */
export type TagPos = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "off";

const TAG_POS: Record<Exclude<TagPos, "off">, string> = {
  "bottom-left": "bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-right": "bottom-3 right-3 sm:bottom-4 sm:right-4",
  "top-left": "top-3 left-3 sm:top-4 sm:left-4",
  "top-right": "top-3 right-3 sm:top-4 sm:right-4",
};

/**
 * A etiqueta que diz, em cima da própria imagem, que a imagem não é do cliente.
 * Chapa opaca e escura, para se ler por cima de qualquer fotografia: mesmo sobre
 * um pixel branco, o branco sobre carbon/85 dá mais de 12:1.
 *
 * Ninguém a liga à mão. Ela sai do interruptor (`stock` em media.ts, `draft` em
 * shop.ts) e desaparece no dia em que o interruptor mudar.
 */
export function ProvisionalTag({
  locale,
  position = "bottom-left",
  className = "",
}: {
  locale: Locale;
  position?: TagPos;
  className?: string;
}) {
  /* SHOW_STOCK_TAGS desliga a etiqueta VISUAL para uma apresentação. Não desliga
     o `alt` honesto nem a trava do build: essas não se negoceiam. */
  if (position === "off" || !SHOW_STOCK_TAGS) return null;
  return (
    <span
      className={`t-data pointer-events-none absolute z-3 inline-flex items-center gap-2 border border-white/25 bg-carbon/85 px-2.5 py-1.5 text-white ${TAG_POS[position]} ${className}`}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-oxide-bright" />
      {t(DICT.common.provisional, locale)}
    </span>
  );
}

/**
 * O FUNDO DOS CABEÇALHOS DAS PÁGINAS INTERIORES.
 *
 * Existe como componente e não como três cópias do mesmo bloco por uma razão
 * prática: o escurecimento por cima da fotografia é o que mantém o título
 * branco legível, e não quero essa calibração espalhada por quatro ficheiros
 * onde alguém a mexe num e esquece os outros.
 *
 * As camadas são duas e têm papéis diferentes. O gradiente de baixo para cima
 * assenta o texto, que vive na parte inferior da banda. A chapa uniforme trata
 * do pior caso, que é uma zona clara da fotografia calhar por trás de uma
 * letra. Se a fotografia for trocada por outra mais clara, é aqui que se mexe.
 *
 * Sem fotografia, entra a grelha do caderno, que era o que estava em todas
 * antes destas imagens existirem.
 */
export function HeaderMedia({ slot, locale }: { slot: string; locale: Locale }) {
  const s = shot(slot);
  return (
    <>
      {s?.src ? (
        <div className="absolute inset-0 z-0">
          <Shot slot={slot} locale={locale} sizes="100vw" className="size-full" tag="off" />
        </div>
      ) : (
        <div className="ruled absolute inset-0 z-0 opacity-25" aria-hidden />
      )}
      {/* Calibrado, não estimado. À primeira estas duas camadas somavam tanto
          que a fotografia ficava indistinguível do fundo: o contraste passava e
          a imagem desaparecia, que é trocar um defeito por outro. Estes valores
          são o mínimo que ainda sustenta o título branco sobre o pior pixel da
          banda. Não subir sem voltar a medir. */}
      <div
        aria-hidden
        className="absolute inset-0 z-1 bg-gradient-to-t from-carbon from-6% via-carbon/70 via-36% to-carbon/8"
      />
      <div aria-hidden className="absolute inset-0 z-1 bg-carbon/8" />
      {/* A etiqueta assenta por cima dos véus, senão desaparecia por baixo deles. */}
      {s?.stock && SHOW_STOCK_TAGS && (
        <ProvisionalTag locale={locale} position="bottom-right" className="z-3" />
      )}
    </>
  );
}

/**
 * Uma imagem do site. Se o ficheiro existir, renderiza a foto. Se não existir,
 * renderiza uma chapa desenhada, que tem de parecer intencional e não partida.
 *
 * As páginas nunca escrevem um <img> nem um src à mão: pedem um slot. Assim, o
 * dia em que as fotos reais chegarem, muda-se o media.ts e mais nada.
 */
export function Shot({
  slot,
  locale,
  className = "",
  sizes = "100vw",
  priority = false,
  /** Escurece a foto, para o texto por cima se ler. */
  scrim = "none",
  /** Canto onde assenta a etiqueta de provisório. Só aparece se a foto for de banco. */
  tag = "bottom-left",
  /** Enquadramento, quando o centro não é o sítio certo. Ver o comentário abaixo. */
  objectPosition,
}: {
  slot: string;
  locale: Locale;
  className?: string;
  sizes?: string;
  priority?: boolean;
  scrim?: "none" | "soft" | "strong" | "left";
  tag?: TagPos;
  objectPosition?: string;
}) {
  const s = shot(slot);

  const SCRIMS = {
    none: "",
    soft: "bg-carbon/25",
    strong: "bg-carbon/55",
    // Para o herói: escurece a esquerda, onde assenta o texto, e deixa a foto
    // respirar à direita.
    left: "bg-gradient-to-r from-carbon/80 via-carbon/40 to-transparent",
  } as const;

  if (!s?.src) {
    return (
      <div
        className={`grain relative grid place-items-center overflow-hidden border border-hairline bg-iron-2 ${className}`}
      >
        <Plate className="opacity-20" size={40} />
      </div>
    );
  }

  // O alt não pode atribuir ao cliente uma fotografia que não é dele. Enquanto
  // for de banco, quem ouve o site ouve o mesmo que quem o vê.
  const alt = s.stock
    ? `${s.alt[locale]}. ${t(DICT.common.provisionalAlt, locale)}`
    : s.alt[locale];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={s.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        /* A faixa com conteúdo (halteres, bancos, o mezanino) vive a meio da
           fotografia. Num herói alto, o object-cover centrado mostra sobretudo
           o teto, que nesta imagem é quase preto, e a foto parece não existir.
           Puxar o enquadramento para 42% traz o ferro para a zona visível. */
        style={{ objectPosition: objectPosition ?? "center" }}
      />
      {scrim !== "none" && (
        <span aria-hidden className={`absolute inset-0 ${SCRIMS[scrim]}`} />
      )}
      {s.stock && <ProvisionalTag locale={locale} position={tag} />}
    </div>
  );
}
