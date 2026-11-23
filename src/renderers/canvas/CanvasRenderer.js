import { add, remove } from '../../scheduler/scheduler.js';

/**
 * Manages a single canvas element.
 * Drawables register themselves; the renderer clears and redraws each frame.
 */
export class CanvasRenderer {
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
