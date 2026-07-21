import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { DICT } from "@/content/dictionary";
import { SITE, type Locale } from "@/content/site";

export function Footer({ locale }: { locale: Locale }) {
  const p = (path: string) => `/${locale}${path}`;
  const year = 2026; // fixo no build. Um new Date() aqui rebentaria o render estático.

  const cols = [
    {
      title: DICT.nav.gym[locale],
      links: [
        { href: p("/ginasio"), label: DICT.gym.title[locale] },
        /* O registo do ferro deixou de ter página própria e vive agora numa
           secção da página do ginásio. Com uma máquina catalogada, uma página
           inteira era mais moldura do que quadro. */
        { href: p("/ginasio#ferro"), label: DICT.iron.title[locale] },
        { href: p("/ginasio#equipamento"), label: DICT.gym.equipmentTitle[locale] },
        { href: p("/ginasio#chegar"), label: DICT.gym.visitTitle[locale] },
      ],
    },
    {
      title: DICT.nav.shop[locale],
      links: [{ href: p("/loja"), label: DICT.shop.all[locale] }],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-void">
      <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark />
            <address className="t-body mt-6 space-y-1 text-sm not-italic text-steel">
              <p>{SITE.address.street}</p>
              <p>{SITE.address.area}</p>
              {/* O código postal está por confirmar. Escrever "null, Pombal" no
                  rodapé de um site publicado é o género de coisa que ninguém vê
                  em revisão e toda a gente vê no ar. */}
              <p>
                {SITE.address.postal ? `${SITE.address.postal}, ` : ""}
                {SITE.address.municipality}
              </p>
              <p className="pt-1 text-steel-dim">{SITE.address.landmark[locale]}</p>

              {/* Só se houver telefone. Não há, à data. Um `tel:` vazio é um link
                  que marca um número em branco. */}
              {SITE.phone.e164 && (
                <p className="pt-3">
                  <a
                    href={`tel:${SITE.phone.e164}`}
                    className="text-chalk transition-colors hover:text-oxide"
                  >
                    {SITE.phone.display}
                  </a>
                </p>
              )}
            </address>

            <div className="mt-6 flex gap-4">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="t-data text-steel transition-colors hover:text-chalk"
              >
                {SITE.social.instagramHandle}
              </a>
              {SITE.social.facebook && (
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-data text-steel transition-colors hover:text-chalk"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>

          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="t-data text-oxide">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="t-body text-sm text-steel transition-colors hover:text-chalk"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-body max-w-xl text-xs text-steel-dim">
            {DICT.common.footerNote[locale]}
          </p>
          <p className="t-data shrink-0 text-steel-dim">
            © {year} {SITE.name}. {DICT.common.rights[locale]}
          </p>
        </div>
      </div>
    </footer>
  );
}
