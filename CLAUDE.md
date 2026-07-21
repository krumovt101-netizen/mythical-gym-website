@AGENTS.md

# Mythical Gym — Website

Site for Mythical Gym, Zona Industrial da Formiga, Pombal (Portugal). Opened 1 July 2026, the newest of seven gyms in town. The site's entire commercial argument: **golden-era iron that competitors cannot buy tomorrow** — cataloged machine by machine like a public inventory registry. Read `docs/CONCEPT.md` before touching content; it explains every deliberate decision.

## Stack & commands

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript. Bilingual PT (default) / EN via `src/app/[locale]/`.

```bash
npm run dev                                                  # localhost:3000 → /pt
CHECK_CONTENT_ALLOW_DRAFT=1 npm run build                    # preview build
npm run build                                                # PRODUCTION — intentionally fails while shop products are draft
CHECK_CONTENT_ALLOW_DRAFT=1 STATIC_EXPORT=1 npm run export   # static out/
npm run lint
```

**Never "fix" the failing production build** — `scripts/check-content.mjs` is a deliberate gate: it blocks production until shop data (prices, WhatsApp number) is confirmed. Use the `CHECK_CONTENT_ALLOW_DRAFT=1` variant for previews.

## The house rules (non-negotiable, inherited from the original build)

1. **Zero invented facts.** No made-up prices, schedules, phone numbers, counts, or years. Unconfirmed data is `null` in content files; the UI is built to degrade honestly (e.g. stats bar hides itself below 3 confirmed facts; contact channel falls back to Instagram — the only real channel). Everything pending lives on `/pt/pendentes` (dev-only page, stripped from production).
2. **All copy and data live in `src/content/`** — `site.ts`, `machines.ts`, `registry.ts`, `gym.ts`, `media.ts`, `shop.ts`, `dictionary.ts`. Pages never contain hardcoded copy. If you're typing a user-visible string inside a page or component, stop and put it in `dictionary.ts`.
3. **Every user-facing string exists in both PT and EN** (`dictionary.ts`, `Record<Locale, string>`). PT is the voice of the house; EN follows it.
4. **The word "restaurado"/"restored" is banned** for the machines. The only confirmed fact is their age. Never add a machine to `machines.ts` that isn't physically in the pavilion; `confirmed: false` never ships.
5. **Copy voice** (rules at top of `dictionary.ts`): a fact over an adjective, always. No em-dashes, no fitness clichés ("supera-te", "a tua melhor versão"), no streetwear triads. If a sentence could appear on any gym's site, it's wrong.
6. **Provisional imagery is labeled.** Current photos are hand-picked Unsplash placeholders, each tagged "Imagem provisória" on screen and in `alt`. `src/content/media.ts` lists replacement priority. AI-generated imagery gets the same label until the client approves it as final.
7. **Contrast is calculated, not eyeballed.** Every text/background pair is annotated with its WCAG ratio in `src/app/globals.css`. Two easy-to-break rules: text on brass is always dark (`text-carbon` — white on brass is 1.8:1), and the solid button hover *lightens* the brass.

## Design system

Warm charcoal + brass ("dois metais quentes"). Dark is strategy, not taste: every competitor in Pombal is bright/blue/green. The light "paper" band is where the iron registry lives (a registry is a document; documents read on paper). The logo is real client material extracted from a 446px Instagram avatar — fine up to ~60px tall; the vector original is still owed by the client.

Design reference: `reference/ginasio-static/` holds the previous cinematic static build (HUD clock 05:30→23:00, pinned horizontal scroll, 1px-line depth, animated grain). Mine it for motion/atmosphere ideas; its `CONTEUDO_EM_FALTA.md` is also a useful checklist of real-world data still missing.

## Skills

Project skills in `.claude/skills/`:
- `scroll-video-animation` — the full pipeline for scroll-scrubbed video sections (start/end frame → Higgsfield video → frame sequence → canvas scrub). Use it whenever adding cinematic scroll effects.
- `high-end-visual-design`, `design-taste-frontend` — premium design + frontend discipline standards.
- `seedance-loop-prompt` — structured prompt format for generated background/loop videos.

## Verification before claiming done

Dev server renders /pt and /en (all pages) without console errors; `CHECK_CONTENT_ALLOW_DRAFT=1 npm run build` passes; `npm run lint` clean. Motion features must respect `prefers-reduced-motion` and have a mobile fallback.
