import type { ReactNode } from "react";

/**
 * Uma linha do livro de registo: referência, entrada, detalhe, valor,
 * separadas por filetes de 1px. É a estrutura do catálogo de leiloeira:
 * dados alinhados, sem cartões, sem sombras.
 */
export function LedgerRow({
  refCol,
  primary,
  detail,
  value,
  onPaper = false,
  className = "",
}: {
  refCol?: ReactNode;
  primary: ReactNode;
  detail?: ReactNode;
  value?: ReactNode;
  onPaper?: boolean;
  className?: string;
}) {
  const border = onPaper ? "border-paper-rule" : "border-rule";
  const detailTone = onPaper ? "text-ink-dim" : "text-mercury";
  return (
    <div
      className={`grid grid-cols-[minmax(4.5rem,auto)_1fr] items-baseline gap-x-6 gap-y-1 border-b ${border} py-5 sm:grid-cols-[minmax(5.5rem,auto)_1fr_auto_auto] sm:gap-x-10 ${className}`}
    >
      <div className="pt-0.5">{refCol}</div>
      <div className="min-w-0">{primary}</div>
      {detail !== undefined && (
        <div className={`t-data col-start-2 sm:col-start-3 ${detailTone}`}>{detail}</div>
      )}
      {value !== undefined && (
        <div className="t-numeral col-start-2 text-right sm:col-start-4">{value}</div>
      )}
    </div>
  );
}
