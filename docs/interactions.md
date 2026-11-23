# Interactions Guide

All triggers return a `{ destroy() }` handle. Always call `destroy()` when cleaning up.

## Intersection (scroll into view)

```js
const anim = UAE.fromTo('.card', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, {
  duration: 600, autoplay: false
});

UAE.on('intersection', '.card', anim, {
  threshold: 0.2,      // 0–1, how much of element must be visible
  rootMargin: '0px',   // CSS margin around viewport
  once: true,          // unobserve after first trigger (default: true)
  reverseOnExit: false // reverse animation when element leaves viewport
});
```

## Hover

```js
const anim = UAE.fromTo('.btn', { scale: 1 }, { scale: 1.08 }, {
  duration: 200, autoplay: false
});
UAE.on('hover', '.btn', anim);
```

## Click (toggle)

```js
UAE.on('click', '.toggle', anim, {
  onClick(toggled, anim) { console.log('toggled:', toggled); }
});
```

## Scroll scrub

Seeks animation progress to scroll position. No autoplay needed.

```js
const anim = UAE.fromTo('.panel', { opacity: 0, y: 60 }, { opacity: 1, y: 0 }, {
  duration: 1, autoplay: false
});

UAE.on('scroll', '.panel', anim, {
  start: 0.1,   // progress at which animation starts (0–1 of scroll range)
  end: 0.6,     // progress at which animation ends
});
```

## Pointer

Fires `onMove(x, y)` with normalized 0–1 coordinates relative to the target.

```js
UAE.on('pointer', '.canvas-area', null, {
  // pointer trigger passes onMove instead of an animation
});

// Direct usage:
import { pointer } from './src/interactions/pointer.js';
pointer('.area', (x, y) => {
  UAE.to('.cursor', { x: x * 300, y: y * 200 }, { duration: 100 });
});
```

## Keyboard

Default keys: `Space` = play/pause, `ArrowRight` = seek +10%, `ArrowLeft` = seek -10%.

```js
UAE.on('keyboard', null, anim, {
  keys: {
    'r': anim => anim.restart(),
    'f': anim => anim.finish(),
  }
});
```

## Reduced motion

All triggers silently no-op when `prefers-reduced-motion: reduce` is set. No extra code needed.
