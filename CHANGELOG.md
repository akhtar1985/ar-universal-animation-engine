# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] — Initial release

### Added

**Core**
- `Animation` class with full state machine: idle, running, paused, finished, cancelled
- Shared `requestAnimationFrame` scheduler — single loop for all active animations
- Playback controls: `play`, `pause`, `resume`, `reverse`, `restart`, `seek`, `finish`, `cancel`, `destroy`
- `onUpdate` and `onComplete` callbacks

**Interpolation & Easing**
- Numeric, hex/rgb color, CSS unit string, and `inset()` clip-path interpolation
- 16 named easing functions: linear, quad, cubic, quart, back, elastic, bounce variants
- Custom easing function support

**DOM Renderer**
- Opacity, transforms (`x`, `y`, `z`, `rotate`, `rotateX/Y/Z`, `scale`, `scaleX/Y`, `skewX/Y`, `perspective`), colors, and CSS properties
- Transform composition into a single `transform` string — no clobbering

**SVG Renderer**
- SVG presentation attributes via `setAttribute`
- SVG transform attribute composition
- `strokeDraw` — animated stroke draw-on effect

**3D**
- `scene3d` — CSS perspective stage with `animate3d` helper
- `perspective` as an animatable transform prop

**Canvas**
- `CanvasRenderer` — shared draw loop with `ResizeObserver` DPR scaling
- `CanvasAnimation` — animate arbitrary values with a custom draw callback
- `ParticleSystem` — configurable particle spawner with gravity, fade, and lifetime

**Presets**
- `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`, `zoomIn`, `zoomOut`

**Timeline**
- Sequence, parallel, and overlapping animations
- Labels, absolute/relative positions (`+=`, `-=`)
- Stagger across multiple elements
- Deterministic `seek` and `seekToLabel`

**Interactions**
- `hover`, `click`, `intersection`, `scroll`, `pointer`, `keyboard` triggers
- All respect `prefers-reduced-motion`
- All return `{ destroy() }` for cleanup

**Parallax**
- `ScrollParallax` — scroll-driven element movement
- `PointerParallax` — mouse-driven layered depth effect

**Effects**
- `maskReveal` — clip-path reveal in 5 directions
- `filterEffect` — animated blur, brightness, contrast, saturate, grayscale, hueRotate
- `textEffect` — split and stagger chars, words, or lines

**Plugin & Effect API**
- `registerPlugin` with `install`, `onAnimationCreate`, `onAnimationComplete` hooks
- `registerEffect` / `effect` — named custom effect factory system

**Studio**
- Visual Animation Studio: controls panel, live preview, timeline scrubber, code exporter
- Drives the real engine — no fake animation implementation

**Docs & Demo**
- Quick start, API reference, interactions guide, timeline guide
- Working demo page covering all major features

**Tests**
- Unit tests: easing, interpolation, presets, scheduler, plugin registry, effect registry
- Integration tests: Animation lifecycle, Timeline sequencing

**Build**
- Rollup ESM + UMD bundles
- Sub-path exports for tree-shaking
- `sideEffects: false`
- ESLint config
- Performance benchmarks page
