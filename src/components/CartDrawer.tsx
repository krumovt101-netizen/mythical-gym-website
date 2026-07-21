"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCart, buildOrderMessage } from "./CartProvider";
import { trapTab } from "./focus";
import { Plate } from "./Wordmark";
import { DICT } from "@/content/dictionary";
import { formatPrice, ORDER } from "@/content/shop";
import { SITE, type Locale } from "@/content/site";

export function CartDrawer({ locale }: { locale: Locale }) {
  const { lines, count, total, setQty, remove, open, setOpen, resolve } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // A gaveta vive no layout e não desmonta ao mudar de rota. Sem isto, o botão
  // Voltar do browser deixava-a aberta por cima da página nova, com o scroll
  // ainda trancado. O menu móvel já fechava; a gaveta não. Dois diálogos que
  // dizem seguir o mesmo contrato têm de o seguir mesmo.
  useEffect(() => setOpen(false), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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
      // Devolve o foco a quem abriu a gaveta (o botão do carrinho no cabeçalho).
      if (opener?.isConnected) opener.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;

  /**
   * NÃO HÁ NÚMERO DE WHATSAPP. O Mythical não publicou telefone nenhum, e o
   * número que estava aqui no esqueleto era de outro ginásio, noutra cidade:
   * teria mandado as encomendas destes clientes para o WhatsApp de terceiros.
   *
   * Enquanto `ORDER.whatsapp` for null, o botão encaminha para o Instagram, que
   * é o canal que existe. Assim que houver número, volta a ser WhatsApp com a
   * mensagem já composta, e nada aqui precisa de ser tocado.
   */
  const orderText = buildOrderMessage(
    lines,
    locale,
    DICT.shop.orderIntro[locale],
    DICT.shop.total[locale],
  );
  const waHref = ORDER.whatsapp
    ? `https://wa.me/${ORDER.whatsapp}?text=${encodeURIComponent(orderText)}`
    : SITE.social.instagram;

  return (
    <div
      className="fixed inset-0 z-100 flex justify-end bg-void/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={DICT.shop.cart[locale]}
        className="flex h-full w-full max-w-md flex-col border-l border-hairline bg-iron"
      >
        <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 className="t-data text-chalk">
            {DICT.shop.cart[locale]}
            {count > 0 && <span className="ml-2 text-oxide">{count}</span>}
          </h2>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            className="t-data text-steel transition-colors hover:text-chalk"
            aria-label={DICT.nav.close[locale]}
          >
            ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <Plate className="opacity-20" size={44} />
            <p className="t-headline text-2xl text-chalk">{DICT.shop.cartEmpty[locale]}</p>
            <p className="t-body text-sm text-steel">{DICT.shop.cartEmptyBody[locale]}</p>
            <Link
              href={`/${locale}/loja`}
              onClick={() => setOpen(false)}
              className="t-data mt-2 border border-hairline px-5 py-3 text-chalk transition-colors hover:border-oxide hover:text-oxide"
            >
              {DICT.shop.backToShop[locale]}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-hairline-soft overflow-y-auto">
              {lines.map((line) => {
                const p = resolve(line);
                if (!p) return null;
                // Duas linhas do mesmo produto em tamanhos diferentes têm de dar
                // botões distinguíveis a quem ouve o ecrã, e não dois "+".
                const item = line.size
                  ? `${p.name[locale]} (${line.size})`
                  : p.name[locale];
                return (
                  <li key={`${line.slug}-${line.size}`} className="flex gap-4 p-6">
                    <div className="relative size-20 shrink-0 overflow-hidden border border-hairline bg-iron-2">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center">
                          <Plate className="opacity-20" size={20} />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="t-headline truncate text-base text-chalk">
                        {p.name[locale]}
                      </p>
                      {line.size && (
                        <p className="t-data mt-1 text-steel-dim">
                          {DICT.shop.size[locale]} {line.size}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-hairline">
                          <button
                            onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                            className="grid size-8 place-items-center text-steel transition-colors hover:text-chalk"
                            aria-label={`${DICT.shop.decrease[locale]}: ${item}`}
                          >
                            −
                          </button>
                          <span className="t-numeral w-7 text-center text-sm text-chalk">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                            className="grid size-8 place-items-center text-steel transition-colors hover:text-chalk"
                            aria-label={`${DICT.shop.increase[locale]}: ${item}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(line.slug, line.size)}
                          className="t-data text-steel-dim transition-colors hover:text-oxide"
                          aria-label={`${DICT.shop.remove[locale]}: ${item}`}
                        >
                          {DICT.shop.remove[locale]}
                        </button>
                      </div>
                    </div>

                    <p className="t-numeral shrink-0 text-sm text-chalk">
                      {formatPrice(p.price * line.qty, locale)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-hairline p-6">
              <div className="mb-5 flex items-baseline justify-between">
                <span className="t-data text-steel">{DICT.shop.total[locale]}</span>
                <span className="t-numeral text-2xl text-chalk">
                  {formatPrice(total, locale)}
                </span>
              </div>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="t-data flex w-full items-center justify-center gap-2 bg-oxide-solid px-6 py-4 text-white transition-colors hover:bg-oxide-dim"
              >
                {DICT.shop.checkout[locale]} →
              </a>
              <p className="t-body mt-4 text-xs leading-relaxed text-steel-dim">
                {DICT.shop.checkoutNote[locale]}
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
