import type { NextConfig } from "next";

/**
 * Dois modos, um código.
 *
 *  - Por omissão: build normal (Vercel, ou qualquer host com Node). O
 *    src/proxy.ts trata da negociação de língua na raiz.
 *  - STATIC_EXPORT=1: exportação estática para  out/ . Uma pasta de HTML que
 *    corre em qualquer alojamento, sem Node. Aqui não há middleware, portanto
 *    a raiz é resolvida por um index.html de redirecionamento gerado no fim
 *    (ver scripts/export-static.mjs).
 */
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export" as const,
        // Sem servidor não há otimizador de imagem. Quando as fotos reais
        // entrarem, têm de vir já dimensionadas de origem.
        images: { unoptimized: true },
        // Gera pt/index.html em vez de pt.html: é o que o Apache e o Nginx
        // servem sem configuração nenhuma.
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
