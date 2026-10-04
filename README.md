# 911 GT3 RS — Sculpted by Air

A cinematic, scroll-driven web experience about the 992 GT3 RS. Unofficial personal portfolio project.

**Stack:** React 19 · Vite 8 · three r186 · React Three Fiber 9 · GSAP 3.15 (ScrollTrigger + SplitText) · Motion 14

The full creative and technical direction (concept, Motion Map, Motion Budget, decisions, responsive behavior, accessibility and performance) lives in [`docs/DIRECTION.md`](docs/DIRECTION.md).

## Getting started

```bash
npm install
npm run dev       # development server
npm run build     # production build + HTML pre-render (full content without JS)
npm run preview   # serve the production build
```

## 3D model

- `public/models/GT3RS.glb` is the optimized model: 2.6 MB, down from the 19.3 MB original. It keeps all 374 nodes and 251 meshes — no `join` or `flatten` is applied.
- To regenerate it, copy the original to `public/models/GT3RS.source.glb` and run `npm run optimize:model`.
- Airflow lines are derived from the model's real profile with `npm run airflow` (Python + numpy, reads `GT3RS.source.glb`).
- The hero poster is regenerated with `npm run poster` (requires `npm run preview` running).

## Architecture

```
src/
  motion/        motion.config.js (tokens), tier.js (experience tiers), gsap.js (plugin registration)
  scroll/        director.js (single source of state), choreography.js (the whole film), masterTimeline.js
  three/         Experience, CarModel, rig.js (pivots and layers), materials.js, Studio, Airflow,
                 CameraRig, Projector, anchors.js
  components/    Scene3D, StickyScene, TextReveal, ScrollReveal, ScrollProgress, MagneticButton,
                 CursorInteraction, PageTransition, AnnotationLayer, sceneTimeline
  sections/      HeroScene, FormScene, AerodynamicsScene, WingScene, WheelScene, MacroScene,
                 CockpitScene, ExplodedScene (+ technical view), PerformanceNumbers, ControlScene,
                 FinalScene, Footer
  content/       story.js — all copy and figures, with sources
```

### Who controls what

| Engine | Responsibility |
|---|---|
| GSAP | A plain `director` object, driven by a scroll-linked master timeline; text opacity and transforms |
| R3F | All 3D transforms, lights and materials, plus the projected annotation layer |
| Motion | Only the inner children of buttons and labels |

No element ever receives transforms from more than one engine.

### Tuning the film

All camera, car, light and airflow choreography is in `src/scroll/choreography.js`. Each scene declares keyframes in local time between 0 and 1. The text windows for each section (`WINDOWS`) are aligned to those same times.

## Debug query parameters

| Parameter | Effect |
|---|---|
| `?tier=full\|lite\|static\|static-lite` | Force an experience tier |
| `&debug` | Expose `__master`, `__dir` and `__ST` on `window` |
| `&noscrub` | Immediate scrub (no scroll smoothing) |
| `&skipintro` | Skip the intro |
| `&nolag` | Disable lag smoothing (useful with software-rendered GPUs) |

## Credits and disclaimer

- Personal project, not affiliated with Porsche AG.
- Model "Porsche GT3 RS" by Black Snow, licensed under CC BY 4.0.
- Figures are official 992 GT3 RS data (Porsche Newsroom). The model's mechanical detail is illustrative.
