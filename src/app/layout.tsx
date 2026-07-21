import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * Archivo: grotesca americana, robusta, com eixo de largura.
 * Deliberadamente NÃO é a Montserrat/Anton/Bebas em 900 caixa-alta que todo o
 * vertical do fitness usa. Aqui corre no lado CONDENSADO do eixo (ver .t-display
 * em globals.css), que é a letra de placa estampada e de catálogo de máquinas.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** A voz dos dados. Um número é um número, não é marketing. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  /* Domínio por confirmar. Ver SITE.url em src/content/site.ts: é a mesma
     decisão, e muda-se nos dois sítios ao mesmo tempo. */
  metadataBase: new URL("https://www.mythicalgym.pt"),
  title: {
    default: "Mythical Gym, Pombal",
    template: "%s · Mythical Gym",
  },
  description:
    "Ginásio na Zona Industrial da Formiga, em Pombal, com equipamento catalogado por marca e ano de fabrico. Aberto desde 1 de julho de 2026.",
  openGraph: {
    type: "website",
    siteName: "Mythical Gym",
    locale: "pt_PT",
    alternateLocale: "en_GB",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
