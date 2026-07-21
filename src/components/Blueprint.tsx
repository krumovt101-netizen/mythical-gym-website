import { confirmedMachines } from "@/content/machines";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/**
 * A FICHA TÉCNICA. O registo tratado como documento de engenharia: campos
 * monoespaçados, filetes de 1px, papel. É o equivalente da casa ao diagrama
 * técnico de um submarino num site de expedição: o argumento apresentado
 * como documento e não como slogan.
 *
 * De propósito NÃO há desenho da máquina: um esquema inventado seria uma
 * mentira desenhada, a mesma razão por que a fotografia do slot
 * cybex-leg-press é um detalhe genérico e não uma prensa.
 */
export default function Blueprint({ locale }: { locale: Locale }) {
  const m = confirmedMachines()[0];
  if (!m) return null;
  const b = DICT.home.blueprint;
  const rows: Array<[string, string]> = [
    [b.maker[locale], m.maker],
    [b.model[locale], m.name],
    [b.era[locale], m.era[locale]],
  ];
  return (
    <section className="relative isolate overflow-hidden border-y border-ink/15 bg-paper py-24 text-ink sm:py-32 grain grain-ink">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <p className="t-data text-ink/60">{b.kicker[locale]} · 001</p>
        <h2 className="t-display mt-6 text-[clamp(2rem,5vw,4.5rem)]">
          {m.maker} {m.name}
        </h2>
        <dl className="mt-12 max-w-2xl divide-y divide-ink/15 border-y border-ink/15">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9rem_1fr] gap-6 py-4 sm:grid-cols-[11rem_1fr]">
              <dt className="t-data text-ink/60">{k}</dt>
              <dd className="t-data">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="t-body mt-8 max-w-[52ch] text-ink/80">{m.blurb[locale]}</p>
      </div>
    </section>
  );
}
