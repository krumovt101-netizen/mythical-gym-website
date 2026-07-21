"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { useCart } from "./CartProvider";
import { trapTab } from "./focus";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/**
 * UM só CTA, e é de propósito.
 *
 * O esqueleto de onde isto veio tinha dois, porque servia um ginásio que também
 * organizava uma competição, com dois calendários diferentes. O Mythical vende
 * uma coisa: inscrição. Dois botões a competir teriam diluído o único gesto que
 * interessa nesta fase da casa.
 */
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fechar o menu ao mudar de rota é sincronizar o menu com um sistema externo
  // (o router), não estado derivado: sem isto, o overlay sobrevive à navegação.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [pathname]);

  /**
   * O menu é `lg:hidden`. Se o utilizador o abrir e a largura passar para
   * desktop (rodar um tablet, redimensionar a janela), o painel desaparece por
   * CSS mas o estado continua aberto: o scroll fica trancado, o hamburger já não
   * existe para o voltar a fechar, o ✕ está dentro do painel escondido, e não há
   * overlay onde clicar. A página fica presa, e a única saída é o Escape, que num
   * tablet não existe.
   *
   * Portanto o menu também tem de fechar quando o breakpoint deixa de o suportar,
   * e não só quando alguém carrega no botão.
   */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Menu móvel como diálogo: tranca o scroll, tranca o foco lá dentro, devolve-o
  // a quem o abriu, e fecha com Escape. É o mesmo contrato do CartDrawer.
  useEffect(() => {
    if (!menuOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const trigger = hamburgerRef.current;
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      trapTab(e, panel);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Se o menu fechou por navegação, o elemento que o abriu pode já não estar
      // no documento. Nesse caso o foco volta ao hamburger.
      (opener?.isConnected ? opener : trigger)?.focus();
    };
  }, [menuOpen]);

  const p = (path: string) => `/${locale}${path}`;

  const links = [
    { href: p("/ginasio"), label: DICT.nav.gym[locale] },
    { href: p("/loja"), label: DICT.nav.shop[locale] },
    { href: p("/contactos"), label: DICT.nav.contact[locale] },
  ];

  // Troca de língua mantendo a página. As rotas têm o mesmo slug nas duas
  // línguas, de propósito: um /ginasio e um /gym duplicavam o trabalho e o SEO.
  const other: Locale = locale === "pt" ? "en" : "pt";
  const switchHref = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`;

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  /**
   * A HOMEPAGE ABRE COM UM HERÓI A OCUPAR O ECRÃ TODO, e uma barra opaca por
   * cima dele parte a composição ao meio. Portanto, e SÓ enquanto o herói está
   * no ecrã, o cabeçalho é transparente e escreve-se a branco puro.
   *
   * Nas outras páginas a barra é opaca sobre o carvão da página, e é isso que a
   * mantém legível seja o que for que passe por baixo. A troca é feita pelo
   * scroll, e não por um `useState` a adivinhar.
   */
  const home = pathname === `/${locale}` || pathname === `/${locale}/`;
  const overHero = home && !scrolled;

  return (
    <>
      {/* Fora da homepage (e assim que se faz scroll), a barra é opaca. Enquanto
          esteve transparente em todo o lado, o texto escuro do menu assentava em
          cima do que a página lá tivesse e desaparecia sobre as bandas escuras.
          Aqui, sobre o vídeo, a legibilidade vem do véu do herói, não de uma
          chapa branca. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          overHero
            ? "border-transparent bg-transparent"
            : `bg-void/85 backdrop-blur-md ${scrolled ? "border-hairline" : "border-transparent"}`
        }`}
      >
        <div className="mx-auto flex h-18 max-w-[92rem] items-center gap-6 px-5 sm:px-8">
          <Link href={p("")} aria-label="Mythical Gym" className="shrink-0">
            <Wordmark onDark={overHero} />
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Principal">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`t-data relative py-1 transition-colors duration-200 ${
                  overHero
                    ? active(l.href)
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                    : active(l.href)
                      ? "text-chalk"
                      : "text-steel hover:text-chalk"
                }`}
              >
                {l.label}
                {active(l.href) && (
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full ${
                      overHero ? "bg-oxide-bright" : "bg-oxide"
                    }`}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            <Link
              href={switchHref}
              className={`t-data hidden px-2 py-1 transition-colors sm:block ${
                overHero ? "text-white/80 hover:text-white" : "text-steel-dim hover:text-chalk"
              }`}
              aria-label={locale === "pt" ? "Switch to English" : "Mudar para português"}
              hrefLang={other}
            >
              {DICT.common.langSwitch[locale]}
            </Link>

            <button
              onClick={() => setOpen(true)}
              /* Mesmo peso do hamburger, que vive ao lado. Estava um tom abaixo
                 dele e, lado a lado, lia-se como botão desativado. */
              className={`relative grid size-10 place-items-center transition-colors ${
                overHero ? "text-white/85 hover:text-white" : "text-chalk hover:text-oxide"
              }`}
              aria-label={`${DICT.shop.cart[locale]} (${count})`}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8.5 7V5.5a3.5 3.5 0 1 1 7 0V7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              {count > 0 && (
                <span className="t-numeral absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-oxide-solid text-[0.55rem] text-carbon">
                  {count}
                </span>
              )}
            </button>

            <Link
              href={p("/contactos#aderir")}
              className="t-data hidden bg-oxide-solid px-4 py-2.5 text-carbon transition-colors duration-300 hover:bg-oxide-dim sm:block"
            >
              {DICT.nav.join[locale]}
            </Link>

            <button
              ref={hamburgerRef}
              onClick={() => setMenuOpen(true)}
              className={`grid size-10 place-items-center lg:hidden ${
                overHero ? "text-white" : "text-chalk"
              }`}
              aria-label={DICT.nav.menu[locale]}
              aria-expanded={menuOpen}
              aria-controls="menu-movel"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu móvel */}
      {menuOpen && (
        <div
          ref={panelRef}
          id="menu-movel"
          role="dialog"
          aria-modal="true"
          aria-label={DICT.nav.menu[locale]}
          className="fixed inset-0 z-60 flex flex-col bg-void lg:hidden"
        >
          <div className="flex h-18 items-center justify-between px-5">
            <Wordmark />
            <button
              ref={closeRef}
              onClick={() => setMenuOpen(false)}
              className="t-data grid size-10 place-items-center text-chalk"
              aria-label={DICT.nav.close[locale]}
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-5" aria-label="Principal">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="t-headline rise border-b border-hairline-soft py-5 text-4xl text-chalk"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-1 gap-3 p-5">
            <Link
              href={p("/contactos#aderir")}
              className="t-data bg-oxide-solid px-4 py-4 text-center text-carbon"
            >
              {DICT.nav.join[locale]}
            </Link>
            <Link
              href={switchHref}
              hrefLang={other}
              className="t-data py-2 text-center text-steel"
            >
              {locale === "pt" ? "English" : "Português"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
