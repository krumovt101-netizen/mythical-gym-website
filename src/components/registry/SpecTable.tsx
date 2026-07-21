/**
 * A ficha técnica do catálogo: termos em mono, valores alinhados, filetes de
 * 1px. É um documento, não um cartão — sem sombras, sem caixas.
 */
export function SpecTable({
  rows,
  onPaper = true,
  className = "",
}: {
  rows: { term: string; value: string; href?: string }[];
  onPaper?: boolean;
  className?: string;
}) {
  const border = onPaper ? "divide-paper-rule border-paper-rule" : "divide-rule border-rule";
  const termTone = onPaper ? "text-ink-dim" : "text-mercury";
  const valueTone = onPaper ? "text-ink" : "text-cream";
  const linkTone = onPaper
    ? "text-brass-deep hover:text-ink"
    : "text-brass hover:text-cream";

  return (
    <dl className={`divide-y border-y ${border} ${className}`}>
      {rows.map((row) => (
        <div
          key={row.term + row.value}
          className="grid grid-cols-[minmax(7rem,auto)_1fr] items-baseline gap-x-8 py-3.5"
        >
          <dt className={`t-data ${termTone}`}>{row.term}</dt>
          <dd className={`t-body text-sm ${valueTone}`}>
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline decoration-1 underline-offset-4 transition-colors ${linkTone}`}
              >
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
