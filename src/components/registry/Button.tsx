import Link from "next/link";
import type { ReactNode } from "react";

/**
 * O botão da casa. A REGRA DO LATÃO vive aqui, codificada uma vez: o texto
 * sobre a chapa é sempre ESCURO (vault, 8,90:1), e o hover CLAREIA
 * (brass-bright, 11,35:1), nunca escurece. Branco sobre latão dá menos de
 * 2:1 e é ilegível — se parecer estranho, é porque todos os outros sites
 * o fazem mal.
 */
const VARIANTS = {
  brass:
    "bg-brass text-vault hover:bg-brass-bright active:translate-y-px",
  hairline:
    "border border-rule-strong text-cream hover:border-cream active:translate-y-px",
  paper:
    "border border-paper-rule-strong text-ink hover:bg-ink hover:text-paper active:translate-y-px",
  /* O botão PRIMÁRIO da banda clara. Latão cheio sobre papel não serve: o
     limite do botão contra o papel ficava abaixo de 3:1. Tinta cheia resolve. */
  "ink":
    "bg-ink text-paper hover:bg-ink/85 active:translate-y-px",
  ghost: "text-cream hover:text-brass",
} as const;

export function Button({
  href,
  onClick,
  variant = "brass",
  arrow = true,
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
  const base = `t-data group inline-flex items-center justify-center gap-3 px-6 py-3.5 transition-all duration-300 ease-(--ease-reg) ${VARIANTS[variant]} ${className}`;
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
          className="transition-transform duration-300 ease-(--ease-reg) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path d="M2 10L10 2M10 2H3.5M10 2v6.5" stroke="currentColor" strokeWidth="1.4" />
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
