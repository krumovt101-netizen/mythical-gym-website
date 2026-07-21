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
2. Generate via Higgsfield MCP `generate_image` (or nanobanana `gemini_generate_image`), then derive the end frame from the start frame with an edit tool (`gemini_edit_image` / Higgsfield edit) so the pair shares lighting and grade.

Frame rules (house style, see CLAUDE.md):
- Dark, warm, charcoal + brass grade. No third-party logos/marks. No people smiling at camera.
- Start and end frame MUST read as the same shot: same camera height, same palette, same grain. If the pair doesn't match, the video will morph instead of move.
- AI-generated frames are provisional imagery → the section keeps the "Imagem provisória" label until the client signs off.
- **Show the user the frame pair and get approval BEFORE generating video** — video costs credits; frames are cheap to iterate.

### 2. Video (Higgsfield MCP)

- Load schemas first: `ToolSearch "select:mcp__claude_ai_Higgsfield__models_explore,mcp__claude_ai_Higgsfield__generate_video,mcp__claude_ai_Higgsfield__media_upload"` (schemas are deferred; calling without loading fails).
- Ask `models_explore(action:'recommend')` for an image-to-video model that supports **first frame + last frame conditioning**. Do not hardcode a model name — the catalog changes.
- Upload/confirm the two frames as media, then `generate_video` with start-frame + end-frame + prompt.
- Poll `job_status`, then download the result into the scratchpad (never commit the mp4).

Prompt rules for scrub-destined video (these differ from normal video prompts):
- **Monotonic, constant-rate motion.** One continuous camera/subject move, no ease-in-out, no bounce, no cuts, no speed ramps. The user scrubs both directions; anything non-monotonic feels broken in reverse.
- **Stable exposure and lighting.** No flicker, no strobe, no big exposure swings — scrubbing amplifies them.
- **No baked-in text**, no lens shake, no motion blur streaks (blur smears when paused mid-scrub).
- 5s duration is plenty (it becomes ~60–120 frames).
- Structure the prompt with the 7 sections from the `seedance-loop-prompt` skill (SCENE / CAMERA / LIGHTING / …), swapping its loop requirement for: "starts exactly on [start frame], ends exactly on [end frame], single continuous move".

### 3. Explode to frame sequence (ffmpeg)

```bash
mkdir -p public/media/sequences/<name>
# ~12fps from a 5s clip → 60 frames; 1600px wide; webp q80
ffmpeg -i in.mp4 -vf "fps=12,scale=1600:-2" -c:v libwebp -quality 80 \
  public/media/sequences/<name>/frame-%03d.webp
du -sh public/media/sequences/<name>   # BUDGET: ≤5 MB total. Over? Lower quality to 70, width to 1280, or fps to 10.
ls public/media/sequences/<name> | wc -l  # note the count for the component
```

Also export a poster (the end frame): `cp` the last frame to `public/media/sequences/<name>/poster.webp`.

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
