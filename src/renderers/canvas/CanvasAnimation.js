import { add, remove } from '../../scheduler/scheduler.js';
import { getEasing } from '../../easing/easing.js';
import { interpolate } from '../../interpolation/interpolate.js';

/**
 * Animate arbitrary values and render them via a custom draw callback.
 * Useful for canvas shapes, gradients, or any non-DOM animation.
 *
 * new CanvasAnimation(
 *   { radius: 0, alpha: 0 },
 *   { radius: 80, alpha: 1 },
 *   (values, ctx, w, h) => { ctx.arc(w/2, h/2, values.radius, 0, Math.PI*2); },
 *   renderer,
 *   { duration: 600 }
 * )
 */
export class CanvasAnimation {
  constructor(fromVars, toVars, drawFn, renderer, options = {}) {
    this._from    = fromVars;
    this._to      = toVars;
    this._drawFn  = drawFn;
    this._renderer = renderer;
    this.duration  = options.duration ?? 600;
    this.delay     = options.delay    ?? 0;
    this._easing   = getEasing(options.easing ?? 'easeOutCubic');
    this.onComplete = options.onComplete ?? null;
    this._elapsed  = 0;
    this._state    = 'idle';
    this._values   = { ...fromVars };

    renderer.add(this);
    if (options.autoplay !== false) { this._state = 'running'; add(this); }
  }

  draw(ctx, w, h) { this._drawFn(this._values, ctx, w, h); }

  _tick(delta) {
    if (this._state !== 'running') return;
    this._elapsed += delta;
    const active = this._elapsed - this.delay;
    if (active < 0) return;
    const t = this._easing(Math.min(1, active / this.duration));
    for (const prop of Object.keys(this._to)) {
      this._values[prop] = interpolate(this._from[prop], this._to[prop], t);
    }
    if (active >= this.duration) {
      this._state = 'finished';
      remove(this);
      this.onComplete?.();
    }
  }

  pause()   { this._state = 'paused';  remove(this); return this; }
  play()    { this._state = 'running'; add(this);    return this; }
  destroy() { remove(this); this._renderer.remove(this); }
}
