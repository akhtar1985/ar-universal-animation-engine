# AR Universal Animation Engine (UAE)

A standalone, modular, vanilla-JavaScript animation engine for DOM, SVG, Canvas 2D, and 3D. Zero core dependencies.

## Table of Contents
- [Features](#features)
- [Install](#install)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Modules](#modules)
- [Options](#options)
- [Comparison](#comparison)
- [License](#license)

## Features
- Core animation model with state machine and lifecycle
- Shared requestAnimationFrame scheduler (single loop)
- Interpolation: numeric, color, units, inset
- 16+ easing functions
- DOM/CSS renderer (transforms, opacity, colors, CSS props)
- SVG renderer + stroke draw
- Canvas 2D renderer + particle system
- 3D transforms & perspective
- Timeline: sequence, parallel, labels, offsets, stagger, seek
- Interactions: hover, click, scroll, pointer, keyboard, intersection
- Parallax: scroll-based & pointer-based
- Advanced effects: mask reveal, filter, text effect
- Plugin & custom effect API with hooks
- Visual Animation Studio
- Reduced-motion support

## Install
```
npm install ar-universal-animation-engine
```
CDN (UMD):
```html
<script src="https://unpkg.com/ar-universal-animation-engine@latest/dist/uae.umd.js"></script>
```

## Quick Start
```js
import { animate } from 'ar-universal-animation-engine';
animate('.box', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { duration: 600, easing: 'easeOutCubic' });
```

## API Reference

### animate(targets, fromVars, toVars, options)
Returns Animation instance.

### Timeline
```js
const tl = timeline();
tl.add('.a', {opacity:0}, {opacity:1}, {duration:300});
tl.add('.b', {x:0}, {x:100}, {duration:200}, '+=100');
tl.play();
```
Methods: play, pause, resume, reverse, restart, seek, seekToLabel, addLabel, add, stagger, duration, state.

### Presets
fade, slideUp, slideDown, slideLeft, slideRight, zoomIn, zoomOut, bounce.

### Interactions
hover, click, scroll, pointer, keyboard, intersection.

### Parallax
ScrollParallax, PointerParallax.

### Plugins
registerPlugin, registerEffect, callHook.

## Modules
- core/Animation
- core/Timeline
- easing/easing
- interpolation/interpolate
- renderers/domRenderer
- renderers/svg/svgRenderer
- renderers/canvas/CanvasRenderer
- renderers/three/scene3d
- effects/masks/maskReveal
- effects/filters/filterEffect
- effects/text/textEffect
- effects/particles/ParticleSystem
- interactions/*
- parallax/*
- plugins/*

## Options
- duration (ms, default 600)
- delay (ms)
- easing (name or function)
- onUpdate, onComplete
- autoplay (boolean)
- direction

## Comparison
| Feature | UAE | GSAP | Anime.js |
|---|---|---|---|
| Vanilla | ✅ | ❌ | ✅ |
| Zero deps | ✅ | ❌ | ✅ |
| Timeline | ✅ | ✅ | ✅ |
| Canvas | ✅ | ❌ | ❌ |
| Plugin API | ✅ | ✅ | ❌ |
| Reduced motion | ✅ | ❌ | ❌ |

## License
MIT
" filePath="D:\Projects\animation-engine\ar-universal-animation-engine\README.md