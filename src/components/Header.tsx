"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { NavOverlay } from "./NavOverlay";
import { useCart } from "./CartProvider";
import { DICT } from "@/content/dictionary";
import type { Locale } from "@/content/site";

/**
 * A barra do registo. UM só CTA, de propósito: o Mythical vende uma coisa,
 * inscrição. As entradas do menu são numeradas como o índice de um catálogo.
 *
 * No topo da página a barra é transparente (todas as páginas novas abrem
 * sobre uma banda escura); ao primeiro scroll ganha chapa e filete. Uma
 * regra só, sem casos especiais por rota: menos estados, menos maneiras de
 * partir.
 */
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fechar o menu ao mudar de rota: sincronizar com um sistema externo (o
  // router), não estado derivado. Sem isto o overlay sobrevive à navegação.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [pathname]);

  /**
   * O menu é `lg:hidden`. Se estiver aberto e a largura passar a desktop
   * (rodar um tablet), o painel desaparece por CSS mas o estado fica aberto:
   * scroll trancado, sem botão para fechar. Portanto o menu também fecha
   * quando o breakpoint deixa de o suportar. (Bug real do v1; não regredir.)
   */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const p = (path: string) => `/${locale}${path}`;
  const links = [
    { href: p("/ginasio"), label: DICT.nav.gym[locale] },
    { href: p("/loja"), label: DICT.nav.shop[locale] },
    { href: p("/contactos"), label: DICT.nav.contact[locale] },
  ];

  // Troca de língua mantendo a página. As rotas têm o mesmo slug nas duas
  // línguas, de propósito.
  const other: Locale = locale === "pt" ? "en" : "pt";
  const switchHref = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`;
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-500 ${
          scrolled
            ? "border-rule bg-base/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[92rem] items-center gap-6 px-5 sm:px-8">
          <Link href={p("")} aria-label="Mythical Gym" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Principal">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`t-data group relative flex items-baseline gap-2 py-1 transition-colors duration-200 ${
                  active(l.href) ? "text-cream" : "text-mercury hover:text-cream"
                }`}
              >
                <span
                  aria-hidden
                  className={`t-ref text-[0.62rem] transition-colors ${
                    active(l.href) ? "text-brass" : "text-mercury/60 group-hover:text-brass"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
                {active(l.href) && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-brass" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            <Link
              href={switchHref}
              className="t-data hidden px-2 py-1 text-mercury transition-colors hover:text-cream sm:block"
              aria-label={locale === "pt" ? "Switch to English" : "Mudar para português"}
              hrefLang={other}
            >
              {DICT.common.langSwitch[locale]}
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="relative grid size-10 place-items-center text-cream transition-colors hover:text-brass"
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
                <span className="t-numeral absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-brass text-[0.55rem] text-vault">
                  {count}
                </span>
              )}
            </button>

            <Link
              href={p("/contactos#aderir")}
              className="t-data hidden bg-brass px-4 py-2.5 text-vault transition-colors duration-300 hover:bg-brass-bright sm:block"
            >
              {DICT.nav.join[locale]}
            </Link>

            <button
              ref={hamburgerRef}
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center text-cream lg:hidden"
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

      <NavOverlay
        locale={locale}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        openerRef={hamburgerRef}
      />
    </>
  );
}
