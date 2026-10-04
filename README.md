# 911 GT3 RS — Sculpted by Air

Experiencia web cinematográfica (portfolio personal, no oficial) construida con React 19, Vite 8, three r186, React Three Fiber 9, GSAP 3.15 (ScrollTrigger + SplitText) y Motion 14.

La dirección completa (concepto, Motion Map, Motion Budget, decisiones, responsive, accesibilidad y rendimiento) está en [`docs/DIRECTION.md`](docs/DIRECTION.md).

## Arranque

```bash
npm install
npm run dev          # desarrollo
npm run build        # build + pre-render del HTML (contenido completo sin JS)
npm run preview
```

## Modelo 3D

- `public/models/GT3RS.glb`: versión optimizada, 2,6 MB. El original pesaba 19,3 MB. Se conservan 374 nodos y 251 mallas: no se ha usado `join` ni `flatten`.
- Para regenerarla, copia el original en `public/models/GT3RS.source.glb` y ejecuta `npm run optimize:model`.
- Las líneas de flujo se derivan del perfil real del modelo con `npm run airflow` (Python + numpy, lee el `.source.glb`).
- El póster del hero se regenera con `npm run poster` (requiere `npm run preview` en marcha).

## Arquitectura

```
src/
  motion/          motion.config.js (tokens), tier.js (niveles), gsap.js (registro)
  scroll/          director.js (estado único), choreography.js (la película entera), masterTimeline.js
  three/           Experience, CarModel, rig.js (pivotes y capas), materials.js, Studio, Airflow, CameraRig, Projector, anchors.js
  components/      Scene3D, StickyScene, TextReveal, ScrollReveal, ScrollProgress, MagneticButton,
                   CursorInteraction, PageTransition, AnnotationLayer, sceneTimeline
  sections/        HeroScene, FormScene, AerodynamicsScene, WingScene, WheelScene, MacroScene,
                   CockpitScene, ExplodedScene (+ vista técnica), PerformanceNumbers, ControlScene, FinalScene, Footer
  content/story.js todos los textos y cifras, con fuentes
```

### Reparto de responsabilidades entre motores

| Motor | Qué controla |
|---|---|
| GSAP | Objeto plano `director` mediante una timeline maestra ligada al scroll; opacidad y transform del texto |
| R3F | Todos los transforms 3D, luces y materiales, y la capa de anotaciones proyectadas |
| Motion | Solo los hijos interiores de botones y etiquetas |

Ningún elemento recibe transforms de dos motores.

### Ajustar la película

Toda la coreografía de cámara, coche, luz y aire está en `src/scroll/choreography.js`. Cada escena declara keyframes en tiempo local entre 0 y 1. Las ventanas de los textos de cada sección (`WINDOWS`) se alinean con esos mismos tiempos.

## Parámetros de depuración

| Parámetro | Efecto |
|---|---|
| `?tier=full\|lite\|static\|static-lite` | Fuerza un nivel de experiencia |
| `&debug` | Expone `__master`, `__dir`, `__ST` |
| `&noscrub` | Scrub inmediato |
| `&skipintro` | Salta la intro |
| `&nolag` | Desactiva el lag smoothing (útil con GPU por software) |

## Créditos y avisos

- Proyecto personal, sin afiliación con Porsche AG.
- Modelo «Porsche GT3 RS» de Black Snow, licencia CC BY 4.0.
- Las cifras son datos oficiales del 992 GT3 RS (Porsche Newsroom). La mecánica del modelo es ilustrativa.
