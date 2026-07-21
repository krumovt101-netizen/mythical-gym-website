import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { FoilStamp } from "./registry/FoilStamp";
import { DICT } from "@/content/dictionary";
import { SITE, type Locale } from "@/content/site";

/**
 * O colofão do registo: a morada como assento de livro, as colunas do
 * índice, e a estampa dourada do único facto que a casa carimba — a data
 * de abertura. O ano do © é fixo no build: um new Date() aqui rebentaria
 * o render estático.
 */
export function Footer({ locale }: { locale: Locale }) {
  const p = (path: string) => `/${locale}${path}`;
  const year = 2026;

  const cols = [
    {
      title: DICT.nav.gym[locale],
      links: [
        { href: p("/ginasio"), label: DICT.gym.title[locale] },
        { href: p("/ginasio#ferro"), label: DICT.iron.title[locale] },
        { href: p("/ginasio#equipamento"), label: DICT.gym.equipmentTitle[locale] },
        { href: p("/ginasio#chegar"), label: DICT.gym.visitTitle[locale] },
      ],
    },
    {
      title: DICT.nav.shop[locale],
      links: [{ href: p("/loja"), label: DICT.shop.all[locale] }],
    },
    {
      title: DICT.nav.contact[locale],
      links: [
        { href: p("/contactos"), label: DICT.contact.title[locale] },
        { href: p("/contactos#aderir"), label: DICT.nav.join[locale] },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-rule bg-vault">
      <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark />
            <address className="mt-8 not-italic">
              <div className="max-w-sm divide-y divide-rule border-y border-rule">
                <p className="t-body py-3 text-sm text-mercury">{SITE.address.street}</p>
                <p className="t-body py-3 text-sm text-mercury">
                  {SITE.address.area}
                  {SITE.address.postal ? `, ${SITE.address.postal}` : ""},{" "}
                  {SITE.address.municipality}
                </p>
                <p className="t-body py-3 text-sm text-cream-dim">
                  {SITE.address.landmark[locale]}
                </p>
                {/* Só se houver telefone. Não há, à data: um tel: vazio é um
                    link que marca um número em branco. */}
                {SITE.phone.e164 && (
                  <p className="t-body py-3 text-sm">
                    <a href={`tel:${SITE.phone.e164}`} className="text-cream hover:text-brass">
                      {SITE.phone.display}
                    </a>
                  </p>
                )}
                <p className="py-3">
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-data text-cream transition-colors hover:text-brass"
                  >
                    {SITE.social.instagramHandle}
                  </a>
                </p>
              </div>
            </address>
          </div>

          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="t-data text-brass">{col.title}</h2>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="t-body text-sm text-mercury transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 border-t border-rule pt-8">
          <FoilStamp>
            {DICT.common.openedSince[locale]} {SITE.opened.label[locale]}
          </FoilStamp>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-body max-w-xl text-xs text-mercury/80">
              {DICT.common.footerNote[locale]}
            </p>
            <p className="t-data shrink-0 text-mercury/80">
              © {year} {SITE.name}. {DICT.common.rights[locale]}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
