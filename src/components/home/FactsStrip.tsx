import { Section } from "../registry/Section";
import { Eyebrow } from "../registry/Eyebrow";
import { Reveal } from "../motion/Reveal";
import { DICT } from "@/content/dictionary";
import { confirmedMachines } from "@/content/machines";
import { SITE, type Locale } from "@/content/site";

/**
 * A faixa dos factos. Substitui a "barra de estatísticas" que todos os sites
 * de ginásio têm e que esta casa não pode ter (um número verificado não faz
 * uma barra). Em vez de números redondos: os três factos que EXISTEM, em
 * estampa dourada. Cada um tem fonte; nenhum foi estimado.
 */
export function FactsStrip({ locale }: { locale: Locale }) {
  const d = DICT.home.facts;
  const m = confirmedMachines()[0];

  const cells: { value: React.ReactNode; label: string }[] = [
    {
      value: <span className="t-foil">{SITE.opened.label[locale]}</span>,
      label: d.opened[locale],
    },
    ...(m
      ? [
          {
            value: <span className="t-foil">{`${m.maker} · ${m.era[locale]}`}</span>,
            label: d.entry[locale],
          },
        ]
      : []),
    {
      value: (
        <a
          href={SITE.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream underline decoration-rule-strong decoration-1 underline-offset-8 transition-colors hover:text-brass"
        >
          {SITE.social.instagramHandle}
        </a>
      ),
      label: d.channel[locale],
    },
  ];

  return (
    <Section band="vault" ruleTop pad="regular">
      <Reveal effect="fade">
        <Eyebrow>{d.kicker[locale]}</Eyebrow>
      </Reveal>
      <Reveal effect="rise" index={1}>
        <div className="mt-12 grid gap-y-12 sm:grid-cols-3 sm:divide-x sm:divide-rule">
          {cells.map((c, i) => (
            <div key={i} className={i === 0 ? "sm:pr-10" : "sm:px-10"}>
              <p className="t-headline text-2xl sm:text-[1.7rem]">{c.value}</p>
              <p className="t-data mt-4 text-mercury">{c.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
