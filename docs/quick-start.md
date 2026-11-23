# Quick Start

## Installation

No build step required. UAE is pure ES modules.

```html
<script type="module">
  import UAE from './src/index.js';
</script>
```

## Your first animation

```js
import UAE from './src/index.js';

// Preset animation
UAE.animate('.card', 'fadeIn', { duration: 600 });

// From → To
UAE.fromTo('.hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, { duration: 800 });

// Animate from current values
UAE.to('.box', { opacity: 0, scale: 0.9 }, { duration: 400 });
```

## Playback controls

Every animation returns an instance with full controls:

```js
const anim = UAE.fromTo('.box', { opacity: 0 }, { opacity: 1 }, { duration: 600, autoplay: false });

anim.play();
anim.pause();
anim.resume();
anim.reverse();
anim.restart();
anim.seek(0.5);   // jump to 50%
anim.finish();
anim.cancel();
anim.destroy();
```

## Easing

Pass any easing name as a string:

```js
UAE.animate('.card', 'slideUp', { easing: 'easeOutCubic' });
```

Available easings: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInBack`, `easeOutBack`, `easeInOutBack`, `easeInElastic`, `easeOutElastic`, `easeOutBounce`.

You can also pass a custom function `t => t`.

## Presets

| Name | Effect |
|---|---|
| `fadeIn` | opacity 0 → 1 |
| `fadeOut` | opacity 1 → 0 |
| `slideUp` | fade + move up |
| `slideDown` | fade + move down |
| `slideLeft` | fade + move left |
| `slideRight` | fade + move right |
| `zoomIn` | fade + scale up |
| `zoomOut` | fade + scale down |

## Reduced motion

UAE respects `prefers-reduced-motion` automatically in all interaction triggers and parallax. For animations themselves, check it before running:

```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  UAE.animate('.hero', 'fadeIn', { duration: 800 });
}
```
