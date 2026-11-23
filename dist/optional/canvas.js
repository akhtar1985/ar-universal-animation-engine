const active = new Set();
let rafId = null;
let lastTime = 0;
let hidden = false;

function tick(now) {
  if (hidden) { lastTime = 0; rafId = active.size ? requestAnimationFrame(tick) : null; return; }
  const delta = lastTime ? now - lastTime : 0;
  lastTime = now;
  for (const anim of active) anim._tick(delta, now);
  rafId = active.size ? requestAnimationFrame(tick) : null;
  if (!rafId) lastTime = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if (!hidden && active.size && !rafId) rafId = requestAnimationFrame(tick);
  });
}

function add(anim) {
  active.add(anim);
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function remove(anim) {
  active.delete(anim);
}

/**
 * Manages a single canvas element.
 * Drawables register themselves; the renderer clears and redraws each frame.
 */
class CanvasRenderer {
  constructor(canvas, options = {}) {
    this._canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
    if (!this._canvas) { console.warn('UAE CanvasRenderer: canvas not found', canvas); return; }

    this._ctx = this._canvas.getContext('2d');
    this._drawables = new Set();
    this._running = false;
    this._autoClear = options.autoClear !== false;
    this._bg = options.background ?? null;

    if (options.autosize !== false) this._setupResize();
  }

  get ctx() { return this._ctx; }
  get canvas() { return this._canvas; }
  get width() { return this._canvas.width; }
  get height() { return this._canvas.height; }

  add(drawable) {
    this._drawables.add(drawable);
    if (!this._running) { this._running = true; add(this); }
    return this;
  }

  remove(drawable) {
    this._drawables.delete(drawable);
    if (!this._drawables.size) { this._running = false; remove(this); }
    return this;
  }

  _tick() {
    const { _ctx: ctx, _canvas: cv } = this;
    if (this._autoClear) ctx.clearRect(0, 0, cv.width, cv.height);
    if (this._bg) { ctx.fillStyle = this._bg; ctx.fillRect(0, 0, cv.width, cv.height); }
    for (const d of this._drawables) d.draw(ctx, cv.width, cv.height);
  }

  _setupResize() {
    const ro = new ResizeObserver(() => {
      const { width, height } = this._canvas.getBoundingClientRect();
      this._canvas.width  = width  * devicePixelRatio;
      this._canvas.height = height * devicePixelRatio;
      this._ctx.scale(devicePixelRatio, devicePixelRatio);
    });
    ro.observe(this._canvas);
    this._ro = ro;
  }

  destroy() {
    this._running = false;
    remove(this);
    this._drawables.clear();
    this._ro?.disconnect();
  }
}

export { CanvasRenderer };
//# sourceMappingURL=canvas.js.map
