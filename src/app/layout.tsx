import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { PRELOADER_GATE_SCRIPT } from "@/components/motion/preloader-gate";
import "./globals.css";

/**
 * As três vozes do registo (ver globals.css):
 *
 * FRAUNCES — a voz do catálogo. Serifa variável com eixo ótico (opsz), SOFT
 * (calor de impressão) e WONK (desligado por CSS; os glifos tortos venderiam
 * "quirky"). Só o estilo normal: o itálico dobrava o payload e ainda nenhum
 * momento do desenho o pede. Os nomes dos eixos são case-sensitive.
 *
 * ARCHIVO — a voz da interface, com eixo de largura. É também a letra em que
 * o wordmark do cliente está composto (Wordmark.tsx herda do body): a
 * variável --font-archivo não pode mudar de nome.
 *
 * PLEX MONO — a voz dos dados. Um número é um número, não é marketing.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

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
    <html
      lang="pt"
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Corre antes do paint do conteúdo: data-js + data-pre no <html>. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
