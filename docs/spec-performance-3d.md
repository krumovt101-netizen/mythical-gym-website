O documento segue. Metodologia de medição: esbuild (bundle, minify, ESM) sobre o `node_modules` desta instalação, `react`/`react-dom` marcados como externos porque já vivem no bundle da app, tamanhos comprimidos com `gzip -9`.

---

# Orçamento de performance e estratégia de degradação: cena 3D no herói

Persona: engenheiro de performance web, WebGL em telemóvel. O veredicto primeiro: **a cena custa ~239 KB gz e ~0,9 MB de parse, portanto nunca pode estar no caminho do LCP; entra depois do `load`, só se a máquina merecer, e o herói atual (grelha + Plate) é o estado por omissão, não um fallback.** O drei fica fora do bundle salvo import por caminho direto.

## 1. Orçamento de bundle (medido, não estimado)

| O que | min | gzip |
|---|---:|---:|
| `three` 0.185.1 inteiro | 729.884 B | **186.623 B** |
| `three` seletivo (cena mínima com `WebGLRenderer`) | 530.994 B | 133.285 B |
| `@react-three/fiber` 9.6.1 marginal (three e react externos) | 161.583 B | **51.990 B** |
| **Chunk real da cena: three + fiber juntos** (react externo) | **893.395 B** | **238.999 B** |
| `@react-three/drei` 10.7.7 barrel inteiro (sem tree-shake) | 1.775.462 B | 561.592 B |
| drei via barrel, 4 componentes típicos (`Float`, `Environment`, `ContactShadows`, `OrbitControls`) | 75.910 B | 25.634 B |
| drei `Float` sozinho, por caminho direto | 848 B | **514 B** |

Três conclusões que mandam no desenho:

1. **O tree-shake do three morre no momento em que o fiber entra.** O fiber faz `import * as THREE` e resolve elementos JSX dinamicamente no reconciler, portanto o bundler não consegue provar o que é morto. O chunk da cena é ~239 KB gz e ~0,9 MB de parse/execução, faças a cena que fizeres. O orçamento realista não é "importa pouco do three"; é "o chunk custa 240 KB gz, ponto, e a única variável é QUANDO e SE ele desce".
2. **O drei não tem `exports` map no `package.json` (verificado), portanto o import por caminho é livre**: `import { Float } from "@react-three/drei/core/Float"` custa 514 B gz em vez de arriscar o barrel. Regra: **proibido importar de `@react-three/drei`** (o barrel); se um helper for mesmo preciso, caminho direto `core/<Nome>`. Na prática, para um volume abstrato, `Float` reimplementa-se em 8 linhas de `useFrame` e o drei fica a zero.
3. `Environment` do drei está **proibido por outra razão além do peso**: traz HDRI com céu, e céu é reflexo azul. O logotipo foi medido a zero azul; a iluminação tem de ser luzes brancas quentes definidas à mão.

**Orçamento fechado:** chunk da cena ≤ 245 KB gz (239 de three+fiber + ~5 de código próprio + ~0,5 de drei se entrar o `Float`). **Zero assets**: sem texturas, sem HDRI, sem GLTF (não existe modelo da máquina real, e a regra dura proíbe um genérico; a geometria é gerada por código, custo 0 B). Memória GPU < 60 MB. Frame < 8 ms de GPU num Android médio.

## 2. Deteção de capacidade

Três desfechos, não dois: `off` (fica o herói tipográfico), `lite` (cena degradada), `full`. Nota de contexto: o tráfego chega do Instagram em telemóvel, portanto **`pointer: coarse` não pode ser critério de exclusão**, é critério de tier. O que exclui é: motion reduzido, Save-Data, rede 2G, ausência de WebGL2 real (com `failIfMajorPerformanceCaveat`, que rejeita render por software tipo SwiftShader, onde a cena "corre" a 4 fps).

```ts
// src/components/hero/capability.ts
// Corre SÓ no browser, depois do load. Devolve o tier da cena do herói.
// "off" não é falha: é o herói tipográfico, que já é o desenho por omissão.
export type HeroTier = "off" | "lite" | "full";

type NavX = Navigator & {
  deviceMemory?: number; // Chrome/Android. Safari não expõe: assume-se médio.
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function heroTier(): HeroTier {
  if (typeof window === "undefined") return "off";

  // O utilizador pediu menos movimento: a cena é movimento. Fim.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const nav = navigator as NavX;
  // Save-Data ligado ou rede 2G: 240 KB de gz para um enfeite é desrespeito.
  if (nav.connection?.saveData) return "off";
  const et = nav.connection?.effectiveType;
  if (et === "slow-2g" || et === "2g") return "off";

  // WebGL2 a sério. failIfMajorPerformanceCaveat rejeita rasterização por
  // software: sem isto, a máquina "tem WebGL2" e a cena corre a passo.
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  if (!gl) return "off";
  gl.getExtension("WEBGL_lose_context")?.loseContext(); // liberta o contexto de teste

  const mem = nav.deviceMemory ?? 4;          // Safari cala-se: assume médio
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // Android de entrada de gama: corre, mas na versão magra.
  if (mem <= 2 || cores <= 3) return "lite";
  // Telemóvel médio em rede fraca: também magra.
  if (coarse && (mem <= 4 || et === "3g")) return "lite";

  return "full";
}
```

## 3. O fallback: já existe e já é o desenho

O herói sem foto usa a grelha `.ruled` a 30% sobre `carbon` com grão, e a `Plate` (o monograma real da casa) a 620 px, latão a 7% de opacidade, meia fora do ecrã à direita. Isso **não é um placeholder, é o símbolo da casa a fazer de imagem**, e é exatamente por isso que a estratégia certa é: o herói atual é o estado por omissão para 100% dos utilizadores, e a cena, quando entra, entra **no mesmo lugar e com a mesma gramática** (volume abstrato em wireframe latão sobre a grelha, assumidamente provisório, nunca uma máquina genérica) com um fade de opacidade por cima da marca de água. Se a cena nunca chegar, ninguém vê um buraco, porque nunca houve buraco. Zero layout shift: o canvas é `absolute inset-0 z-0`, o mesmo plano da marca de água que substitui.

Concretamente em `page.tsx`: o bloco do `else` do herói mantém-se intacto; o `<HeroSceneGate />` monta-se ao lado dentro do mesmo fragmento, e a própria cena esconde a `Plate` estática com um crossfade CSS quando o primeiro frame renderiza (callback `onCreated`), nunca antes.

## 4. Carregamento

Restrição de framework, confirmada nos docs desta instalação (`node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`): **`ssr: false` não é permitido em Server Components**, e `page.tsx` é um. O gate tem de ser um Client Component pequeno; dentro dele, `React.lazy` (ou `next/dynamic` com `ssr:false`, equivalente aqui). Tudo client-side, portanto o export estático continua a funcionar.

Sequência: HTML e texto do herói pintam (o LCP é o `<h1>` tipográfico, e fica intocado) → `window.load` → `requestIdleCallback` → `heroTier()` → só então o `import()` dos 239 KB. No tier `off` **não desce um byte**: o `lazy` só dispara quando o componente renderiza.

```tsx
// src/components/hero/HeroSceneGate.tsx
"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import { heroTier, type HeroTier } from "./capability";

// O import() só dispara se o tier autorizar: tier "off" custa zero bytes.
const HeroScene = lazy(() => import("./HeroScene"));

export function HeroSceneGate() {
  const [tier, setTier] = useState<HeroTier>("off");

  useEffect(() => {
    let alive = true;
    // Nunca competir com o LCP nem com a hidratação: espera pelo load E por
    // um idle. O timeout garante que em páginas que nunca ficam idle a cena
    // ainda chega, mas tarde, que é o lado certo do erro.
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? requestIdleCallback(cb, { timeout: 3000 })
        : window.setTimeout(cb, 1500);
    const start = () => idle(() => alive && setTier(heroTier()));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => { alive = false; };
  }, []);

  if (tier === "off") return null;
  // fallback={null}: enquanto o chunk desce, fica o herói que já lá está.
  return (
    <Suspense fallback={null}>
      <HeroScene lite={tier === "lite"} />
    </Suspense>
  );
}
```

Sem `modulepreload` e sem preload manual do chunk: seria roubar banda ao LCP para um enfeite. O parse dos 0,9 MB acontece no import; fazê-lo pós-idle é o que impede que os ~100 a 300 ms de execução do top-level do three num Android médio contem para o TBT que interessa.

## 5. Runtime

```tsx
<Canvas
  dpr={[1, lite ? 1.25 : 1.75]}
  frameloop="demand"
  flat
  gl={{ antialias: false, alpha: true, stencil: false, depth: true, powerPreference: "low-power" }}
>
```

- **`dpr` cap 1,75 (full) / 1,25 (lite).** Um Android médio tem DPR 2,5 a 3: renderizar nativo é 6 a 9 vezes os fragmentos de DPR 1. O cap a 1,75 é indistinguível num herói escuro com wireframe; é a poupança individual maior de toda a lista.
- **`frameloop="demand"` sempre**, com um ticker externo que chama `invalidate()` a ~30 fps enquanto o herói está no viewport e o separador visível. Isto dá três coisas de uma vez: cap a 30 fps (metade do custo, imperceptível numa deriva lenta), pausa por `IntersectionObserver` quando se faz scroll para o registo do ferro, e pausa por `visibilitychange` quando o separador esconde:

```tsx
// Dentro da cena. Anima só quando alguém pode ver.
const { invalidate } = useThree();
useEffect(() => {
  const el = wrapperRef.current!;
  let visible = false, raf = 0, last = 0;
  const tick = (t: number) => {
    raf = requestAnimationFrame(tick);
    if (t - last < 33 || !visible || document.hidden) return; // ~30 fps
    last = t;
    invalidate();
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(el);
  raf = requestAnimationFrame(tick);
  const onVis = () => { /* o guard document.hidden no tick já trata */ };
  document.addEventListener("visibilitychange", onVis);
  return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
}, [invalidate]);
```

- **Luzes: no máximo duas** (1 `DirectionalLight` + 1 `AmbientLight`), ambas de cor branca quente (`#fff6e8`), nunca frias e **nunca um environment/HDRI**: o logotipo foi medido a 12% de reflexos quentes e zero azul, e qualquer IBL de céu viola isso. Cada luz adicional é custo por fragmento em material standard.
- **Sombras: zero.** `shadowMap` desligado (é o default). Uma sombra é uma passagem de profundidade extra de toda a cena mais 1M+ texels de shadow map; num volume abstrato wireframe não compra nada.
- **`antialias: false`.** Com DPR ≥ 1,25 o serrilhado esconde-se sozinho, e sobre carvão quase preto ainda mais. MSAA em GPU tile-based não é grátis em memória.
- **`flat` (sem tone mapping).** O ACES por omissão do three re-mapearia o latão e o `#d9a441` deixava de ser o `#d9a441` que está verificado no sistema de contraste. Cores sRGB diretas.
- **`powerPreference: "low-power"`**: é decoração, não um jogo; em portáteis evita acordar a GPU discreta.
- **`webglcontextlost`**: listener que desmonta a cena e devolve o herói estático. Em Android com pouca RAM o contexto perde-se a sério; sem isto fica um retângulo preto em cima da marca de água.

## 6. Ordem de corte num telemóvel fraco

Do primeiro corte ao último, e os quatro primeiros são a definição do tier `lite`:

1. **DPR: 1,75 → 1,25 → 1,0.** Maior alavanca, invisível num herói escuro.
2. **Ritmo: 30 fps → só-com-scroll** (`invalidate()` apenas no handler de scroll: o objeto "vive" quando a página mexe e congela quando ela para).
3. **Material: `MeshStandardMaterial` → `MeshBasicMaterial`/`LineBasicMaterial`.** Sem iluminação por fragmento; num wireframe latão sobre carvão, a diferença é pequena e o custo por pixel cai a pique. As luzes saem junto.
4. **Densidade da geometria** (menos subdivisões do volume; a silhueta em bruto até ganha em "assumidamente provisório").
5. **A cena inteira.** O último corte é o tier `off`, e não é uma derrota: é o herói tipográfico com a `Plate`, que foi desenhado para aguentar o ecrã sozinho. É o que a maioria dos visitantes de Instagram em dados móveis deve ver, e o site foi construído a contar com isso.

O que nunca entra, em nenhum tier: pós-processamento (bloom/DoF custam um render target inteiro por passe), sombras, HDRI, texturas, modelos GLTF genéricos de máquinas (regra dura da marca), e o barrel do drei.

---

Ficheiros lidos: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/globals.css`, `src/components/Wordmark.tsx`, `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`. Medições reproduzíveis em `/private/tmp/claude-501/-Users-simaogoncalveslopes-Library-CloudStorage-OneDrive-NovaSBE-Pessoal-AI/d1871aa8-198e-42b4-a9fc-0aa1c0debdc5/scratchpad/measure/entries2.sh`.