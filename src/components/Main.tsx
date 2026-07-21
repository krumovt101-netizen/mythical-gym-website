"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/content/site";

/**
 * O <main> do site.
 *
 * Em todas as páginas, o conteúdo começa POR BAIXO do cabeçalho fixo: daí o
 * `pt-18`, que é exatamente a altura da barra.
 *
 * Na homepage, não. Lá o herói é um vídeo a ocupar o ecrã todo, e tem de passar
 * POR TRÁS do cabeçalho, que ali é transparente. Com o `pt-18`, o vídeo começava
 * abaixo da barra e ficava uma faixa branca por cima dele, que é precisamente o
 * que não se quer. O padding é a razão pela qual a barra parecia impossível de
 * tirar: não era o cabeçalho, era o espaço que o main lhe reservava.
 */
export function Main({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const home = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <main id="main" className={home ? "" : "pt-18"}>
      {children}
    </main>
  );
}
