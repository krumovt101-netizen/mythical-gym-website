# "O Dia" Cinematic Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage as a 5-chapter scroll-scrubbed cinematic journey (05:30→23:00 training day) with a fixed HUD clock, per `docs/superpowers/specs/2026-07-21-cinematic-homepage-design.md`.

**Architecture:** Extend the proven `ScrollSequence` canvas-scrub component with lazy loading; generalize sequence content into `media.ts`; add `DayClock` (client) and `Blueprint` (server) components; interleave 4 new video chapters between existing homepage sections. Video pipeline per the `scroll-video-animation` skill (Higgsfield stills → Seedance start/end-frame videos → cwebp frame sequences).

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4 / TypeScript; Higgsfield MCP (cinematic_studio_2_5, seedance_2_0), nanobanana MCP (gemini_edit_image) for still derivations; ffmpeg + cwebp; Playwright for verification.

## Global Constraints

- House rules (CLAUDE.md): all copy in `src/content/dictionary.ts` PT+EN; no invented facts in captions; generated chapters carry "Imagem provisória" (`stock: true`); mechanism chapter never presented as the Cybex; no people in frames; production build gate untouched.
- Budget hard cap: 350 Higgsfield credits total for this feature (estimate ~245: 4 videos × 45 + 1 retry + stills).
- Per-chapter asset budget ≤4 MB; frames 1600px webp q80; `frameCount` in media.ts must equal actual file count.
- Scrub prompts: monotonic constant-rate motion, stable exposure, no cuts/text/people (skill rules).
- Every task ends verified: `npm run lint` clean and `CHECK_CONTENT_ALLOW_DRAFT=1 npm run build` passing before commit.

---

### Task 1: Generalize sequences in media.ts

**Files:**
- Modify: `src/content/media.ts` (replace `HERO_SEQUENCE` block)
- Modify: `src/app/[locale]/page.tsx` (imports + hero usage)

**Interfaces:**
- Produces: `interface SequenceShot { slot: string; base: string; frameCount: number; scrollLength: number; stock: boolean; alt: L }`, `SEQUENCES: SequenceShot[]`, `sequence(slot: string): SequenceShot | undefined`. Slots: `hero`, `luz`, `mecanismo`, `cheio`, `fecho` (all but hero start `frameCount: 0` = disabled).

- [ ] **Step 1: Replace the `HERO_SEQUENCE` export** in `src/content/media.ts` with (keep the existing house comment, retitled for the journey):

```ts
export interface SequenceShot {
  slot: string;
  base: string;
  /** 0 = capítulo desligado: a homepage salta-o por completo. */
  frameCount: number;
  scrollLength: number;
  stock: boolean;
  alt: L;
}

export const SEQUENCES: SequenceShot[] = [
  {
    slot: "hero",
    base: "/media/sequences/hero",
    frameCount: 61,
    scrollLength: 2.5,
    stock: true,
    alt: {
      pt: "Sala de máquinas escura de um pavilhão industrial, árvores de discos e máquinas de carga em primeiro plano, uma luz quente ao fundo",
      en: "A dark machine floor in an industrial hall, plate trees and plate-loaded machines up close, one warm light in the distance",
    },
  },
  {
    slot: "luz",
    base: "/media/sequences/luz",
    frameCount: 0,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "Luz da manhã a atravessar o chão escuro de um pavilhão de treino",
      en: "Morning light crossing the dark floor of a training hall",
    },
  },
  {
    slot: "mecanismo",
    base: "/media/sequences/mecanismo",
    frameCount: 0,
    scrollLength: 3,
    stock: true,
    alt: {
      pt: "Mecanismo de carga antigo em ferro, com discos e alavancas, a separar-se em peças no escuro",
      en: "A vintage iron loading mechanism, plates and levers, coming apart into its pieces in the dark",
    },
  },
  {
    slot: "cheio",
    base: "/media/sequences/cheio",
    frameCount: 0,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "Barra carregada sob luz quente ao fim do dia, pó de magnésio no ar",
      en: "A loaded bar under warm evening light, chalk dust in the air",
    },
  },
  {
    slot: "fecho",
    base: "/media/sequences/fecho",
    frameCount: 0,
    scrollLength: 2,
    stock: true,
    alt: {
      pt: "O pavilhão às escuras, a última luz a apagar-se",
      en: "The hall in darkness, the last light going out",
    },
  },
];

export const sequence = (slot: string): SequenceShot | undefined =>
  SEQUENCES.find((s) => s.slot === slot);
```

- [ ] **Step 2:** In `src/app/[locale]/page.tsx` replace `import { shot, isStock, HERO_SEQUENCE } from "@/content/media";` with `import { shot, isStock, sequence } from "@/content/media";`, add `const heroSeq = sequence("hero")!;` next to `const heroSequence = ...` (which becomes `heroSeq.frameCount > 0`) and replace every `HERO_SEQUENCE.` reference with `heroSeq.`.
- [ ] **Step 3: Verify** — `npm run lint` clean; `CHECK_CONTENT_ALLOW_DRAFT=1 npm run build` passes; `curl -s localhost:3000/pt | grep -c sequences/hero` ≥ 1.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "media: generalize hero sequence into SEQUENCES registry"`

### Task 2: ScrollSequence lazy loading

**Files:**
- Modify: `src/components/ScrollSequence.tsx`
- Modify: `.claude/skills/scroll-video-animation/references/ScrollSequence.tsx` (keep template in sync)

**Interfaces:**
- Produces: prop `lazy?: boolean` (default `false`). When true, frame fetching waits until the section is within one viewport of the screen.

- [ ] **Step 1:** Add `lazy = false` to props. Add a `near` state gate:

```tsx
const [near, setNear] = useState(!lazy);

useEffect(() => {
  if (!lazy || near) return;
  const el = sectionRef.current;
  if (!el) return;
  const io = new IntersectionObserver(
    (entries) => entries.some((e) => e.isIntersecting) && setNear(true),
    { rootMargin: "100% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}, [lazy, near]);
```

Change the loader effect guard from `if (!active) return;` to `if (!active || !near) return;` and add `near` to its dependency array.
- [ ] **Step 2: Verify** — dev server: hero (eager) still scrubs; DevTools-equivalent check via Playwright later (Task 8 covers). Lint + draft build pass.
- [ ] **Step 3: Commit** — `git commit -am "ScrollSequence: lazy frame loading for below-fold chapters"`

### Task 3: Journey captions in dictionary.ts

**Files:**
- Modify: `src/content/dictionary.ts` (inside `DICT.home`)

**Interfaces:**
- Produces: `DICT.home.journey.{luz,mecanismo,cheio,fecho}.{kicker,line}` each `Record<Locale,string>`; `DICT.home.journey.fechoCta` (button label reuses existing `DICT.common`/nav "Inscrever" if present — check first, else add here).

- [ ] **Step 1:** Add to `DICT.home` (house voice: facts/atmosphere, no clichés, no em-dashes, no invented numbers):

```ts
journey: {
  luz: {
    kicker: { pt: "07:00", en: "07:00" },
    line: {
      pt: "A luz chega primeiro que as pessoas. O ferro já cá estava.",
      en: "The light arrives before the people. The iron was already here.",
    },
  },
  mecanismo: {
    kicker: { pt: "O mecanismo", en: "The mechanism" },
    line: {
      pt: "Pivô, alavanca, disco. Construído quando construir era para durar.",
      en: "Pivot, lever, plate. Built when building meant lasting.",
    },
  },
  cheio: {
    kicker: { pt: "18:30", en: "18:30" },
    line: {
      pt: "A hora em que a sala trabalha. Magnésio no ar, ferro no chão.",
      en: "The hour the floor works. Chalk in the air, iron on the ground.",
    },
  },
  fecho: {
    kicker: { pt: "23:00", en: "23:00" },
    line: {
      pt: "A última luz apaga-se. Amanhã o dia recomeça às 05:30.",
      en: "The last light goes out. Tomorrow starts again at 05:30.",
    },
  },
},
```

NOTE: the 05:30/23:00 times are the narrative spine inherited from the concept (same as the clock); they are chrome, not published schedule — the footer/contactos schedule fields remain the source of truth and stay untouched.
- [ ] **Step 2: Verify** lint + draft build (dictionary is typed; a missing locale key fails the build).
- [ ] **Step 3: Commit** — `git commit -am "dictionary: journey chapter captions PT/EN"`

### Task 4: DayClock component

**Files:**
- Create: `src/components/DayClock.tsx`

**Interfaces:**
- Produces: `<DayClock endId="fecho" />` — fixed right-edge clock, 05:30→23:00 mapped from document top to the bottom of `#<endId>` minus one viewport. Hidden `<md`, hidden under reduced motion, `aria-hidden`.

- [ ] **Step 1:** Create the component:

```tsx
"use client";

/**
 * O RELÓGIO DO DIA. O mostrador fixo à direita que percorre 05:30→23:00 com o
 * scroll da homepage: é a barra de progresso da narrativa (o conceito do HUD
 * do build estático, na sua primeira execução real). É cromo narrativo e não
 * um horário publicado: o horário verdadeiro continua a viver em site.ts.
 * Decorativo para leitores de ecrã (aria-hidden), escondido em ecrãs pequenos
 * e com prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";

const START = 5.5 * 60; // 05:30 em minutos
const END = 23 * 60; // 23:00

export default function DayClock({ endId }: { endId: string }) {
  const [minutes, setMinutes] = useState(START);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setVisible(!reduced.matches && window.innerWidth >= 768);
    decide();
    reduced.addEventListener("change", decide);
    window.addEventListener("resize", decide);

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const end = document.getElementById(endId);
        if (!end) return;
        const endBottom = end.getBoundingClientRect().bottom + window.scrollY;
        const total = endBottom - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        setMinutes(Math.round(START + p * (END - START)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      reduced.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
      window.removeEventListener("scroll", onScroll);
    };
  }, [endId]);

  if (!visible) return null;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  const progress = (minutes - START) / (END - START);

  return (
    <div
      aria-hidden
      className="t-data pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 text-oxide md:flex"
    >
      <span className="tracking-widest">{hh}:{mm}</span>
      <span className="relative block h-24 w-px bg-white/15">
        <span
          className="absolute top-0 left-0 w-px bg-oxide"
          style={{ height: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify** styles exist: `t-data`, `text-oxide` are in use elsewhere (they are — grep `t-data` in page.tsx). Lint + draft build.
- [ ] **Step 3: Commit** — `git commit -am "DayClock: fixed 05:30→23:00 scroll clock"`

### Task 5: Blueprint section

**Files:**
- Create: `src/components/Blueprint.tsx`

**Interfaces:**
- Consumes: `confirmedMachines()` from `@/content/machines` (existing; each machine has `name`, `maker`, `era: L`, `blurb: L`, `source?`), `DICT`/`t` from dictionary.
- Produces: `<Blueprint locale={l} />` server component — paper band, registry-document layout, monospace fields with thin callout rules; NO pictorial depiction of the machine.

- [ ] **Step 1:** Create (styling mirrors the existing paper band section classes in `page.tsx` — `bg` utilities `bg-paper`/`grain-ink`/`text-carbon` exist; verify exact tokens by grepping the registry band in page.tsx and reuse them):

```tsx
import { confirmedMachines } from "@/content/machines";
import type { Locale } from "@/content/site";

/**
 * A FICHA TÉCNICA. O registo tratado como documento de engenharia: campos
 * monoespaçados, filetes de 1px, papel. De propósito NÃO há desenho da
 * máquina: um esquema inventado seria uma mentira desenhada (a mesma razão
 * por que a foto do slot cybex-leg-press é um detalhe genérico).
 */
export default function Blueprint({ locale }: { locale: Locale }) {
  const m = confirmedMachines()[0];
  if (!m) return null;
  const rows: Array<[string, string]> = [
    [locale === "pt" ? "Fabricante" : "Maker", m.maker],
    [locale === "pt" ? "Modelo" : "Model", m.name],
    [locale === "pt" ? "Era" : "Era", m.era[locale]],
  ];
  return (
    <section className="grain-ink relative border-y border-carbon/15 bg-paper py-24 text-carbon sm:py-32">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <p className="t-data text-carbon/60">
          {locale === "pt" ? "Ficha do registo" : "Registry sheet"} · 001
        </p>
        <h2 className="t-display mt-6 text-[clamp(2rem,5vw,4.5rem)]">{m.name}</h2>
        <dl className="mt-12 max-w-2xl divide-y divide-carbon/15 border-y border-carbon/15">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[10rem_1fr] gap-6 py-4">
              <dt className="t-data text-carbon/60">{k}</dt>
              <dd className="t-data">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="t-body mt-8 max-w-[52ch] text-carbon/80">{m.blurb[locale]}</p>
      </div>
    </section>
  );
}
```

(Adjust class tokens in Step 1 to the actual paper-band tokens found in page.tsx / globals.css — e.g. if the band uses `bg-bone` or `bg-chalk` instead of `bg-paper`, use that. Field names on `Machine` must be read from `machines.ts` before writing — adapt `maker/name/era/blurb` to the real interface.)
- [ ] **Step 2: Verify** lint + draft build; view /pt — band renders with Cybex data.
- [ ] **Step 3: Commit** — `git commit -am "Blueprint: registry sheet section"`

### Task 6: Homepage journey assembly

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `sequence(slot)`, `DICT.home.journey`, `<DayClock>`, `<Blueprint>`, `<ScrollSequence lazy>`.
- Produces: chapter helper `chapter(slot, kicker, line)` local to the page; final chapter section carries `id="fecho"`; every chapter gated on `frameCount > 0`.

- [ ] **Step 1:** Add imports (`DayClock`, `Blueprint`) and a local helper inside `HomePage` (after `heroText`):

```tsx
const chapter = (
  slot: string,
  cap: { kicker: Record<Locale, string>; line: Record<Locale, string> },
  opts: { id?: string; children?: React.ReactNode } = {},
) => {
  const s = sequence(slot);
  if (!s || s.frameCount === 0) return null;
  return (
    <div id={opts.id}>
      <ScrollSequence
        base={s.base}
        frameCount={s.frameCount}
        scrollLength={s.scrollLength}
        posterAlt={`${s.alt[l]}. ${DICT.common.provisionalAlt[l]}`}
        lazy
        className="isolate bg-carbon"
      >
        <div aria-hidden className="grain absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-1 h-[55%] bg-gradient-to-t from-carbon from-8% via-carbon/60 via-50% to-transparent"
        />
        <div className="flex h-full items-end">
          <div className="relative z-2 mx-auto w-full max-w-[92rem] px-5 pb-16 sm:px-8 sm:pb-24">
            <p className="t-data text-oxide">{cap.kicker[l]}</p>
            <p className="t-display mt-4 max-w-[24ch] text-[clamp(1.75rem,4.5vw,3.5rem)] text-white">
              {cap.line[l]}
            </p>
            {opts.children}
          </div>
        </div>
        {s.stock && <ProvisionalTag locale={l} position="bottom-right" className="z-3" />}
      </ScrollSequence>
    </div>
  );
};
```

- [ ] **Step 2:** Insert into the returned JSX per the spec order: `chapter("luz", DICT.home.journey.luz)` directly after the hero block; `chapter("mecanismo", DICT.home.journey.mecanismo)` after the thesis section, followed by `<Blueprint locale={l} />`; `chapter("cheio", DICT.home.journey.cheio)` before the shop/products section; `chapter("fecho", DICT.home.journey.fecho, { id: "fecho", children: <CTA buttons> })` as the last section before the footer, where CTA children reuse the hero's `<Button href={`/${l}/ginasio`}>` pattern with the existing signup/campaign labels found in the page (grep for the existing final CTA section and reuse its dictionary keys). Render `<DayClock endId="fecho" />` once, before the first section.
- [ ] **Step 3: Verify** — with all chapter frameCounts still 0, the homepage renders IDENTICAL to before (chapters null, DayClock present but journey ends at… `#fecho` missing → DayClock's `onScroll` returns early and clock stays 05:30; acceptable pre-assets). Lint + draft build + /en spot check.
- [ ] **Step 4: Commit** — `git commit -am "homepage: journey assembly (chapters gated on assets)"`

### Task 7: Chapter stills (frame pairs)

**Files:**
- Create (scratchpad only): start/end PNG pairs per chapter.

**Interfaces:**
- Produces: four approved 1920×1080 pairs in scratchpad `chapters/<slot>/{start,end}.png`, each visually verified against its brief (Read the images; iterate stills, never videos).

Briefs (prompts in full):
- [ ] **luz** — generate END with cinematic_studio_2_5 (16:9, 2k): "Very dark industrial warehouse gym interior at dawn, one long hard shaft of low golden morning light entering from a high side door, cutting across a bare dark concrete floor and grazing the steel frames of vintage plate-loaded machines, deep black shadows everywhere else, faint dust in the beam, no people, no logos, no text, editorial film look, subtle grain." Derive START from END via `gemini_edit_image`: "Make the light shaft much shorter and dimmer, as if the sun has barely risen: the beam reaches only one third of the distance across the floor, the rest of the frame falls to near-black. Keep everything else identical."
- [ ] **mecanismo** — generate START (assembled): "Extreme close-up, centered, of a single vintage 1990s plate-loaded gym machine mechanism floating in a pure black void: cast-iron pivot joint, steel lever arms, stacked iron weight plates on a chrome pin, hex bolts, worn black paint with brass rim light from upper right, shallow depth of field, no people, no logos, no text, luxury watchmaking product-photography style, dark, subtle grain." Derive END via cinematic_studio_2_5 with the START as `medias` image reference: "The exact same mechanism in the same black void and same lighting, now as a technical exploded view: every component separated and floating apart radially from the center with even gaps: plates off the pin, lever arms detached, bolts hovering, each part parallel to its original orientation." (2 attempts budgeted across stills+video for this chapter.)
- [ ] **cheio** — generate START: "A loaded barbell resting on the floor of a dark industrial gym in the evening, seen from the side at floor level, warm tungsten light from behind, chalk dust drifting in the air, deep blacks, iron plates with worn edges, no people, no logos, no text, cinematic, film grain." Derive END by center-crop zoom (crop 45% region on the knurling/plate area, per the skill's crop trick → push-in).
- [ ] **fecho** — START = copy of the hero chapter's final frame (`public/media/sequences/hero/frame-061.webp` decoded to PNG, or the original `end-frame-1080.png` in scratchpad). Derive END via `gemini_edit_image`: "Turn the tungsten work light off: the lamp is dark, the hall falls to near-total black, only the faintest cold ambient outline of the machines remains visible. Keep the exact same composition."
- [ ] **Verify:** Read every start/end image; each must obey: dark/charcoal+brass, same scene both frames, no people/logos/text. Iterate the still (≈1–2 cr) until right. Log running credit total; stop and report if projection exceeds 350.

### Task 8: Chapter videos + sequences

**Files:**
- Create: `public/media/sequences/{luz,mecanismo,cheio,fecho}/frame-*.webp` + `poster.webp`
- Modify: `src/content/media.ts` (real frameCounts)

**Interfaces:**
- Consumes: approved pairs from Task 7; Higgsfield media_upload/confirm, generate_video (seedance_2_0, 1080p, std, 5s, generate_audio false, start_image+end_image), job_status; skill's cwebp pipeline.
- Produces: four sequences on disk; media.ts frameCounts = real counts (`ls | grep -c '^frame-'`).

Motion prompts (same 7-section scrub template as the hero; per-chapter CAMERA/MOTION line):
- [ ] **luz:** camera locked static; the light shaft grows steadily across the floor at constant rate from the start state to the end state; nothing else moves but dust motes.
- [ ] **mecanismo:** camera locked static; the mechanism separates into its components at perfectly constant speed, each part travelling in a straight line from assembled position to exploded position; no rotation wobble; parts arrive exactly at the end-frame layout.
- [ ] **cheio:** single continuous slow push-in at constant speed from the start framing to the end framing; chalk dust drifts; nothing else moves.
- [ ] **fecho:** camera locked static; the lamp dims steadily to black at constant rate; no flicker beyond the single continuous dimming.
- [ ] For each: upload pair → generate (decline preset via `declined_preset_id` if intercepted) → poll → download mp4 to scratchpad → spot-check first/mid/last frames vs pair → ffmpeg `fps=12,scale=1600:-2` PNG → cwebp q80 → poster (end frame, q82) → count files → `du -sh` ≤4MB (else re-encode q70) → set real frameCount in `media.ts`.
- [ ] **mecanismo quality gate:** if the deconstruct morphs/teleports (not linear separation), one retry with the FORBIDDEN line extended: "morphing, crossfade, parts changing shape or count". If the retry also fails, ship the better of the two (it's provisional imagery) and note it in the final report.
- [ ] **Verify:** dev server scrubs all four chapters; lint + draft build.
- [ ] **Commit** — `git add -A && git commit -m "journey: four chapter sequences (luz, mecanismo, cheio, fecho)"`

### Task 9: Full verification

**Files:**
- Create (scratchpad): extended Playwright script (pattern of the existing `verify-scroll.mjs`).

- [ ] **Step 1:** Extend the earlier script: for EACH chapter section (locate by canvas index after scrolling it into view): pixel-diff live canvas vs that chapter's frame files at entry/mid/exit scroll positions (diff 0 against exactly one frame; diffs increase with frame distance); assert DayClock text at page top = "05:30", strictly greater at mid-page, "23:00" at `#fecho` end; reduced-motion context: zero canvases, clock absent, posters visible; 390px viewport: same; /en renders the same chapter count; console errors = none.
- [ ] **Step 2:** Run: `node .verify-journey.tmp.mjs` from project root (copy from scratchpad, delete after). Expected: all assertions true.
- [ ] **Step 3:** `npm run lint` (0 problems in src/) and `CHECK_CONTENT_ALLOW_DRAFT=1 npm run build` (compiles).
- [ ] **Step 4: Commit** — `git commit -am "journey: verification pass"` and report credit spend vs cap.

## Self-review notes

- Spec coverage: chapters (T7/T8), clock (T4), blueprint (T5), lazy loading (T2), content registry (T1/T3), assembly (T6), degradation+verification (T9). Fecho start-frame reuse covered in T7. ✓
- Types consistent: `SequenceShot`/`sequence()` (T1) consumed in T6; `lazy` (T2) consumed in T6; `endId="fecho"` (T4) produced by T6's `opts.id`. ✓
- Machine field names in T5 flagged for verification against `machines.ts` before writing (interface partially known: `name`, `maker`, `era: L`, `blurb: L` confirmed from file header read).
