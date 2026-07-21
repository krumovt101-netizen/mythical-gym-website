/**
 * O número de referência do registo: "Nº 001". A assinatura tipográfica da
 * casa. Mono, tabular, latão. `ghost` é a versão fantasma das entradas que
 * ainda não existem (o estado vazio desenhado, não escondido).
 */
export function RefNumber({
  n,
  prefix = "Nº",
  ghost = false,
  onPaper = false,
  className = "",
}: {
  n: number | string;
  prefix?: string;
  ghost?: boolean;
  onPaper?: boolean;
  className?: string;
}) {
  const value = typeof n === "number" ? String(n).padStart(3, "0") : n;
  const tone = ghost
    ? onPaper
      ? "text-ink-dim/50"
      : "text-mercury/45"
    : onPaper
      ? "text-brass-deep"
      : "text-brass";
  return (
    <span className={`t-ref inline-flex items-baseline gap-[0.4em] ${tone} ${className}`}>
      <span className="text-[0.72em]">{prefix}</span>
      <span>{value}</span>
    </span>
  );
}
