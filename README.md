# Mythical Gym

Website do ginásio da Zona Industrial da Formiga, em Pombal. Next.js 16, React 19, Tailwind v4, TypeScript. Bilingue PT/EN.

```bash
npm install
npm run dev            # http://localhost:3000 (redirige para /pt ou /en)
npm run build          # falha de propósito enquanto houver produtos por confirmar na loja
CHECK_CONTENT_ALLOW_DRAFT=1 npm run build   # build de preview, com o catálogo provisório
CHECK_CONTENT_ALLOW_DRAFT=1 STATIC_EXPORT=1 npm run export   # pasta out/, corre em qualquer alojamento
```

---

## A ideia, em duas linhas

Em Pombal já há seis ginásios, e todos vendem a mesma coisa pela mesma ordem: aulas, cardio, mensalidade. O Mythical abriu a 1 de julho de 2026 e é o mais novo de todos, portanto não pode ganhar nesse terreno.

Mas tem uma coisa que nenhum deles pode comprar amanhã: **ferro da era dourada**, que já não se fabrica e hoje só se encontra em segunda mão. O Pulse pode comprar equipamento melhor do que este a qualquer momento. Não pode comprar equipamento mais antigo.

Uma nota de vocabulário que é na verdade uma regra: **o site não diz que este ferro é restaurado**. Chegou a dizer, e saiu. O único facto confirmado é a idade da máquina. Se a casa restaura o que compra, é provável, mas ninguém o verificou, e este site não publica o provável.

O site foi construído a partir daí. Não é uma brochura, é um **registo de inventário público**: cada máquina com marca, modelo e ano de fabrico. Um registo é mais difícil de imitar do que um slogan.

---

## O que este site é, e o que se recusa a ser

O ginásio tem semanas de vida. Não há imprensa, não há diretórios, não há histórico, e não há uma única fotografia utilizável. A tentação óbvia era encher isso com números redondos e fotografia de banco de imagens.

Este site faz o contrário, e é uma decisão, não uma falta:

- **Fotografia provisória em todo o lado, escolhida a dedo.** Estão no ar onze imagens de banco (Unsplash, licença comercial livre), escuras, sem pessoas e com o mínimo possível de marca de terceiros: quase todo o stock de ginásio é health club claro, que venderia a concorrência de Pombal em vez desta casa. Foram filtradas de um lote de 745 candidatos. Cada uma leva a etiqueta "Imagem provisória" no ecrã e no `alt`, e `src/content/media.ts` traz a ordem por que devem ser substituídas.
- **A loja é a exceção, e a razão está medida.** Os cartões de produto ficam com a chapa da marca em vez de fotografia. Não é preguiça: de seis candidatos de vestuário no Unsplash, quatro traziam marcas de terceiros visíveis (uma delas eram os próprios autocolantes do Unsplash). Pôr isso ali seria mostrar roupa de outra gente como sendo a da casa, que é pior do que um lugar vazio. As fotos de produto têm de ser da vossa roupa.
- **Zero números inventados.** A barra de estatísticas da homepage só aparece com três ou mais factos confirmados. Hoje há um, portanto não aparece. Uma barra com um número é uma barra partida, e um "mais de 100 máquinas" escrito por estimativa é uma frase que qualquer visitante desmente em quinze minutos de treino.
- **Zero contactos falsos.** Não há telefone nem email publicados em fonte nenhuma, e o site diz isso em vez de deixar caixas vazias. O canal é o Instagram, e é ele que está ao centro.

Cada uma destas lacunas está listada, com o que é preciso para a resolver, em **`/pt/pendentes`** (visível em `npm run dev`, removida do build de produção de propósito).

---

## Onde se mexe no conteúdo

Tudo em `src/content/`. Nenhuma página precisa de ser tocada.

| Ficheiro | O que lá está |
|---|---|
| `site.ts` | Morada, contactos, redes, data de abertura, horário |
| `machines.ts` | **O registo do ferro.** É o ativo do site |
| `registry.ts` | Os números, cada um com a sua fonte e o seu estado |
| `gym.ts` | Zonas, modalidades, preços, campanha a decorrer |
| `media.ts` | Os lugares de fotografia, e o briefing de cada um |
| `shop.ts` | O catálogo da loja |
| `dictionary.ts` | Toda a copy, PT e EN |

### O registo do ferro é a tarefa que mais rende

Está lá **uma** máquina catalogada: a Cybex Classic Leg Press do início dos anos 90. Tudo o resto que está no pavilhão é real, mas não foi documentado e o site não o inventa.

Uma volta ao pavilhão com o telemóvel, uma foto da placa e uma foto da máquina por cada aparelho, e uma linha em `machines.ts` por cada uma. Vinte máquinas catalogadas fazem uma página a que nenhum ginásio do distrito consegue responder. É o argumento comercial inteiro, e está a uma tarde de distância.

**Cuidado com um erro fácil:** nas pesquisas aparecem associadas ao Mythical as marcas Nautilus, Icarian e Body Masters. Não são da casa: são de um revendedor britânico cujas publicações o Mythical comenta. Não entraram no site, e só entram se estiverem fisicamente no pavilhão.

### A loja

Catálogo com encomenda: o carrinho vive no browser e a encomenda sai por WhatsApp, com pagamento no levantamento. Zero custo mensal, zero burocracia de pagamentos.

**Todos os produtos estão a `draft: true`**, e o `ORDER.whatsapp` está a `null` porque não há número. Enquanto assim for, o carrinho encaminha para o Instagram e `npm run build` recusa-se a compilar para produção.

Se não houver loja para já, a decisão certa é esvaziar `PRODUCTS` e tirar a Loja do menu (`Header.tsx` e `Footer.tsx`). Uma loja vazia é pior do que loja nenhuma.

---

## O sistema visual

Carvão quente e latão. Escuro dominante, com uma banda de papel clara como pontuação, que é onde vive o registo do ferro: um registo é um documento, e um documento lê-se em papel.

O escuro não é preferência estética. Em Pombal, o Pulse, o MoveUP, o Fitness Factory e o Wefit são todos claros, azuis e verdes, com fotografia de gente a sorrir. Um site escuro e quente é a forma mais barata de não ser confundido com eles ao segundo de scroll, e é a luz que o espaço tem de verdade.

Todos os pares de texto e fundo foram verificados a 4,5:1 (WCAG AA) **por cálculo**, não a olho, e os rácios estão anotados linha a linha em `src/app/globals.css`. Dois cuidados que não são óbvios e que se partem com facilidade:

- O texto sobre a chapa de latão é **escuro** (`text-carbon`), nunca branco. Branco sobre latão dá 1,8:1 e é ilegível.
- O hover do botão sólido **clareia** o latão em vez de o escurecer, precisamente porque o texto é escuro.

### O logótipo é o real, mas a fonte é pobre

O monograma metálico que está no site é o logótipo do cliente. O que chegou, porém, foi uma imagem de 446 px com o emblema circular a ocupar menos de metade dela, ou seja, a fotografia de perfil do Instagram e não um ficheiro de marca. Os três ficheiros (`marca.png`, `logo.png`, `badge.png`) foram extraídos dela por recorte e por chave de luminância.

Isto chega para os tamanhos em que o site o usa, até cerca de 60 px de altura. Não chega para grandes formatos nem para impressão. **Pedir o ficheiro vetorial (SVG, AI ou EPS) é a única melhoria que falta na marca**, e é uma linha de email.

No cabeçalho, o monograma é a imagem real e o wordmark é composto no tipo do site, com o mesmo tratamento do original: caixa-alta muito espaçada, e o GYM pequeno entre filetes. A alternativa era rasterizar o texto do logótipo a 10 px de altura, que ficaria ilegível.

Uma nota de sistema: o logótipo é prata com 12 por cento de reflexos quentes e **zero azul**, medido. Isso confirma a base de carvão quente do site, e é por isso que o latão das ações não briga com ele: são dois metais quentes, um para a marca e outro para o gesto.

---

## Uma nota que vale dinheiro

O Pulse, o MoveUP e o Fitness Factory **escondem todos o preço**, e empurram para uma visita ou um formulário.

Isso significa que, neste mercado, **mostrar o preço é um ato de autoridade**: só quem tem medo da comparação é que esconde. Para uma casa nova, sem notoriedade, é também a forma mais barata de tirar atrito à primeira inscrição. É o movimento mais barato e mais potente que está em cima da mesa.

A decisão é vossa. O site está pronto para os dois caminhos (`PRICING` em `src/content/gym.ts`).
