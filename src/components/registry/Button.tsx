import Link from "next/link";
import type { ReactNode } from "react";

/**
 * O botão da casa, na voz do CARIMBO (Archivo expandido, preto) — uma voz
 * própria para a ação, que nunca veste a mesma roupa que um rótulo de dados.
 *
 * A REGRA DO LATÃO vive aqui, codificada uma vez: texto sobre a chapa é
 * sempre ESCURO (vault, 8,90:1) e o hover CLAREIA (brass-bright, 11,35:1),
 * nunca escurece.
 *
 * A seta existe SÓ no primário (`arrow`): quando tudo tem seta, nada tem.
 */
const VARIANTS = {
  brass: "bg-brass text-vault hover:bg-brass-bright active:translate-y-px",
  hairline:
    "border border-rule-strong text-cream hover:border-cream active:translate-y-px",
  paper:
    "border border-paper-rule-strong text-ink hover:bg-ink hover:text-paper active:translate-y-px",
  /* O primário da banda clara: latão cheio sobre papel deixava o limite do
     botão abaixo de 3:1. Tinta cheia resolve. */
  ink: "bg-ink text-paper hover:bg-ink/85 active:translate-y-px",
  ghost: "text-cream hover:text-brass",
} as const;

export function Button({
  href,
  onClick,
  variant = "brass",
  arrow = false,
  className = "",
  children,
  external = false,
}: {
  href?: string;
  onClick?: () => void;
  variant?: keyof typeof VARIANTS;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const base = `t-stamp group inline-flex items-center justify-center gap-3 px-7 py-4 text-[0.72rem] transition-all duration-300 ease-(--ease-reg) ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="transition-transform duration-300 ease-(--ease-reg) group-hover:translate-x-1"
        >
          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base}>
      {inner}
    </button>
  );
}
