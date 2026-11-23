import { Animation } from './core/Animation.js';
import { Timeline } from './core/Timeline.js';
import { getPreset } from './presets/presets.js';
import { createInteraction } from './interactions/index.js';
import { ScrollParallax, PointerParallax } from './parallax/index.js';
import { strokeDraw } from './renderers/svg/strokeDraw.js';
import { scene3d } from './renderers/three/scene3d.js';
import { CanvasRenderer } from './renderers/canvas/CanvasRenderer.js';
import { CanvasAnimation } from './renderers/canvas/CanvasAnimation.js';
import { ParticleSystem } from './effects/particles/ParticleSystem.js';
import { maskReveal } from './effects/masks/maskReveal.js';
import { filterEffect } from './effects/filters/filterEffect.js';
import { textEffect } from './effects/text/textEffect.js';
import { registerPlugin, listPlugins } from './plugins/pluginRegistry.js';
import { registerEffect, runEffect, listEffects } from './plugins/effectRegistry.js';

const UAE = {
  /**
   * Animate targets using a named preset.
   * UAE.animate('.card', 'fadeIn', { duration: 700 })
   */
  animate(targets, presetName, options = {}) {
    const { from, to } = getPreset(presetName);
    return new Animation(targets, { ...from }, { ...to }, options);
  },

  /**
   * Animate from explicit start values to end values.
   * UAE.fromTo('.hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, { duration: 900 })
   */
  fromTo(targets, fromVars, toVars, options = {}) {
    return new Animation(targets, fromVars, toVars, options);
  },

  /**
   * Animate from current computed values to end values.
   * UAE.to('.box', { opacity: 0, y: -20 }, { duration: 500 })
   */
  to(targets, toVars, options = {}) {
    return new Animation(targets, null, toVars, options);
  },

  /**
   * Create a timeline for sequencing animations.
   * const tl = UAE.timeline();
   * tl.add('.a', { opacity:0 }, { opacity:1 }, { duration:500 })
   *   .add('.b', { opacity:0 }, { opacity:1 }, { duration:500 }, '-=200')
   *   .stagger('.cards', { opacity:0, y:20 }, { opacity:1, y:0 }, { duration:400 }, 80);
   */
  timeline(options = {}) {
    return new Timeline({ ...options, autoplay: false });
  },

  /**
   * Attach an interaction trigger to an animation.
   * UAE.on('hover', '.btn', animation)
   * UAE.on('intersection', '.section', animation, { once: true })
   * UAE.on('scroll', '.panel', animation, { start: 0.1, end: 0.9 })
   * Returns a handle with destroy() for cleanup.
   */
  on(type, target, animation, options = {}) {
    return createInteraction(type, target, animation, options);
  },

  /**
   * Scroll-based parallax on a single element.
   * UAE.scrollParallax('.banner', { speed: 0.4, axis: 'y' })
   */
  scrollParallax(target, options = {}) {
    return new ScrollParallax(target, options);
  },

  /**
   * Pointer/mouse parallax across layered elements.
   * UAE.pointerParallax('.scene', [
   *   { target: '.layer-bg', depth: 0.2 },
   *   { target: '.layer-fg', depth: 0.8 },
   * ], { strength: 40 })
   */
  pointerParallax(container, layers, options = {}) {
    return new PointerParallax(container, layers, options);
  },

  /**
   * Animate a stroke draw-on effect for an SVG path.
   * UAE.strokeDraw('#my-path', { duration: 1200, easing: 'easeInOutCubic' })
   */
  strokeDraw(target, options = {}) {
    return strokeDraw(target, options);
  },

  /**
   * Set up a CSS 3D perspective stage.
   * const stage = UAE.scene3d('.stage', { perspective: 800 })
   * stage.animate3d('.card', { rotateY: 0 }, { rotateY: 180 }, { duration: 600 })
   */
  scene3d(container, options = {}) {
    return scene3d(container, options);
  },

  /**
   * Create a canvas renderer that manages a draw loop.
   * const renderer = UAE.canvasRenderer('#canvas', { background: '#000' });
   */
  canvasRenderer(canvas, options = {}) {
    return new CanvasRenderer(canvas, options);
  },

  /**
   * Animate arbitrary values with a custom canvas draw function.
   * UAE.canvasAnimation({ r: 0 }, { r: 80 }, (v, ctx) => { ctx.arc(0,0,v.r,0,Math.PI*2); }, renderer)
   */
  canvasAnimation(fromVars, toVars, drawFn, renderer, options = {}) {
    return new CanvasAnimation(fromVars, toVars, drawFn, renderer, options);
  },

  /**
   * Spawn a particle system on a canvas renderer.
   * UAE.particles(renderer, { count: 100, color: '#fff', gravity: 0.05 })
   */
  particles(renderer, options = {}) {
    return new ParticleSystem(renderer, options);
  },

  /**
   * Reveal/hide an element using clip-path.
   * UAE.maskReveal('.box', { direction: 'left', duration: 700 })
   */
  maskReveal(target, options = {}) {
    return maskReveal(target, options);
  },

  /**
   * Animate CSS filters (blur, brightness, contrast, saturate, grayscale).
   * UAE.filterEffect('.img', { blur: 20 }, { blur: 0 }, { duration: 500 })
   */
  filterEffect(target, fromFilters, toFilters, options = {}) {
    return filterEffect(target, fromFilters, toFilters, options);
  },

  /**
   * Split text and stagger-animate chars, words, or lines.
   * UAE.textEffect('.heading', 'chars', { opacity:0, y:20 }, { opacity:1, y:0 }, { stagger:30 })
   */
  textEffect(target, splitBy, fromVars, toVars, options = {}) {
    return textEffect(target, splitBy, fromVars, toVars, options);
  },

  /**
   * Register a plugin with lifecycle hooks.
   * UAE.use({ name: 'myPlugin', version: '1.0', install(UAE) { ... } })
   */
  use(plugin) {
    registerPlugin(plugin);
    plugin.install?.(this);
    return this;
  },

  /** Register a named custom effect callable via UAE.effect(). */
  registerEffect(name, fn) {
    registerEffect(name, fn);
    return this;
  },

  /**
   * Run a registered custom effect.
   * UAE.effect('bounce', '.box', { duration: 600 })
   */
  effect(name, target, options = {}) {
    return runEffect(name, target, options);
  },

  listEffects() { return listEffects(); },
  listPlugins() { return listPlugins(); },
};

export default UAE;
export { Animation, Timeline };
export { createInteraction } from './interactions/index.js';
export { ScrollParallax, PointerParallax } from './parallax/index.js';
export { strokeDraw } from './renderers/svg/strokeDraw.js';
export { scene3d } from './renderers/three/scene3d.js';
export { CanvasRenderer } from './renderers/canvas/CanvasRenderer.js';
export { CanvasAnimation } from './renderers/canvas/CanvasAnimation.js';
export { ParticleSystem } from './effects/particles/ParticleSystem.js';
export { maskReveal }    from './effects/masks/maskReveal.js';
export { filterEffect }  from './effects/filters/filterEffect.js';
export { textEffect }    from './effects/text/textEffect.js';
export { registerPlugin, listPlugins } from './plugins/pluginRegistry.js';
export { registerEffect, runEffect, listEffects } from './plugins/effectRegistry.js';
