---
name: scroll-video-animation
description: Use when adding a scroll-driven video or cinematic scrub section to the website - user says "scroll animation", "scrub video on scroll", "animate as you scroll", "Apple-style scroll", "pinned section", "Higgsfield scroll video", or wants a start frame and end frame turned into a scroll-controlled animation. Also use when a generated video plays back choppy or janky when tied to scroll position.
---

# Scroll Video Animation (frames → Higgsfield video → canvas scrub)

## Overview

Turn a **start frame + end frame** into a **scroll-scrubbed cinematic section**: generate the in-between motion as a video (Higgsfield), explode the video into a frame sequence (ffmpeg), and scrub the sequence on a `<canvas>` pinned to the viewport (the Apple AirPods technique). Scroll position = playhead.

**Why not just `video.currentTime` on scroll?** Seeking a compressed video decodes from the nearest keyframe every frame — visible jank, worse on Safari. Canvas + pre-decoded image frames scrubs at 60fps in both directions. The video file is an *intermediate artifact*, not the thing you ship.

## When NOT to use

- Simple reveals/fades/parallax → CSS scroll-driven animations or IntersectionObserver. This skill is for photographic motion.
- Autoplaying ambient background loop (no scroll link) → plain `<video autoplay muted loop>` + `seedance-loop-prompt` skill.
- If the section isn't worth ~2–5 MB of frames, it isn't worth this pipeline.

## Pipeline

### 1. Frames (start + end)

Source options, in order of preference:
1. Real site photography (`public/media/`) — most on-brand.
2. Generate ONE frame and derive the other from it. For a zoom/dolly move, generate the WIDE end frame first, then **crop the start frame out of it** (`ffmpeg -vf "crop=W:H:X:Y,scale=1920:-2"`): the macro literally is a detail of the wide shot, so the interpolated move is geometrically true and cannot morph. A ~2.5x crop from a 2k image still yields a clean 1080p+ start frame. (Editing tools — `gemini_edit_image`, outpaint — are the fallback when a crop can't express the change.)

Dark/graded generations often come back DAYLIGHT-bright on the first try. Front-load the prompt with the light condition ("NIGHT interior, nearly black frame", "90 percent of the frame in shadow", "no windows, no daylight") — style adjectives alone don't hold. Expect ~1 iteration; frames cost ~1 credit each, so iterate at the still stage, never at the video stage.

Frame rules (house style, see CLAUDE.md):
- Dark, warm, charcoal + brass grade. No third-party logos/marks. No people smiling at camera.
- Start and end frame MUST read as the same shot: same camera height, same palette, same grain. If the pair doesn't match, the video will morph instead of move.
- AI-generated frames are provisional imagery → the section keeps the "Imagem provisória" label until the client signs off.
- **Show the user the frame pair and get approval BEFORE generating video** — video costs credits; frames are cheap to iterate.

### 2. Video (Higgsfield MCP)

- Load schemas first: `ToolSearch "select:mcp__claude_ai_Higgsfield__models_explore,mcp__claude_ai_Higgsfield__generate_video,mcp__claude_ai_Higgsfield__media_upload,mcp__claude_ai_Higgsfield__media_confirm,mcp__claude_ai_Higgsfield__job_status"` (schemas are deferred; calling without loading fails).
- Ask `models_explore(action:'recommend')` for an image-to-video model that supports **first frame + last frame conditioning**. Do not hardcode a model name — the catalog changes. (As of 2026-07: Seedance 2.0 declares `start_image` + `end_image` roles; most others are start-only. Pass `generate_audio: false` — a scrub sequence throws the audio away. 1080p std ≈ 45 credits for 5s, 720p ≈ 22.5; preflight with `get_cost: true` and tell the user before submitting.)
- Upload both frames: `media_upload` (batch `files[]`) → curl PUT each `upload_url` → `media_confirm` with both ids.
- `generate_video` with `medias: [{role:"start_image",...},{role:"end_image",...}]` + prompt. **If the response is a `preset_recommendation` notice instead of a job**, the literal generation was intercepted; for scrub work presets break frame conditioning — resubmit with `declined_preset_id` from the notice's `retry_literal_with`.
- Poll `job_status` (`sync:true`, typical ~3–4min but queue variance is real — one of four parallel jobs can take 10+min; extract and verify the finished ones instead of blocking on the straggler). Download the mp4 into the scratchpad (never commit it). Spot-check 3 frames (`select='eq(n,0)+eq(n,60)+eq(n,119)'`) before extracting: first frame ≈ start image, mid frame coherent, last ≈ end image.
- Batching chapters: generate all still pairs first (parallel, cheap), verify them all visually, then submit all videos in one parallel wave — wall-clock is one render, not N.

Prompt rules for scrub-destined video (these differ from normal video prompts):
- **Monotonic, constant-rate motion.** One continuous camera/subject move, no ease-in-out, no bounce, no cuts, no speed ramps. The user scrubs both directions; anything non-monotonic feels broken in reverse.
- **Stable exposure and lighting.** No flicker, no strobe, no big exposure swings — scrubbing amplifies them.
- **No baked-in text**, no lens shake, no motion blur streaks (blur smears when paused mid-scrub).
- 5s duration is plenty (it becomes ~60–120 frames).
- Structure the prompt with the 7 sections from the `seedance-loop-prompt` skill (SCENE / CAMERA / LIGHTING / …), swapping its loop requirement for: "starts exactly on [start frame], ends exactly on [end frame], single continuous move".

### 3. Explode to frame sequence (ffmpeg)

```bash
mkdir -p public/media/sequences/<name>
# Homebrew ffmpeg usually has NO libwebp encoder — go via PNG + cwebp:
ffmpeg -i in.mp4 -vf "fps=12,scale=1600:-2" scratch/png/frame-%03d.png
for f in scratch/png/frame-*.png; do
  cwebp -quiet -q 80 "$f" -o "public/media/sequences/<name>/$(basename "${f%.png}").webp"
done
# poster = the LAST png (end frame), slightly higher quality:
cwebp -q 82 scratch/png/$(ls scratch/png | tail -1) -o public/media/sequences/<name>/poster.webp

ls public/media/sequences/<name> | grep -c '^frame-'  # REAL count — a 5.04s clip at 12fps gives 61, not 60. Never assume fps×duration; the component's frameCount must match the file count exactly.
du -sh public/media/sequences/<name>   # BUDGET: ≤5 MB total (dark graded footage compresses well: 61 × 1600px ≈ 4 MB). Over? quality 70, width 1280, or fps 10.
```

### 4. Scrub component

Use the template at `references/ScrollSequence.tsx` → copy to `src/components/ScrollSequence.tsx` (already there if a previous section used it — reuse, don't duplicate). It is an isolated `"use client"` leaf; pages stay server components.

What the template already handles (don't re-solve): sticky pinning with configurable scroll length, rAF-throttled scroll→frame mapping, progressive preload (first frame immediately, rest in background, nearest-loaded fallback), devicePixelRatio-aware cover drawing, `prefers-reduced-motion` → static poster, small-viewport → static poster, zero CLS (the pin container owns its height), cleanup on unmount.

Integration contract:
```tsx
<ScrollSequence
  base="/media/sequences/hero"   // expects frame-001.webp … frame-NNN.webp + poster.webp
  frameCount={60}
  scrollLength={2.5}             // section height = 2.5 viewport heights of scroll
  posterAlt={t.hero.alt}         // from dictionary.ts, both locales
>
  {/* overlay content — headline, CTA — normal RSC children */}
</ScrollSequence>
```

## Quick reference

| Step | Tool | Output |
|---|---|---|
| Start/end frames | site photos / `generate_image` | 2 approved stills |
| Motion | Higgsfield `generate_video` (first+last frame) | mp4 in scratchpad |
| Sequence | ffmpeg (fps=12, webp) | `public/media/sequences/<name>/` ≤5 MB |
| Scrub | `ScrollSequence.tsx` | pinned canvas section |

## Common mistakes

- **Scrubbing the mp4 directly** (`video.currentTime = …`) → keyframe jank. Ship frames, not the video.
- **Generating video before the user approved the frame pair** → wasted credits.
- **Ease-in-out camera motion in the prompt** → scrub speed feels detached from finger speed.
- **Forgetting the poster fallbacks** → reduced-motion users and phones download 5 MB for nothing, or see a blank section.
- **Committing the mp4 or 100+ PNG frames** → repo bloat; frames are webp, mp4 stays in scratchpad.
- **Hardcoding overlay copy in the component** → all copy lives in `src/content/dictionary.ts` (both locales), per house rules.
- **New scroll library for this** — no GSAP/Lenis/framer-motion needed; the template is dependency-free. Check `package.json` before adding anything.
- **Judging correctness by eyeballing screenshots** — dark graded frames under the text veils are easy to misread (a macro can look like a wide shot). Verify with numbers: in Playwright, `getImageData` the live canvas and pixel-diff it against candidate frame files drawn cover-fit to the same size; diff 0 identifies the exact frame, and diffs must grow monotonically with frame distance. Also assert: canvas present on desktop, absent under `reducedMotion: "reduce"` and at 390px viewport with the poster visible, zero console errors.
