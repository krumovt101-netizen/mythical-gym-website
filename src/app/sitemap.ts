import type { MetadataRoute } from "next";
import { LOCALES, SITE } from "@/content/site";
import { PRODUCTS } from "@/content/shop";

/** /pendentes fica de fora de propósito: é a página de entrega ao cliente. */
const ROUTES = ["", "/ginasio", "/loja", "/contactos"];

/** Gerado no build. Necessário para a exportação estática (output: export). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE.url}/${locale}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );

  const products = LOCALES.flatMap((locale) =>
    PRODUCTS.map((p) => ({
      url: `${SITE.url}/${locale}/loja/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...pages, ...products];
}
