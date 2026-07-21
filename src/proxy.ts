import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/content/site";

/**
 * Toda a gente aterra numa língua. A raiz "/" negoceia pelo Accept-Language e
 * cai no português, que é a língua da casa e a de praticamente toda a gente que
 * treina em Pombal.
 *
 * NOTA PARA REVISÃO: o inglês vem do esqueleto e custa pouco a manter, mas um
 * ginásio de bairro numa zona industrial provavelmente não tem público para
 * ele. Se ninguém o pedir, tirar a rota /en é uma simplificação legítima: são
 * duas linhas em LOCALES e metade da copy deixa de precisar de tradução.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const accept = req.headers.get("accept-language") ?? "";
  const wantsEnglish = /^en\b/i.test(accept.split(",")[0]?.trim() ?? "");
  const locale = wantsEnglish ? "en" : DEFAULT_LOCALE;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
