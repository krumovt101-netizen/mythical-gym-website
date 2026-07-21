# "O Dia" — Cinematic scroll homepage

**Date:** 2026-07-21 · **Status:** approved by user · **Reference:** YouTube m-f56P_L660 ("Claude Fable 5 Built a $10K Website in Minutes" — AURUM & NOIR watch site + ABYSSAL deep-sea site)

## Goal

Rebuild the homepage as a cinematic scroll journey in the style of the reference video's sites, telling **one training day (05:30→23:00)** — the concept from the previous static build — using the scroll-video-animation pipeline (Higgsfield Seedance → frame sequences → canvas scrub). Subpages keep their current layout. Budget cap: **350 Higgsfield credits** (estimate ~305).

## The journey

Scroll order (chapters are pinned scrub sections; content sections are existing homepage sections, kept):

1. **05:30 Abertura** — existing hero dolly-out (already shipped; becomes chapter 1)
2. **07:00 Primeira luz** — NEW chapter: static camera, morning light shaft slowly crawling across the dark iron floor (light progression = monotonic motion, ideal scrub)
3. Thesis section (existing)
4. **~14:00 O mecanismo** — NEW centerpiece: generic golden-era plate-loaded mechanism deconstructing (components separating radially, AURUM & NOIR-style); static camera, parts drift apart monotonically; 2 video attempts budgeted
5. **Blueprint** — NEW content section (no video): paper band, registry-card-as-technical-document for the one confirmed machine (Cybex Classic Leg Press, early '90s) — monospace fields, thin callout lines, NO drawn depiction of the machine
6. Registry band "O registo do ferro" (existing)
7. **18:30 Cheio** — NEW chapter: slow push-in on a loaded barbell under warm tungsten, chalk dust drifting; no people
8. Remaining existing sections (loja teaser, visit/campaign)
9. **23:00 Fecho** — NEW chapter: the wide pavilion (reuses the hero's end frame as START frame for continuity) dimming to near-black as the lamp dies; final CTA rises ("Inscrever", manifest-style)

## The HUD clock

Fixed monospace clock at the right edge (Abyssal's depth counter ≡ the static build's HUD): interpolates 05:30→23:00 from page top to the end of the Fecho chapter. `t-data` styling, brass accent, thin 1px vertical progress line. Client component `DayClock` that reads its own scroll geometry (bounded by the `#fecho` section) — no coupling to ScrollSequence. Hidden below `md` and under `prefers-reduced-motion`. It is narrative chrome, not a factual schedule claim; if the real schedule differs when confirmed, one constant pair changes.

## Honesty constraints (house rules, CLAUDE.md)

- The mechanism chapter is **atmosphere, not the Cybex** — a generic vintage mechanism; the facts live in the Blueprint section text sourced from `machines.ts`. No AI depiction presented as the actual machine (same reasoning as the deliberate generic `cybex-leg-press` photo).
- No people in generated frames. No invented numbers/times in captions — captions live in `dictionary.ts` (PT+EN), house voice.
- Every generated chapter carries the "Imagem provisória" tag; sequences are replaceable by real footage via the same pipeline.
- Production build gate untouched.

## Technical design

- **`ScrollSequence`** gains one prop: `lazy?: boolean` — IntersectionObserver with ~1-viewport rootMargin defers frame fetching until the chapter approaches (hero stays eager). Fallback behavior (poster for reduced-motion/<768px) unchanged per chapter.
- **`DayClock`** — new isolated client leaf, ~60 lines, rAF-throttled scroll listener.
- **`Blueprint`** — new server component, pure HTML/CSS on the paper band, data from `machines.ts`.
- **`media.ts`** — generalize `HERO_SEQUENCE` into a `SEQUENCES` list (slots: `hero`, `luz`, `mecanismo`, `cheio`, `fecho`) with per-slot `base`, `frameCount`, `scrollLength`, `stock`, `alt`; helper `sequence(slot)`. Homepage reads slots; `frameCount: 0` disables a chapter cleanly.
- **`dictionary.ts`** — `DICT.home.journey` entries per chapter: kicker (time label), line (caption), both locales.
- **Assets** — `public/media/sequences/<slot>/frame-NNN.webp` + `poster.webp`, ≤4MB per chapter, cwebp pipeline per the scroll-video-animation skill.
- **Fecho start frame** = hero chapter's end frame (visual continuity, zero extra credits); end frame derived from it by image edit (lamp off, near-black).

## Error handling / degradation

- Any chapter with missing frames: ScrollSequence's nearest-loaded fallback + poster underlay — page never blanks.
- Reduced-motion/mobile: chapters render posters only (already-tested path); DayClock hidden.
- JS disabled: SSR posters + full content sections remain readable.

## Verification

- `npm run lint`; `CHECK_CONTENT_ALLOW_DRAFT=1 npm run build`.
- Playwright: per-chapter canvas pixel-diff against frame files at three scroll positions; DayClock text advances monotonically; reduced-motion and 390px viewports show posters and no clock; zero console errors; /en parity.
- Visual pass of all four generated frame pairs before any video generation (self-verified against the chapter briefs above; budget-gated at 350cr).

## Out of scope

Subpage cinematic treatments; real photography; schedule/price data entry; deploy.
