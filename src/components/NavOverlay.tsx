"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Wordmark } from "./Wordmark";
import { RefNumber } from "./registry/RefNumber";
import { trapTab } from "./focus";
import { DICT } from "@/content/dictionary";
import { SITE, type Locale } from "@/content/site";

/**
 * O menu móvel como página de índice do registo: entradas numeradas, letra
 * de catálogo, os factos da casa no rodapé.
 *
 * CONTRATO DE DIÁLOGO (o mesmo do CartDrawer, e não se regride nele):
 * tranca o scroll, tranca o foco lá dentro, fecha com Escape, devolve o foco
 * a quem o abriu. Quem o fecha por navegação ou por breakpoint é o Header,
 * que é dono do estado.
 */
export function NavOverlay({
  locale,
  open,
  onClose,
  openerRef,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  openerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const trigger = openerRef.current;
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
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
      (opener?.isConnected ? opener : trigger)?.focus();
    };
  }, [open, onClose, openerRef]);

  if (!open) return null;

  const p = (path: string) => `/${locale}${path}`;
  const other: Locale = locale === "pt" ? "en" : "pt";
  const links = [
    { href: p("/ginasio"), label: DICT.nav.gym[locale] },
    { href: p("/loja"), label: DICT.nav.shop[locale] },
    { href: p("/contactos"), label: DICT.nav.contact[locale] },
  ];

  return (
    <div
      ref={panelRef}
      id="menu-movel"
      role="dialog"
      aria-modal="true"
      aria-label={DICT.nav.menu[locale]}
      className="fixed inset-0 z-50 flex flex-col bg-vault lg:hidden"
    >
      <div className="flex h-20 items-center justify-between border-b border-rule px-5">
        <Wordmark />
        <button
          ref={closeRef}
          onClick={onClose}
          className="grid size-10 place-items-center text-cream"
          aria-label={DICT.nav.close[locale]}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center px-5" aria-label="Principal">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className="rise group flex items-baseline gap-5 border-b border-rule py-6"
            style={{ animationDelay: `${80 + i * 60}ms` }}
          >
            <RefNumber n={i + 1} prefix="" className="text-sm" />
            <span className="t-headline text-4xl text-cream transition-colors group-hover:text-brass-bright">
              {l.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="rise space-y-5 p-5 pb-8" style={{ animationDelay: "260ms" }}>
        <p className="t-data text-mercury">
          {SITE.address.area} · {SITE.address.municipality}
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Link
            href={p("/contactos#aderir")}
            className="t-data bg-brass px-4 py-4 text-center text-vault"
          >
            {DICT.nav.join[locale]}
          </Link>
          <Link href={`/${other}`} hrefLang={other} className="t-data py-2 text-center text-mercury">
            {locale === "pt" ? "English" : "Português"}
          </Link>
        </div>
      </div>
    </div>
  );
}
