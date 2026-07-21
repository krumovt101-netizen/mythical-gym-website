# Mythical Gym — Website

Site do Mythical Gym, Zona Industrial da Formiga, Pombal. Next.js 16, React 19, Tailwind v4, TypeScript. Bilingue PT/EN.

> Porquê este site é como é — o conceito, as decisões e o que se recusa a fazer — está em **[docs/CONCEPT.md](docs/CONCEPT.md)**. Ler antes de mexer em conteúdo.

## Comandos

```bash
npm install
npm run dev            # http://localhost:3000 (redirige para /pt ou /en)
npm run build          # falha de propósito enquanto houver produtos draft na loja
CHECK_CONTENT_ALLOW_DRAFT=1 npm run build                    # build de preview
CHECK_CONTENT_ALLOW_DRAFT=1 STATIC_EXPORT=1 npm run export   # pasta out/, corre em qualquer alojamento
npm run lint
```

## Estrutura

```
src/app/[locale]/   páginas (home, ginasio, loja, contactos, pendentes*)
src/components/     Header, Footer, carrinho, UI partilhada
src/content/        TODO o conteúdo e copy vive aqui — nunca nas páginas
docs/               conceito, proposta ao cliente, guiões
reference/          build estático anterior (Ginasio) — referência de design, fora do git
archive/            zips originais da entrega — fora do git
.claude/skills/     skills do agente (design, scroll-video-animation, …)
```

*`/pt/pendentes` — lista viva do que falta confirmar; visível só em `npm run dev`, removida do build de produção.

## Onde se mexe no conteúdo

| Ficheiro | O que lá está |
|---|---|
| `src/content/site.ts` | Morada, contactos, redes, data de abertura, horário |
| `src/content/machines.ts` | O registo do ferro — o ativo do site |
| `src/content/registry.ts` | Números, cada um com fonte e estado |
| `src/content/gym.ts` | Zonas, modalidades, preços, campanha |
| `src/content/media.ts` | Slots de fotografia e briefing de cada um |
| `src/content/shop.ts` | Catálogo da loja |
| `src/content/dictionary.ts` | Toda a copy, PT e EN |
