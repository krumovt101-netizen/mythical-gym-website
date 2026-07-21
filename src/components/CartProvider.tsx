"use client";

/**
 * CARRINHO
 * =============================================================================
 * Vive no browser (localStorage). Não há servidor, não há conta, não há
 * checkout: o cliente escolheu catálogo com encomenda. A encomenda sai por
 * WhatsApp com a lista montada, e paga-se no levantamento.
 *
 * Quando quiserem ligar pagamentos, o único passo que muda é o último: este
 * carrinho passa a criar uma sessão Stripe em vez de abrir o WhatsApp. Nada
 * do resto do site precisa de tocar.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, formatPrice, type Product } from "@/content/shop";
import type { Locale } from "@/content/site";

export interface CartLine {
  slug: string;
  size: string | null;
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (slug: string, size: string | null) => void;
  setQty: (slug: string, size: string | null, qty: number) => void;
  remove: (slug: string, size: string | null) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  resolve: (line: CartLine) => Product | undefined;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "mythical.cart.v1";

const same = (a: CartLine, slug: string, size: string | null) =>
  a.slug === slug && a.size === size;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Ler só depois de montar, senão o servidor e o cliente divergem.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Descarta linhas de produtos que já não existem no catálogo.
          // Ler o localStorage só depois de montar é o que evita a divergência
          // entre o HTML do servidor e o do cliente. O padrão está certo.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLines(
            (parsed as CartLine[]).filter(
              (l) => l && typeof l.slug === "string" && PRODUCTS.some((p) => p.slug === l.slug),
            ),
          );
        }
      }
    } catch {
      // localStorage indisponível (modo privado, storage cheio). Segue sem carrinho.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* idem */
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, size: string | null) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => same(l, slug, size));
      if (i === -1) return [...prev, { slug, size, qty: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(next[i].qty + 1, 99) };
      return next;
    });
  }, []);

  const setQty = useCallback((slug: string, size: string | null, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !same(l, slug, size))
        : prev.map((l) => (same(l, slug, size) ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, size: string | null) => {
    setLines((prev) => prev.filter((l) => !same(l, slug, size)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const resolve = useCallback(
    (line: CartLine) => PRODUCTS.find((p) => p.slug === line.slug),
    [],
  );

  const { count, total } = useMemo(() => {
    let c = 0;
    let t = 0;
    for (const l of lines) {
      const p = PRODUCTS.find((x) => x.slug === l.slug);
      if (!p) continue;
      c += l.qty;
      t += p.price * l.qty;
    }
    return { count: c, total: t };
  }, [lines]);

  const value = useMemo(
    () => ({ lines, count, total, add, setQty, remove, clear, open, setOpen, resolve }),
    [lines, count, total, add, setQty, remove, clear, open, resolve],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart tem de estar dentro de <CartProvider>");
  return ctx;
}

/** Monta a mensagem de WhatsApp com a encomenda já escrita. */
export function buildOrderMessage(
  lines: CartLine[],
  locale: Locale,
  intro: string,
  totalLabel: string,
): string {
  const rows = lines.map((l) => {
    const p = PRODUCTS.find((x) => x.slug === l.slug);
    if (!p) return "";
    const size = l.size ? ` (${l.size})` : "";
    return `• ${l.qty}× ${p.name[locale]}${size}: ${formatPrice(p.price * l.qty, locale)}`;
  });
  const total = lines.reduce((sum, l) => {
    const p = PRODUCTS.find((x) => x.slug === l.slug);
    return p ? sum + p.price * l.qty : sum;
  }, 0);
  return [intro, "", ...rows, "", `${totalLabel}: ${formatPrice(total, locale)}`].join("\n");
}
