import type { ReactNode } from "react";

/**
 * A estampa dourada dos factos VERIFICADOS. Só recebe factos confirmados
 * (data de abertura, morada, registo): dar-lhe uma frase de marketing é
 * usar o selo da casa para carimbar publicidade.
 */
export function FoilStamp({
  children,
  onPaper = false,
  className = "",
}: {
  children: ReactNode;
  onPaper?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`t-data inline-flex items-center gap-3 border px-4 py-2.5 ${
        onPaper ? "border-paper-rule-strong text-brass-deep" : "border-rule-strong"
      } ${className}`}
    >
      {onPaper ? children : <span className="t-foil">{children}</span>}
    </span>
  );
}
