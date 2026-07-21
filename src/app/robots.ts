import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/** Gerado no build. Necessário para a exportação estática (output: export). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/pt/pendentes", "/en/pendentes"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
