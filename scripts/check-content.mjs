/**
 * Trava de segurança do conteúdo.
 *
 * Recusa o build de produção enquanto houver, no site:
 *
 *   1. Produtos por confirmar na loja. A investigação não encontrou UMA
 *      evidência pública de que o Mythical venda merch: o catálogo atual é uma
 *      estrutura provisória, com preços que eu inventei. Pô-los no ar é vender
 *      coisas que talvez não existam, ao preço errado.
 *
 *   2. Fotografia de banco de imagens. São fotos de OUTROS ginásios. Pô-las no
 *      ar é mostrar um espaço que não é o do cliente. Foi exatamente o erro do
 *      Echo Boomer, que escreveu sobre o maior ginásio da Europa e ilustrou o
 *      artigo com stock de um ginásio americano.
 *
 * Isto é uma trava, não um aviso. Para ver o site na mesma (preview, demo),
 * corre com CHECK_CONTENT_ALLOW_DRAFT=1.
 */
import { readFileSync } from "node:fs";

const read = (f) => readFileSync(new URL(`../src/content/${f}`, import.meta.url), "utf8");

/** Conta só dentro do array, para não apanhar as ocorrências dos comentários. */
function countAfter(src, marker, pattern) {
  const i = src.indexOf(marker);
  if (i === -1) return 0;
  return (src.slice(i).match(pattern) ?? []).length;
}

const drafts = countAfter(read("shop.ts"), "export const PRODUCTS", /draft:\s*true/g);
const stock = countAfter(read("media.ts"), "export const SHOTS", /stock:\s*true/g);

const problems = [];
if (drafts > 0) problems.push(`${drafts} produto(s) por confirmar em src/content/shop.ts (draft: true)`);
if (stock > 0) problems.push(`${stock} imagem(ns) de banco de imagens em src/content/media.ts (stock: true)`);

if (problems.length === 0) {
  console.log("[conteudo] catalogo e fotografia confirmados.");
  process.exit(0);
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

if (process.env.CHECK_CONTENT_ALLOW_DRAFT === "1") {
  console.warn(`\n${yellow("[conteudo] a deixar passar (preview):")}`);
  for (const p of problems) console.warn(yellow(`  - ${p}`));
  console.warn(yellow("  Isto NAO pode ir para producao.\n"));
  process.exit(0);
}

console.error(`\n${red("[conteudo] o build de producao esta bloqueado:")}`);
for (const p of problems) console.error(red(`  - ${p}`));
console.error("\nO que fazer:");
if (drafts > 0) {
  console.error("  Loja:  poe o nome, o preco, os tamanhos e a foto reais de cada produto,");
  console.error("         e muda draft para false.");
}
if (stock > 0) {
  console.error("  Fotos: as imagens atuais sao de OUTROS ginasios. Poe as fotos reais em");
  console.error("         public/media/ e muda stock para false. Ver a rota /pt/pendentes.");
}
console.error("\nPara ver o site na mesma (preview, demo):");
console.error("  CHECK_CONTENT_ALLOW_DRAFT=1 npm run build\n");
process.exit(1);
