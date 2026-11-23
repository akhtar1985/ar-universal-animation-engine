# API Reference — Planned Contract

The API below is a proposal. Confirm names, signatures, and behavior during Phase 0 before treating them as stable.

## Simple animations

```js
UAE.animate(target, presetName, options);
```

Examples:

```js
UAE.animate(".notice", "fadeIn", { duration: 500 });
UAE.animate(".panel", "slideUp", { duration: 650, delay: 100 });
```

## From/to animation

```js
const animation = UAE.fromTo(target, fromValues, toValues, options);
```

Possible controls:

```js
animation.play();
animation.pause();
animation.resume();
animation.reverse();
animation.restart();
animation.seek(0.4);
animation.cancel();
animation.destroy();
```

## Timeline

```js
const timeline = UAE.timeline({ autoplay: false });

timeline
  .add(".title", "fadeIn", { duration: 500 })
  .add(".image", "zoomIn", { duration: 700 }, "-=200")
  .add(".copy", "slideUp", { duration: 500 }, "+=100");

timeline.play();
```

## Interactions

```js
UAE.on(".card", "hover", {
  enter: { effect: "lift", duration: 250 },
  leave: { effect: "reset", duration: 250 }
});
```

## Global settings and reduced motion
The engine should offer a documented way to set defaults and should respect `prefers-reduced-motion`. Exact API names are to be decided during architecture review.

## API requirements
- Consistent return values.
- Clear behavior for invalid selectors and missing targets.
- Predictable defaults.
- No silent failure for unsupported properties.
- Type declarations or JSDoc autocomplete support.
- Examples must be tested against the actual implementation.
