import { Section } from "../registry/Section";
import { Reveal } from "../motion/Reveal";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/**
 * A tese como movimento tipográfico: a frase inteira atravessa as doze
 * colunas em display fino, com o ano — o facto — em latão. O corpo entra
 * depois, deslocado para a direita. Sem eyebrow, sem botão: uma secção
 * pode ser só uma frase bem dita.
 */
export function ThesisStrip({ locale }: { locale: Locale }) {
  const d = DICT.home;
  const title = d.thesisTitle[locale];
  const [before, after] = title.split("1991");

  return (
    <Section band="base" ruleTop pad="loose">
      <Reveal effect="rise">
        <h2 className="t-display max-w-[22ch] text-[clamp(2.5rem,6.5vw,6.5rem)] text-cream">
          {before}
          <span className="text-brass">1991</span>
          {after}
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-6">
          <Reveal effect="rise" index={1}>
            <p className="t-lede text-xl leading-relaxed text-cream-dim sm:text-2xl">
              {d.thesisBody[locale]}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
