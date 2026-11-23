import { add, remove } from '../scheduler/scheduler.js';
import { getEasing } from '../easing/easing.js';
import { interpolate } from '../interpolation/interpolate.js';
import { applyValues, readInitial } from '../renderers/domRenderer.js';
import { applySVGValues, readSVGInitial } from '../renderers/svg/svgRenderer.js';
import { callHook } from '../plugins/pluginRegistry.js';
import { warn } from '../utils/warn.js';

const STATES = { idle: 'idle', running: 'running', paused: 'paused', finished: 'finished', cancelled: 'cancelled' };

function resolveTargets(targets) {
  if (!targets) return [];
  if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets));
  if (targets instanceof Element) return [targets];
  if (targets instanceof NodeList || Array.isArray(targets)) return Array.from(targets);
  return [];
}

export class Animation {
  constructor(targets, fromVars, toVars, options = {}) {
    this.targets = resolveTargets(targets);
    if (!this.targets.length) warn('no targets matched', targets);

    this._from = fromVars;
    this._to = toVars;
    this.duration = options.duration ?? 600;
    this.delay = options.delay ?? 0;
    this.easing = getEasing(options.easing ?? 'easeOutCubic');
    this.onUpdate = options.onUpdate ?? null;
    this.onComplete = options.onComplete ?? null;

    this._state = STATES.idle;
    this._elapsed = 0;
    this._direction = 1;
    this._initialValues = null;

    callHook('onAnimationCreate', this);
    if (options.autoplay !== false) this.play();
  }

  get state() { return this._state; }

  _resolveFrom() {
    if (this._from) return this._from;
    const props = Object.keys(this._to);
    const map = {};
    for (const el of this.targets) {
      const vals = el instanceof SVGElement ? readSVGInitial(el, props) : readInitial(el, props);
      for (const p of props) map[p] = map[p] ?? vals[p];
    }
    return map;
  }

  play() {
    if (this._state === STATES.running) return this;
    if (this._state === STATES.finished) this._elapsed = 0;
    if (!this._initialValues) this._initialValues = this._resolveFrom();
    this._state = STATES.running;
    add(this);
    return this;
  }

  pause() {
    if (this._state !== STATES.running) return this;
    this._state = STATES.paused;
    remove(this);
    return this;
  }

  resume() { return this.play(); }

  reverse() {
    this._direction *= -1;
    return this.play();
  }

  restart() {
    this._elapsed = 0;
    this._direction = 1;
    return this.play();
  }

  seek(progress) {
    progress = Math.max(0, Math.min(1, progress));
    this._elapsed = this.delay + progress * this.duration;
    this._render(progress);
    return this;
  }

  finish() {
    this._render(1);
    this._state = STATES.finished;
    remove(this);
    this.onComplete?.();
    return this;
  }

  cancel() {
    this._state = STATES.cancelled;
    remove(this);
    return this;
  }

  destroy() {
    this.cancel();
    this.targets = [];
    this._initialValues = null;
  }

  _tick(delta) {
    if (this._state !== STATES.running) return;

    this._elapsed += delta * this._direction;

    const active = this._elapsed - this.delay;
    if (active < 0) return;

    const raw = Math.max(0, Math.min(1, active / this.duration));
    const progress = this._direction < 0 ? 1 - raw : raw;

    this._render(this.easing(progress));

    if (raw >= 1 && this._direction > 0 || this._elapsed <= 0 && this._direction < 0) {
      this._state = STATES.finished;
      remove(this);
      callHook('onAnimationComplete', this);
      this.onComplete?.();
    }
  }

  _render(t) {
    if (!this._initialValues) this._initialValues = this._resolveFrom();
    const from = this._initialValues;
    const to = this._to;
    const values = {};
    for (const prop of Object.keys(to)) {
      values[prop] = interpolate(from[prop] ?? 0, to[prop], t);
    }
    for (const el of this.targets) {
      if (!(el instanceof SVGElement) || !applySVGValues(el, values)) applyValues(el, values);
    }
    this.onUpdate?.(t);
  }
}
