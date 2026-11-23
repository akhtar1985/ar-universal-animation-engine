# AR Universal Animation Engine (UAE)

A standalone, modular, vanilla-JavaScript animation engine for DOM, SVG, Canvas 2D, and 3D. Zero core dependencies.

## Features

| Area | Status |
|---|---|
| Core animation model & lifecycle | ✅ |
| Shared RAF scheduler | ✅ |
| Interpolation (numeric, color, units) | ✅ |
| Easing catalogue (16+ easings) | ✅ |
| DOM/CSS renderer | ✅ |
| SVG renderer & stroke draw | ✅ |
| Canvas 2D renderer & particles | ✅ |
| 3D transforms & perspective | ✅ |
| Timeline, sequence, parallel, stagger | ✅ |
| Interaction triggers (hover, click, scroll, pointer, keyboard, intersection) | ✅ |
| Parallax (scroll & pointer) | ✅ |
| Advanced effects (mask, filter, text) | ✅ |
| Plugin & custom effect API | ✅ |
| Visual Animation Studio | ✅ |
| Reduced-motion support | ✅ |

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

animate('.box', { opacity: 0 }, { opacity: 1 }, { duration: 600 });
```

## API

- `animate(targets, from, to, options)` — basic animation
- `timeline()` — sequence/parallel/stagger
- `presets` — fade, slide, zoom
- `interactions` — hover, click, scroll, pointer, keyboard
- `parallax` — scroll/pointer based
- `registerPlugin`, `registerEffect` — extend

## Comparison

| Library | Vanilla | No deps | Timeline | Canvas | Plugin API |
|---|---|---|---|---|---|
| UAE | ✅ | ✅ | ✅ | ✅ | ✅ |
| GSAP | ❌ | ❌ | ✅ | ❌ | ❌ |
| Anime.js | ✅ | ✅ | ✅ | ❌ | ❌ |

## License

MIT
" filePath="D:\Projects\animation-engine\ar-universal-animation-engine\README.md