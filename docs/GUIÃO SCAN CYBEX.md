# Guião de digitalização: Cybex Classic Leg Press

**Objetivo:** transformar a prensa real do pavilhão num modelo 3D honesto para o herói do site. Uma tarde de trabalho no armazém, uma hora ao computador. Este guião assume um iPhone e zero experiência de fotogrametria.

**A regra que manda em tudo:** o que for para o site tem de ser a máquina verdadeira. Um scan mau não se publica, tal como não se publica fotografia de banco a fingir que é a casa. O plano B está no fim e é para ser usado sem vergonha.

---

## 1. A app: Scaniverse

**Usa o Scaniverse** (gratuito, da Niantic, App Store). Razões, por ordem de peso:

1. **Exporta GLB diretamente do telemóvel, de graça.** É o formato que o site consome. Zero conversões, zero subscrições.
2. **Processa no próprio telemóvel.** Não depende de upload para a cloud, o que num armazém com má rede importa.
3. **Funciona com e sem LiDAR.** Tem modo de fotogrametria por câmara normal e modo LiDAR quando o sensor existe.

**Porque não os outros dois:**

- **Polycam:** a app é boa, mas o plano gratuito ficou limitado: número de capturas limitado e exportação restrita. Os formatos profissionais estão atrás de uma subscrição na ordem dos 27 USD/mês. Não vale a pena pagar para fazer uma vez o que o Scaniverse faz de graça.
- **Object Capture da Apple:** a captura guiada no telemóvel exige LiDAR (iPhone 12 Pro ou posterior, só modelos Pro) e o resultado nativo é USDZ/OBJ, não GLB, portanto obrigava a um passo de conversão. É tecnologia excelente mas está pensada para programadores, não para uma pessoa num armazém.

**O teu iPhone tem LiDAR?** (Tem, se for um modelo Pro do 12 para cima.) Muda três coisas: a escala do modelo sai correta em metros sem calibração, o tracking segura-se melhor na luz fraca do armazém, e as superfícies pintadas lisas (que dão pouca "textura" à fotogrametria) reconstroem melhor. **Não muda a recomendação:** é o mesmo Scaniverse, que usa o sensor sozinho quando ele existe. Sem LiDAR, o processo é igual, apenas mais sensível à luz e ao número de fotos, portanto cumpre as quotas da secção 2 com folga.

## 2. Condições de captura no armazém

**Luz. O inimigo é o brilho, não a escuridão.**

- Queres luz **difusa, uniforme e parada**. O ideal num armazém é luz de dia indireta: portões abertos, luzes de teto acesas, **nenhum foco direto sobre a máquina**.
- Desliga ou desvia qualquer projetor que crie um brilho concentrado no metal. Um reflexo especular move-se quando tu te moves, e a fotogrametria interpreta isso como geometria que não existe: sai um buraco ou uma bolha no modelo.
- Nada de flash. Nunca. O flash é um reflexo especular preso à câmara.
- Evita a hora em que o sol entra direto pelo portão: sombras duras que se movem entre fotos confundem a reconstrução.

**A máquina:**

- Limpa o pó, mas não a envernizes nem a molhes. Superfície seca e mate é o alvo.
- A máquina **não pode mexer-se** durante a captura. Prende ou tira o carro da prensa do curso, trava as placas de carga, tira almofadas soltas. Se uma parte se mover a meio, essa parte sai duplicada ou desfeita.
- Nada de pessoas nem objetos a passar atrás durante a captura.

**O chão e o fundo:**

- Afasta a máquina da parede se possível: queres passar a **volta completa**, 360 graus, sem interrupção.
- Um chão liso e brilhante é mau para o tracking. Truque barato: espalha cartão canelado ou jornal aberto à volta da base. Dá "textura" visual para a app se orientar e depois corta-se do modelo.
- O fundo não precisa de ser bonito, precisa de ser **estático**. Tudo o que aparecer nas fotos e se mexer estraga.

**O varrimento, passo a passo:**

1. Abre o Scaniverse, novo scan, modo de **mesh/detalhe** (não o modo "splat": queres uma malha exportável, não um efeito visual).
2. Move-te devagar, **passos laterais**, sempre com a máquina inteira ou uma zona dela enquadrada. A app avisa se fores depressa demais.
3. **Três voltas completas a três alturas:**
   - Volta 1, ao nível do peito, telemóvel horizontal apontado ao centro da máquina.
   - Volta 2, acima da cabeça (braços esticados), apontado para baixo, para apanhar os topos: apoios, rails, topo do encosto.
   - Volta 3, agachado, apontado ligeiramente para cima, para apanhar a parte de baixo do trenó, o chassis e os pontos de solda.
4. **Sobreposição:** cada posição deve ver 70 a 80% do que a anterior via. Na prática: passos curtos, sem saltos. Se a app perder o tracking, volta a uma zona já capturada e retoma dali.
5. Depois das voltas, **passagens dedicadas aos detalhes que contam a história**: a placa com marca e modelo, o seletor de carga, as soldas, o desgaste da pintura. Aproxima-te a 30-50 cm, devagar.
6. Conta com **15 a 25 minutos** de captura contínua. Em modo foto puro, o equivalente seriam 200 a 300 fotografias para uma máquina deste tamanho; o Scaniverse gere isso sozinho em vídeo contínuo, tu só tens de cumprir as voltas e a lentidão.
7. Antes de sair do armazém, **processa o scan na app e roda o modelo no ecrã**. Procura buracos, bolhas e zonas derretidas. Se houver, ainda estás ao lado da máquina: repete a captura já. É a diferença entre 10 minutos agora e outra viagem depois.

## 3. O problema do metal cromado

As guias cromadas e qualquer peça polida são o pior caso da fotogrametria: uma superfície espelhada não tem aspeto próprio, reflete o que a rodeia, e a app reconstrói o reflexo em vez da peça. Sai lixo geométrico, sempre.

**A técnica: matar o brilho temporariamente.**

- **Opção profissional:** spray de scanning evanescente (AESUB Blue é a referência; vende-se online, ~30 EUR a lata). Pulveriza uma camada fina e mate que **sublima sozinha em poucas horas** sem deixar resíduo. É o que os serviços de digitalização usam em metal.
- **Opção de supermercado, funciona:** **champô seco** em spray, ou pó de talco aplicado com trincha. Camada fina e uniforme só nas zonas cromadas e polidas. Limpa-se depois com um pano húmido.
- Aplica **imediatamente antes** da captura, porque o champô seco assenta e o AESUB evapora.

**Regra de decisão para não estragar a textura:** o spray torna a superfície mate mas também **esconde a cor real** dessa zona na textura capturada. Nas guias cromadas isso é irrelevante (croma capturado sai sempre mal de qualquer forma; mais vale geometria certa). **Na pintura da máquina, não apliques spray:** a pintura de fábrica com desgaste real é precisamente a textura que dá valor ao modelo. Portanto: spray no cromado e no polido, pintura ao natural.

Se mesmo assim as guias saírem más: aceita. São cilindros. Corrigem-se em 5 minutos no Blender substituindo por cilindros limpos com material metálico, e isso continua a ser honesto, porque o diâmetro e a posição vêm do scan real.

## 4. Exportação e orçamento para a web

O scan em bruto sai com 1 a 3 milhões de triângulos e texturas enormes. Isso mata um Android médio em dados móveis, e o telemóvel é o dispositivo primário deste site. O funil é: **exportar GLB do Scaniverse → otimizar no computador com um comando → verificar o peso.**

**No Scaniverse:** Share/Export → **GLB** (malha com textura embebida). Passa o ficheiro para o computador.

**No computador, um comando** (Node já está instalado, é o mesmo do projeto):

```bash
npx @gltf-transform/cli optimize scan.glb cybex-classic-leg-press.glb \
  --compress meshopt --texture-compress ktx2 --simplify 0.35 --texture-size 2048
```

Ajusta `--simplify` até cumprir o orçamento. **Meshopt em vez de Draco** por uma razão concreta deste projeto: o descodificador meshopt é um módulo JS pequeno que se importa de `three` e entra no bundle, enquanto o caminho por omissão do Draco no drei vai buscar o descodificador a um CDN da Google em runtime, e este site é um export estático que tem de funcionar sozinho.

**Orçamento alvo, e é para levar a sério:**

| Métrica | Alvo | Teto absoluto |
|---|---|---|
| Triângulos finais | 40-80 mil | 100 mil |
| Textura difusa | 2048x2048 em KTX2 | 2048 |
| Mapa de normais | descartar, ou 1024 | 1024 |
| **Ficheiro .glb final** | **1,5-2,5 MB** | **4 MB** |

O teto de 4 MB não é gosto: é o que um Android médio em 4G aguenta descarregar e descomprimir sem o herói parecer partido. E lembra: o 3D é progressive enhancement, o site já funciona sem ele, portanto um modelo acima do teto **não entra**, otimiza-se até caber.

**Verificação final:** abre o GLB otimizado em https://gltf.report ou arrasta-o para o visualizador do gltf-transform. Confirma triângulos, tamanho das texturas e que a máquina não perdeu a silhueta com o simplify.

## 5. Onde entra no projeto

**O ficheiro:** `public/media/models/cybex-classic-leg-press.glb` (a pasta `models/` ainda não existe, cria-a). Tudo o que está em `public/` é copiado tal e qual pelo export estático, portanto o cliente recebe o modelo no zip como recebe as fotos.

**Em `src/content/machines.ts`:** o interface `Machine` hoje não tem campo de modelo, porque não havia modelo. Acrescenta-o ao lado do `shot`, seguindo o mesmo padrão de slot opcional:

```ts
  /** Slot em media.ts, quando houver fotografia. */
  shot?: string;
  /** Caminho em /public para o modelo 3D digitalizado da máquina REAL.
   *  Só entra aqui um scan da peça física do pavilhão. Um modelo genérico
   *  a fazer de conta seria a versão 3D da fotografia de banco, e viola
   *  a regra do registo: nunca. */
  model?: string;
```

E na entrada da Cybex:

```ts
    confirmed: true,
    source: "https://www.instagram.com/mythical.gym/",
    shot: "cybex-leg-press",
    model: "/media/models/cybex-classic-leg-press.glb",
```

A cena do herói lê o campo: se `model` existir, carrega o scan; se for `undefined`, mantém o volume abstrato provisório. Nota para quem ligar o modelo à cena: o ambiente de iluminação tem de ser **neutro ou quente, nunca azul**. O sistema visual mede o logotipo como prata com reflexos quentes e zero azul, e um environment map de céu azularia o metal do scan.

## 6. Plano B: se o scan sair mau

Sair mau é o resultado mais provável à primeira tentativa, e não é fracasso, é fotogrametria. A ordem de resposta:

1. **Diagnostica antes de desistir.** Buracos nos topos = faltou a volta alta. Bolhas no cromado = faltou o spray. Zonas derretidas = luz a mudar ou movimento durante a captura. Cada um destes resolve-se com **uma segunda ida ao armazém**, que custa uma tarde. Vale sempre a pena uma segunda tentativa antes de qualquer alternativa.
2. **Geometria boa, textura má?** Aproveita-a na mesma, mas assumidamente: a cena pode mostrar o scan real em **wireframe ou material bruto de carvão**, sem textura fotográfica. Continua a ser a máquina verdadeira, medida no pavilhão, e a estética de registo técnico até serve a marca melhor que um scan fotorrealista mediano. É a única forma honesta de publicar um scan imperfeito.
3. **Tudo mau?** O site fica como está. O volume abstrato provisório já é assumido como provisório e não mente a ninguém. O que **nunca** se faz é descarregar um modelo genérico de leg press de um repositório 3D e pô-lo no lugar da Cybex: isso destruía a tese do site inteiro, que vive de cada afirmação ser verificável no pavilhão.
4. Regista o estado no próprio código (comentário no slot `model` em `machines.ts`), como já se faz com as imagens de banco, para o próximo a mexer saber que a ausência é uma decisão e não um esquecimento.

---

**Fontes verificadas (julho 2026):** [Scaniverse: formatos de export e modos com/sem LiDAR](https://dev.scaniverse.com/support), [Scaniverse na App Store](https://apps.apple.com/us/app/scaniverse-3d-scanner/id1541433223), [Polycam: limites do plano gratuito e preços](https://www.skyebrowse.com/news/posts/polycam-review), [Polycam: formatos por plano](https://learn.poly.cam/hc/en-us/articles/27756102599572-What-File-Types-Can-Polycam-Export), [Apple Object Capture: requisitos e output](https://developer.apple.com/documentation/RealityKit/scanning-objects-using-object-capture), [Comparativo Polycam vs Scaniverse 2026](https://www.skyebrowse.com/news/posts/polycam-vs-scaniverse).