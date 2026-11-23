# API Reference

## UAE.animate(targets, preset, options)

Animate using a named preset.

| Param | Type | Description |
|---|---|---|
| targets | string \| Element \| NodeList | CSS selector or element(s) |
| preset | string | Preset name (see presets list) |
| options | object | See common options |

```js
UAE.animate('.card', 'fadeIn', { duration: 700, easing: 'easeOutCubic' });
```

---

## UAE.fromTo(targets, fromVars, toVars, options)

Animate from explicit start values to end values.

```js
UAE.fromTo('.hero', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 }, { duration: 900 });
```

---

## UAE.to(targets, toVars, options)

Animate from current computed values to end values.

```js
UAE.to('.box', { opacity: 0, y: -20 }, { duration: 500 });
```

---

## Common options

| Option | Type | Default | Description |
|---|---|---|---|
| duration | number | 600 | Duration in ms |
| delay | number | 0 | Delay before start in ms |
| easing | string \| function | `'easeOutCubic'` | Easing name or custom fn |
| autoplay | boolean | true | Start immediately |
| onUpdate | function(t) | null | Called each frame with progress 0–1 |
| onComplete | function | null | Called when animation finishes |

---

## Animatable properties

**Transforms:** `x`, `y`, `z`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `scale`, `scaleX`, `scaleY`, `skewX`, `skewY`, `perspective`

**CSS:** `opacity`, `width`, `height`, `backgroundColor`, `color`, `borderRadius`, `clipPath`, and any numeric CSS property.

**SVG:** `cx`, `cy`, `r`, `rx`, `ry`, `fill`, `stroke`, `stroke-width`, `stroke-dashoffset`, `opacity`, `translateX`, `translateY`, `rotate`, `scale`.

---

## Animation instance

```js
anim.play()
anim.pause()
anim.resume()
anim.reverse()
anim.restart()
anim.seek(progress)   // 0–1
anim.finish()
anim.cancel()
anim.destroy()
anim.state            // 'idle' | 'running' | 'paused' | 'finished' | 'cancelled'
```

---

## UAE.timeline(options)

Create a timeline for sequencing animations.

```js
const tl = UAE.timeline();

tl.add(targets, fromVars, toVars, options, position)
tl.stagger(targets, fromVars, toVars, options, staggerMs, position)
tl.addLabel(name, time)
tl.play() / .pause() / .resume() / .reverse() / .restart()
tl.seek(0–1)
tl.seekToLabel(name)
tl.destroy()
```

**Position values:** `undefined` (append), `number` ms, `'labelName'`, `'+=200'`, `'-=200'`.

---

## UAE.on(type, target, animation, options)

Attach an interaction trigger. Returns `{ destroy() }`.

| Type | Fires when |
|---|---|
| `hover` | mouseenter / mouseleave |
| `click` | click (toggles play/reverse) |
| `intersection` | element enters viewport |
| `scroll` | scroll position changes |
| `pointer` | mousemove over target |
| `keyboard` | keydown (space, arrows) |

```js
const handle = UAE.on('intersection', '.section', anim, { once: true, threshold: 0.2 });
handle.destroy();
```

---

## UAE.scrollParallax(target, options)

| Option | Default | Description |
|---|---|---|
| speed | 0.3 | Movement ratio (0 = none, 1 = full scroll) |
| axis | `'y'` | `'x'` or `'y'` |
| origin | 0.5 | Viewport reference point |
| clamp | false | Limit max offset |

---

## UAE.pointerParallax(container, layers, options)

```js
UAE.pointerParallax('.scene', [
  { target: '.bg',  depth: 0.2 },
  { target: '.fg',  depth: 0.8 },
], { strength: 40, ease: 0.1 });
```

---

## UAE.strokeDraw(target, options)

Animates SVG stroke draw-on. Target must support `getTotalLength()`.

---

## UAE.scene3d(container, options)

```js
const stage = UAE.scene3d('.wrapper', { perspective: 800 });
stage.animate3d('.card', { rotateY: 0 }, { rotateY: 180 }, { duration: 700 });
stage.destroy();
```

---

## UAE.canvasRenderer(canvas, options)

```js
const renderer = UAE.canvasRenderer('#canvas', { background: '#000', autoClear: true });
renderer.destroy();
```

---

## UAE.canvasAnimation(fromVars, toVars, drawFn, renderer, options)

```js
UAE.canvasAnimation({ r: 0 }, { r: 80 }, (v, ctx, w, h) => {
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, v.r, 0, Math.PI * 2);
  ctx.fill();
}, renderer, { duration: 600 });
```

---

## UAE.particles(renderer, options)

| Option | Default | Description |
|---|---|---|
| count | 80 | Max live particles |
| color | `'#ffffff'` | Particle color |
| minSize / maxSize | 2 / 5 | Size range px |
| minSpeed / maxSpeed | 0.2 / 1.2 | Speed range |
| gravity | 0 | Downward acceleration |
| fade | true | Fade out over lifetime |
| origin | null | `{ x, y }` spawn point, null = random |

---

## UAE.maskReveal(target, options)

| Option | Default | Description |
|---|---|---|
| direction | `'left'` | `left`, `right`, `top`, `bottom`, `center` |
| reveal | true | `true` = reveal in, `false` = hide out |

---

## UAE.filterEffect(target, fromFilters, toFilters, options)

Supported filter keys: `blur`, `brightness`, `contrast`, `saturate`, `grayscale`, `hueRotate`.

---

## UAE.textEffect(target, splitBy, fromVars, toVars, options)

| splitBy | Splits on |
|---|---|
| `'chars'` | Every character |
| `'words'` | Whitespace |
| `'lines'` | Newlines |

Extra option: `stagger` (ms between each unit, default 40).

---

## UAE.use(plugin)

```js
UAE.use({
  name: 'myPlugin',
  version: '1.0',
  install(UAE) {},
  onAnimationCreate(anim) {},
  onAnimationComplete(anim) {},
});
```

---

## UAE.registerEffect(name, fn) / UAE.effect(name, target, options)

```js
UAE.registerEffect('pop', (target, opts) =>
  UAE.fromTo(target, { scale: 1 }, { scale: 1.2 }, { ...opts, easing: 'easeOutBack' })
);
UAE.effect('pop', '.btn', { duration: 300 });
```
