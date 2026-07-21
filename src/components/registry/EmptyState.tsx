import { RefNumber } from "./RefNumber";

/**
 * O estado vazio DESENHADO. A regra da casa manda esconder secções sem
 * factos; este componente é a alternativa quando o vazio é ele próprio o
 * argumento: a entrada seguinte do registo, em fantasma, à espera. Escassez
 * à vista, não prateleira vazia.
 */
export function EmptyState({
  nextN,
  line,
  onPaper = true,
  className = "",
}: {
  /** O número da PRÓXIMA entrada (fantasma). */
  nextN: number;
  line: string;
  onPaper?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline gap-6 py-6 sm:gap-10 ${className}`}>
      <RefNumber n={nextN} ghost onPaper={onPaper} />
      <p className={`t-lede text-lg ${onPaper ? "text-ink-dim" : "text-mercury"}`}>{line}</p>
    </div>
  );
}
