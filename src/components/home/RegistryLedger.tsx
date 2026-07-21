import { Section } from "../registry/Section";
import { RefNumber } from "../registry/RefNumber";
import { LedgerRow } from "../registry/LedgerRow";
import { EmptyState } from "../registry/EmptyState";
import { Button } from "../registry/Button";
import { Reveal } from "../motion/Reveal";
import { DICT } from "@/content/dictionary";
import { confirmedMachines, MACHINES } from "@/content/machines";
import type { Locale } from "@/content/site";

/**
 * O livro de registo: as entradas confirmadas em linhas de razão, e a
 * entrada seguinte em fantasma. O vazio é o argumento (escassez), não uma
 * prateleira por encher.
 */
export function RegistryLedger({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const machines = confirmedMachines();

  return (
    <Section band="paper" ruleTop pad="regular">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal effect="rise">
            <h2 className="t-headline text-3xl text-ink sm:text-4xl">{d.ironTitle[locale]}</h2>
            <p className="t-lede mt-6 max-w-md text-lg text-ink-dim">{d.ironBody[locale]}</p>
            <div className="mt-9">
              <Button href={`/${locale}/ginasio#ferro`} variant="paper">
                {d.ironLink[locale]}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal effect="rise" index={2}>
            <div className="border-t border-paper-rule">
              {machines.map((m, i) => (
                <LedgerRow
                  key={m.id}
                  onPaper
                  refCol={<RefNumber n={i + 1} onPaper />}
                  primary={
                    <span className="t-headline text-2xl text-ink sm:text-3xl">
                      {m.maker} {m.name}
                    </span>
                  }
                  detail={m.era[locale]}
                />
              ))}
              <EmptyState nextN={MACHINES.length + 1} line={d.ledgerOpen[locale]} />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
