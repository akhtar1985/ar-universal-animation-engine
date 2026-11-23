import { add, remove } from '../scheduler/scheduler.js';
import { Animation } from './Animation.js';
import { getEasing } from '../easing/easing.js';
import { warn } from '../utils/warn.js';

export class Timeline {
  constructor(options = {}) {
    this._entries = [];   // { anim, offset, duration }
    this._labels = {};    // label -> time ms
    this._duration = 0;
    this._elapsed = 0;
    this._direction = 1;
    this._state = 'idle';
    this.easing = getEasing(options.easing ?? 'linear');
    this.onComplete = options.onComplete ?? null;
    this.onUpdate = options.onUpdate ?? null;
    if (options.autoplay !== false) this.play();
  }

  // ── label ──────────────────────────────────────────────────────────────────

  addLabel(name, time) {
    this._labels[name] = this._resolveOffset(time ?? this._duration);
    return this;
  }

  // ── add animations ─────────────────────────────────────────────────────────

  /**
   * add(targets, fromVars, toVars, options, position)
   * position: ms number | label string | '+=' | '-=' relative string | undefined (append)
   */
  add(targets, fromVars, toVars, options = {}, position) {
    const offset = this._resolveOffset(position);
    const anim = new Animation(targets, fromVars, toVars, { ...options, autoplay: false });
    const dur = (options.delay ?? 0) + anim.duration;
    this._entries.push({ anim, offset, duration: dur });
    this._duration = Math.max(this._duration, offset + dur);
    return this;
  }

  /**
   * Stagger: add the same animation to multiple targets with a time offset between each.
   * stagger(targets, fromVars, toVars, options, staggerMs, position)
   */
  stagger(targets, fromVars, toVars, options = {}, staggerMs = 100, position) {
    const base = this._resolveOffset(position);
    const els = typeof targets === 'string'
      ? Array.from(document.querySelectorAll(targets))
      : Array.from(targets);

    els.forEach((el, i) => {
      const offset = base + i * staggerMs;
      const anim = new Animation(el, fromVars, toVars, { ...options, autoplay: false });
      const dur = (options.delay ?? 0) + anim.duration;
      this._entries.push({ anim, offset, duration: dur });
      this._duration = Math.max(this._duration, offset + dur);
    });
    return this;
  }

  // ── playback ───────────────────────────────────────────────────────────────

  play() {
    if (this._state === 'running') return this;
    if (this._state === 'finished') this._elapsed = 0;
    this._state = 'running';
    add(this);
    return this;
  }

  pause() {
    if (this._state !== 'running') return this;
    this._state = 'paused';
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
    this._state = 'idle';
    return this.play();
  }

  seek(progress) {
    const t = Math.max(0, Math.min(1, progress)) * this._duration;
    this._scrub(t);
    return this;
  }

  seekToLabel(name) {
    const t = this._labels[name];
    if (t === null) { warn(`Timeline: unknown label "${name}"`); return this; }
    this._scrub(t);
    return this;
  }

  destroy() {
    remove(this);
    for (const { anim } of this._entries) anim.destroy();
    this._entries = [];
  }

  get duration() { return this._duration; }
  get state() { return this._state; }

  // ── internal ───────────────────────────────────────────────────────────────

  _resolveOffset(position) {
    if (position === null) return this._duration;
    if (typeof position === 'number') return position;
    if (typeof position === 'string') {
      if (position.startsWith('+=')) return this._duration + parseFloat(position.slice(2));
      if (position.startsWith('-=')) return Math.max(0, this._duration - parseFloat(position.slice(2)));
      if (this._labels[position] !== null) return this._labels[position];
    }
    return this._duration;
  }

  _scrub(timeMs) {
    for (const { anim, offset, duration } of this._entries) {
      const local = timeMs - offset;
      if (local < 0) {
        anim._render(0);
      } else if (local >= duration) {
        anim._render(anim.easing(1));
      } else {
        const p = local / duration;
        anim._render(anim.easing(p));
      }
    }
    this.onUpdate?.(timeMs / this._duration);
  }

  _tick(delta) {
    if (this._state !== 'running') return;

    this._elapsed += delta * this._direction;
    this._elapsed = Math.max(0, Math.min(this._duration, this._elapsed));

    this._scrub(this._elapsed);

    const done = this._direction > 0
      ? this._elapsed >= this._duration
      : this._elapsed <= 0;

    if (done) {
      this._state = 'finished';
      remove(this);
      this.onComplete?.();
    }
  }
}
