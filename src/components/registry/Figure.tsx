import Image from "next/image";
import { Plate } from "../Wordmark";
import { shot } from "@/content/media";
import { DICT, t } from "@/content/dictionary";
import type { Locale } from "@/content/site";
import { ProvisionalStamp, type StampPos } from "./ProvisionalStamp";

/**
 * Uma imagem do site, pedida por slot (media.ts). Se o ficheiro existir,
 * renderiza a foto; se não, a chapa desenhada com a placa da marca — que tem
 * de parecer intencional, não partida. As páginas nunca escrevem um src à
 * mão: no dia em que as fotos reais chegarem, muda-se o media.ts e mais nada.
 */
export function Figure({
  slot,
  locale,
  className = "",
  sizes = "100vw",
  priority = false,
  /** Escurece a foto, para o texto por cima se ler. */
  scrim = "none",
  /** Canto do carimbo de provisório. Só aparece se a foto for de banco. */
  stamp = "bottom-left",
  objectPosition,
}: {
  slot: string;
  locale: Locale;
  className?: string;
  sizes?: string;
  priority?: boolean;
  scrim?: "none" | "soft" | "strong" | "left" | "bottom";
  stamp?: StampPos;
  objectPosition?: string;
}) {
  const s = shot(slot);

  const SCRIMS = {
    none: "",
    soft: "bg-vault/25",
    strong: "bg-vault/55",
    /* Para heróis com texto à esquerda: escurece onde o texto assenta e
       deixa a foto respirar à direita. */
    left: "bg-gradient-to-r from-vault/85 via-vault/45 to-transparent",
    /* Para legendas em rodapé de imagem. */
    bottom: "bg-gradient-to-t from-vault/85 via-vault/30 to-transparent",
  } as const;

  if (!s?.src) {
    return (
      <div
        className={`grain relative grid place-items-center overflow-hidden border border-rule bg-base-2 ${className}`}
      >
        <Plate className="opacity-20" size={40} />
      </div>
    );
  }

  // O alt não pode atribuir ao cliente uma fotografia que não é dele.
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
        style={{ objectPosition: objectPosition ?? "center" }}
      />
      {scrim !== "none" && <span aria-hidden className={`absolute inset-0 ${SCRIMS[scrim]}`} />}
      {s.stock && <ProvisionalStamp locale={locale} position={stamp} />}
    </div>
  );
}
