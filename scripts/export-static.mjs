/**
 * Exportação estática.
 *
 * Corre o build em modo export e depois arruma o que o Next não pode fazer
 * sozinho num site sem servidor:
 *   1. Um index.html na raiz que manda o visitante para /pt/ (o middleware que
 *      normalmente faz isto não existe num site estático).
 *   2. Remove a /pendentes, que é o documento interno e não tem nada que estar
 *      num servidor público.
 */
import { execSync } from "node:child_process";
import { rmSync, writeFileSync, existsSync } from "node:fs";

const OUT = "out";

execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
});

for (const l of ["pt", "en"]) {
  const dir = `${OUT}/${l}/pendentes`;
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`[export] removida a /${l}/pendentes (documento interno)`);
  }
}

writeFileSync(
  `${OUT}/index.html`,
  `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<title>Mythical Gym</title>
<link rel="canonical" href="/pt/">
<meta http-equiv="refresh" content="0; url=/pt/">
<script>
  // Quem chega com o browser em ingles vai para /en/. O resto vai para /pt/,
  // que e a lingua da casa.
  var en = (navigator.language || "pt").toLowerCase().indexOf("en") === 0;
  location.replace(en ? "/en/" : "/pt/");
</script>
</head>
<body>
<p>A redirecionar para <a href="/pt/">Mythical Gym</a>.</p>
</body>
</html>
`,
);
console.log(`[export] index.html de raiz escrito`);
console.log(`\n[export] pronto: ./${OUT}`);
