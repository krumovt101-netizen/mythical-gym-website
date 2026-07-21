import { Section } from "../registry/Section";
import { Eyebrow } from "../registry/Eyebrow";
import { Figure } from "../registry/Figure";
import { Button } from "../registry/Button";
import { Reveal } from "../motion/Reveal";
import { RevealText } from "../motion/RevealText";
import { DICT, fill } from "@/content/dictionary";
import { campaignLive, CAMPAIGN } from "@/content/gym";
import { SITE, type Locale } from "@/content/site";

/**
 * O fecho: a visita. A morada em linhas de razão, com a referência que vale
 * mais do que o número da porta ("Entre a Sumol e a Cuétara") em destaque.
 * A campanha só aparece enquanto decorre, e sem preço: o preço não está
 * publicado, e o site manda perguntar, que é o que a própria casa faz.
 */
export function VisitBand({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address.mapsQuery)}`;

  return (
    <Section band="base" ruleTop pad="loose">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal effect="fade">
            <Eyebrow>{d.visitTitle[locale]}</Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={d.spaceTitle[locale]}
            className="t-display mt-7 max-w-[14ch] text-[clamp(2.6rem,5.5vw,4.75rem)] text-cream"
          />
          <Reveal effect="rise" index={3}>
            <p className="t-lede mt-8 max-w-xl text-xl text-cream-dim">{d.spaceBody[locale]}</p>

            <div className="mt-10 max-w-xl divide-y divide-rule border-y border-rule">
              <p className="t-body py-3.5 text-sm text-mercury">{SITE.address.street}</p>
              <p className="t-body py-3.5 text-sm text-mercury">
                {SITE.address.area}, {SITE.address.municipality}
              </p>
              <p className="t-headline py-4 text-xl text-brass">
                {SITE.address.landmark[locale]}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/${locale}/contactos#aderir`}>{DICT.nav.join[locale]}</Button>
              <Button href={mapsHref} external variant="hairline">
                {DICT.contact.directions[locale]}
              </Button>
            </div>

            {campaignLive() && (
              <div className="mt-12 max-w-xl border border-rule-strong p-6 sm:p-7">
                <p className="t-data text-brass">{d.campaignTitle[locale]}</p>
                <p className="t-body mt-3 text-sm text-cream-dim">
                  {fill(d.campaignBody[locale], { dates: CAMPAIGN.dates[locale] })}
                </p>
              </div>
            )}
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal effect="rise" index={2} className="h-full">
            <Figure
              slot="visit"
              locale={locale}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] h-full min-h-72 w-full"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
