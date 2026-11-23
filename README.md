<<<<<<< HEAD
# Universal Animation Engine (UAE)

A standalone, modular JavaScript animation engine designed for beginner-friendly authoring and professional-level control.

## Vision
Create animations for DOM elements, SVG, Canvas, and (optionally) WebGL without relying on an existing animation engine. The engine should support simple presets as well as advanced timelines, interactions, parallax, 2D/3D transforms, text effects, masks, particles, and custom effects.

## Example API direction

```js
import UAE from "./src/index.js";

UAE.animate(".card", "fadeIn", {
  duration: 700,
  easing: "easeOutCubic"
});

const animation = UAE.fromTo(".hero", {
  opacity: 0,
  y: 40,
  scale: 0.96
}, {
  opacity: 1,
  y: 0,
  scale: 1
}, {
  duration: 900,
  autoplay: true
});

animation.pause();
animation.play();
animation.reverse();
animation.seek(0.5);
animation.destroy();
```

These examples define the intended experience, not a demand to implement every API in the first phase. Validate naming and architecture before locking the public API.

## Core principles
- Vanilla JavaScript ES modules.
- Browser-native rendering and scheduling.
- Modular effects and optional renderers.
- No dependency on Swiper, Embla, Splide, GSAP, Anime.js, Motion, or equivalent engines.
- No backend required for the core engine.
- Accessible behavior and `prefers-reduced-motion` support.
- Strong cleanup and lifecycle management.
- Useful documentation, demos, tests, and performance benchmarks.

## Planned capabilities
- 2D transforms, opacity, color, dimensions, and filters.
- 3D transforms and perspective.
- Parallax for scroll, pointer, and layered scenes.
- Fade, slide, zoom, reveal, mask, blur, and distortion effects.
- SVG attributes and path-oriented effects.
- Canvas 2D drawing and particle effects.
- Text and staggered character/word/line effects.
- Timelines, sequences, parallel groups, labels, and stagger.
- Scroll, intersection, hover, click, pointer, touch, gesture, keyboard, and custom-event triggers.
- Presets, custom effects, plugin hooks, responsive settings, and global defaults.
- A visual Animation Studio with preview, controls, timeline, and export.

## Suggested project layout

```text
src/
  core/
  scheduler/
  interpolation/
  easing/
  renderers/
  effects/
  timeline/
  interactions/
  plugins/
  presets/
  utils/
studio/
demo/
docs/
tests/
benchmarks/
```

The agent must inspect the actual workspace before creating or changing this structure.

## Development status
See [FEATURE_STATUS.md](FEATURE_STATUS.md), [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md), and [ARCHITECTURE.md](ARCHITECTURE.md).
=======
# ar-universal-animation-engine
Universal Animation Engine — standalone vanilla JS animation engine for DOM, SVG, Canvas, and 3D with timelines, interactions, parallax, particles, and plugin API. Zero core dependencies.
>>>>>>> 04cb8c8c6a29177ae1a94e6d2d913a80bb1a52c1
