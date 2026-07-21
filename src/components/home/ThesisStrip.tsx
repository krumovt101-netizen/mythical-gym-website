import { Section } from "../registry/Section";
import { Eyebrow } from "../registry/Eyebrow";
import { Reveal } from "../motion/Reveal";
import { RevealText } from "../motion/RevealText";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/** A tese: o argumento comercial, sem imagem nenhuma a distrair dele. */
export function ThesisStrip({ locale }: { locale: Locale }) {
  const d = DICT.home;
  return (
    <Section band="base" ruleTop pad="loose">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal effect="fade">
            <Eyebrow>{d.thesisKicker[locale]}</Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={d.thesisTitle[locale]}
            className="t-headline mt-6 text-4xl text-cream sm:text-5xl"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal effect="rise" index={2}>
            <p className="t-lede text-xl leading-relaxed text-cream-dim sm:text-2xl">
              {d.thesisBody[locale]}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
