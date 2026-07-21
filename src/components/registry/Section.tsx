import type { ReactNode } from "react";

/**
 * A moldura única de todas as bandas do site. É isto que faz as páginas
 * lerem-se como UM documento: a mesma largura de coluna, o mesmo ritmo
 * vertical, as mesmas linhas de separação, em todo o lado.
 *
 * `band` escolhe o papel da banda:
 *   base   carvão da página
 *   vault  o mais fundo: heróis, chapas, cofre
 *   paper  a banda clara do registo. Um registo é um documento,
 *          e um documento lê-se em papel.
 */
export function Section({
  band = "base",
  ruleTop = false,
  pad = "regular",
  id,
  className = "",
  bleed,
  children,
}: {
  band?: "base" | "vault" | "paper";
  ruleTop?: boolean;
  /** loose = bandas de assinatura, regular = tudo o resto, none = herói/composições próprias */
  pad?: "none" | "regular" | "loose";
  id?: string;
  className?: string;
  /** Conteúdo de fundo fora da coluna (imagens full-bleed, véus). */
  bleed?: ReactNode;
  children: ReactNode;
}) {
  const bands = {
    base: "bg-base text-cream",
    vault: "bg-vault text-cream",
    paper: "bg-paper text-ink",
  } as const;
  const rules = {
    base: "border-t border-rule",
    vault: "border-t border-rule",
    paper: "border-t border-paper-rule",
  } as const;
  const pads = {
    none: "",
    regular: "py-24 sm:py-32",
    loose: "py-28 sm:py-44",
  } as const;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bands[band]} ${ruleTop ? rules[band] : ""} ${className}`}
    >
      {bleed}
      <div className={`relative mx-auto max-w-[92rem] px-5 sm:px-8 ${pads[pad]}`}>
        {children}
      </div>
    </section>
  );
}
