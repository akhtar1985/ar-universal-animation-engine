(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UAE = {}));
})(this, (function (exports) { 'use strict';

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

  const c1 = 1.70158, c2 = c1 * 1.525, c3 = c1 + 1;

  const easings = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => 1 - (1 - t) ** 2,
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2,
    easeInCubic: t => t ** 3,
    easeOutCubic: t => 1 - (1 - t) ** 3,
    easeInOutCubic: t => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
    easeInQuart: t => t ** 4,
    easeOutQuart: t => 1 - (1 - t) ** 4,
    easeInOutQuart: t => t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2,
    easeInBack: t => c3 * t ** 3 - c1 * t * t,
    easeOutBack: t => 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2,
    easeInOutBack: t => t < 0.5
      ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
      : ((2 * t - 2) ** 2 * ((c2 + 1) * (2 * t - 2) + c2) + 2) / 2,
    easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * (2 * Math.PI) / 3),
    easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
    easeOutBounce: t => {
      const n1 = 7.5625, d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
  };

  function getEasing(name) {
    if (typeof name === 'function') return name;
    const fn = easings[name];
    if (!fn) throw new Error(`UAE: unknown easing "${name}"`);
    return fn;
  }

  const HEX = /^#([0-9a-f]{3,8})$/i;
  const RGB = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/;

  function parseColor(v) {
    let m = v.match(HEX);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    }
    m = v.match(RGB);
    if (m) return [+m[1], +m[2], +m[3]];
    return null;
  }

  function isColor(v) { return typeof v === 'string' && (HEX.test(v) || RGB.test(v)); }

  const UNIT = /^(-?[\d.]+)([a-z%]*)$/i;
  const INSET = /inset\(([^)]+)\)/;

  function interpolateInset(from, to, t) {
    const fa = from.match(INSET)?.[1].trim().split(/\s+/) ?? [];
    const ta = to.match(INSET)?.[1].trim().split(/\s+/) ?? [];
    const parts = fa.map((f, i) => {
      const mf = f.match(UNIT), mt = (ta[i] ?? f).match(UNIT);
      if (mf && mt) return `${+mf[1] + (+mt[1] - +mf[1]) * t}${mt[2] || mf[2]}`;
      return t < 1 ? f : ta[i] ?? f;
    });
    return `inset(${parts.join(' ')})`;
  }

  function interpolate(from, to, t) {
    if (typeof from === 'number' && typeof to === 'number') {
      return from + (to - from) * t;
    }
    if (isColor(from) && isColor(to)) {
      const a = parseColor(from), b = parseColor(to);
      const r = Math.round(a[0] + (b[0] - a[0]) * t);
      const g = Math.round(a[1] + (b[1] - a[1]) * t);
      const bl = Math.round(a[2] + (b[2] - a[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }
    if (typeof from === 'string' && typeof to === 'string') {
      if (from.startsWith('inset') && to.startsWith('inset')) return interpolateInset(from, to, t);
      const mf = from.match(UNIT), mt = to.match(UNIT);
      if (mf && mt) {
        const val = +mf[1] + (+mt[1] - +mf[1]) * t;
        return `${val}${mt[2] || mf[2]}`;
      }
    }
    return t < 1 ? from : to;
  }

  const TRANSFORM_PROPS = new Set(['x', 'y', 'z', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'perspective']);

  const TRANSFORM_DEFAULTS = { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, perspective: 0 };

  function buildTransform(map) {
    const parts = [];
    const x = map.x ?? 0, y = map.y ?? 0, z = map.z ?? 0;
    if (x || y || z) parts.push(`translate3d(${x}px,${y}px,${z}px)`);
    if (map.rotate) parts.push(`rotate(${map.rotate}deg)`);
    if (map.rotateX) parts.push(`rotateX(${map.rotateX}deg)`);
    if (map.rotateY) parts.push(`rotateY(${map.rotateY}deg)`);
    if (map.rotateZ) parts.push(`rotateZ(${map.rotateZ}deg)`);
    const sx = map.scaleX ?? map.scale ?? 1, sy = map.scaleY ?? map.scale ?? 1;
    if (sx !== 1 || sy !== 1) parts.push(`scale(${sx},${sy})`);
    if (map.skewX) parts.push(`skewX(${map.skewX}deg)`);
    if (map.skewY) parts.push(`skewY(${map.skewY}deg)`);
    if (map.perspective) parts.unshift(`perspective(${map.perspective}px)`);
    return parts.join(' ') || 'none';
  }

  function applyValues(el, values) {
    const transforms = {};
    let hasTransform = false;

    for (const [prop, val] of Object.entries(values)) {
      if (TRANSFORM_PROPS.has(prop)) {
        transforms[prop] = val;
        hasTransform = true;
      } else {
        el.style[prop] = val;
      }
    }

    if (hasTransform) {
      el.style.transform = buildTransform(transforms);
    }
  }

  function readInitial(el, props) {
    const computed = getComputedStyle(el);
    const result = {};
    for (const prop of props) {
      if (TRANSFORM_PROPS.has(prop)) {
        result[prop] = TRANSFORM_DEFAULTS[prop];
      } else {
        result[prop] = computed[prop] || '0';
      }
    }
    return result;
  }

  // SVG presentation attributes that must be set via setAttribute, not style
  const SVG_ATTRS = new Set([
    'cx', 'cy', 'r', 'rx', 'ry',
    'x', 'y', 'x1', 'y1', 'x2', 'y2',
    'width', 'height',
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
    'opacity', 'fill-opacity', 'stroke-opacity',
    'points', 'd',
  ]);

  const SVG_TRANSFORM = new Set(['translateX', 'translateY', 'rotate', 'scale', 'skewX', 'skewY']);

  function isSVG(el) {
    return el instanceof SVGElement;
  }

  function buildSVGTransform(map) {
    const parts = [];
    const tx = map.translateX ?? 0, ty = map.translateY ?? 0;
    if (tx || ty) parts.push(`translate(${tx} ${ty})`);
    if (map.rotate  !== null) parts.push(`rotate(${map.rotate})`);
    if (map.scale   !== null) parts.push(`scale(${map.scale})`);
    if (map.skewX   !== null) parts.push(`skewX(${map.skewX})`);
    if (map.skewY   !== null) parts.push(`skewY(${map.skewY})`);
    return parts.join(' ') || '';
  }

  function applySVGValues(el, values) {
    if (!isSVG(el)) return false;

    const transforms = {};
    let hasTransform = false;

    for (const [prop, val] of Object.entries(values)) {
      if (SVG_TRANSFORM.has(prop)) {
        transforms[prop] = val;
        hasTransform = true;
      } else if (SVG_ATTRS.has(prop)) {
        el.setAttribute(prop, val);
      } else {
        el.style[prop] = val;
      }
    }

    if (hasTransform) {
      const t = buildSVGTransform(transforms);
      if (t) el.setAttribute('transform', t);
    }

    return true;
  }

  function readSVGInitial(el, props) {
    const result = {};
    for (const prop of props) {
      if (SVG_TRANSFORM.has(prop)) {
        result[prop] = prop === 'scale' ? 1 : 0;
      } else if (SVG_ATTRS.has(prop)) {
        result[prop] = el.getAttribute(prop) ?? '0';
      } else {
        result[prop] = getComputedStyle(el)[prop] ?? '0';
      }
    }
    return result;
  }

  const REQUIRED_FIELDS = ['name', 'version'];
  const registry = new Map();

  /**
   * A plugin must have:
   *   name: string
   *   version: string
   * And any of these optional hooks:
   *   install(UAE)           — called once on registration, receives the public API
   *   onAnimationCreate(anim) — called when any Animation is constructed
   *   onAnimationComplete(anim)
   *   onTick(anim, progress)
   */
  function registerPlugin(plugin) {
    for (const field of REQUIRED_FIELDS) {
      if (!plugin[field]) throw new Error(`UAE plugin: missing required field "${field}"`);
    }
    if (registry.has(plugin.name)) {
      console.warn(`UAE plugin: "${plugin.name}" is already registered, skipping`);
      return;
    }
    registry.set(plugin.name, plugin);
  }

  function listPlugins() {
    return [...registry.values()].map(p => ({ name: p.name, version: p.version }));
  }

  function callHook(hook, ...args) {
    for (const plugin of registry.values()) {
      if (typeof plugin[hook] === 'function') {
        try { plugin[hook](...args); }
        catch (e) { console.error(`UAE plugin "${plugin.name}" hook "${hook}" threw:`, e); }
      }
    }
  }

  const isDev = typeof process === 'undefined' || process.env?.NODE_ENV !== 'production';

  const warn  = isDev ? (msg, ...args) => console.warn(`UAE: ${msg}`, ...args)  : () => {};

  const STATES = { idle: 'idle', running: 'running', paused: 'paused', finished: 'finished', cancelled: 'cancelled' };

  function resolveTargets(targets) {
    if (!targets) return [];
    if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets));
    if (targets instanceof Element) return [targets];
    if (targets instanceof NodeList || Array.isArray(targets)) return Array.from(targets);
    return [];
  }

  class Animation {
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

  class Timeline {
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

  const presets = {
    fadeIn:      { from: { opacity: 0 },              to: { opacity: 1 } },
    fadeOut:     { from: { opacity: 1 },              to: { opacity: 0 } },
    slideUp:     { from: { opacity: 0, y: 40 },       to: { opacity: 1, y: 0 } },
    slideDown:   { from: { opacity: 0, y: -40 },      to: { opacity: 1, y: 0 } },
    slideLeft:   { from: { opacity: 0, x: 40 },       to: { opacity: 1, x: 0 } },
    slideRight:  { from: { opacity: 0, x: -40 },      to: { opacity: 1, x: 0 } },
    zoomIn:      { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
    zoomOut:     { from: { opacity: 1, scale: 1 },    to: { opacity: 0, scale: 0.85 } },
  };

  function getPreset(name) {
    const p = presets[name];
    if (!p) throw new Error(`UAE: unknown preset "${name}"`);
    return p;
  }

  const reducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function hover(target, animation, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('hover: target not found', target); return { destroy() {} }; }

    const onEnter = () => { animation.reverse(); animation.play(); };
    const onLeave = () => { animation.reverse(); };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return {
      destroy() {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      }
    };
  }

  function click(target, animation, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('click: target not found', target); return { destroy() {} }; }

    let toggled = false;

    const onClick = () => {
      toggled = !toggled;
      if (toggled) {
        animation._direction = 1;
        animation.play();
      } else {
        animation.reverse();
      }
      options.onClick?.(toggled, animation);
    };

    el.addEventListener('click', onClick);

    return {
      destroy() { el.removeEventListener('click', onClick); }
    };
  }

  function intersection(target, animation, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('intersection: target not found', target); return { destroy() {} }; }

    const { threshold = 0.1, rootMargin = '0px', once = true, reverseOnExit = false } = options;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animation._direction = 1;
          animation.play();
          if (once) observer.unobserve(el);
        } else if (reverseOnExit) {
          animation.reverse();
        }
      }
    }, { threshold, rootMargin });

    observer.observe(el);

    return {
      destroy() { observer.disconnect(); }
    };
  }

  function scroll(target, animation, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('scroll: target not found', target); return { destroy() {} }; }

    const { start = 0, end = 1, scroller = window } = options;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when bottom of el hits bottom of viewport, 1 when top hits top
      const raw = 1 - rect.bottom / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, (raw - start) / (end - start)));
      animation.seek(clamped);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return {
      destroy() { scroller.removeEventListener('scroll', onScroll); }
    };
  }

  function pointer(target, onMove, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('pointer: target not found', target); return { destroy() {} }; }

    const { throttleMs = 16 } = options;
    let last = 0;

    const onMouseMove = (e) => {
      const now = performance.now();
      if (now - last < throttleMs) return;
      last = now;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      onMove(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
    };

    el.addEventListener('mousemove', onMouseMove, { passive: true });

    return {
      destroy() { el.removeEventListener('mousemove', onMouseMove); }
    };
  }

  const DEFAULTS = {
    ' ':          anim => anim.state === 'running' ? anim.pause() : anim.play(),
    'ArrowRight': anim => anim.seek(Math.min(1, (anim._elapsed / anim.duration) + 0.1)),
    'ArrowLeft':  anim => anim.seek(Math.max(0, (anim._elapsed / anim.duration) - 0.1)),
  };

  function keyboard(animation, options = {}) {
    if (reducedMotion()) return { destroy() {} };

    const keyMap = { ...DEFAULTS, ...options.keys };

    const onKeyDown = (e) => {
      const handler = keyMap[e.key];
      if (handler) { e.preventDefault(); handler(animation); }
    };

    window.addEventListener('keydown', onKeyDown);

    return {
      destroy() { window.removeEventListener('keydown', onKeyDown); }
    };
  }

  const triggers = { hover, click, intersection, scroll, pointer, keyboard };

  /**
   * createInteraction('hover', target, animation, options)
   * Returns a handle with destroy() for cleanup.
   */
  function createInteraction(type, target, animation, options = {}) {
    const fn = triggers[type];
    if (!fn) throw new Error(`UAE: unknown interaction type "${type}"`);
    return fn(target, animation, options);
  }

  class ScrollParallax {
    constructor(target, options = {}) {
      this._el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!this._el) { warn('ScrollParallax: target not found', target); return; }

      this._speed  = options.speed  ?? 0.3;   // 0 = no movement, 1 = moves with scroll
      this._axis   = options.axis   ?? 'y';    // 'x' | 'y'
      this._origin = options.origin ?? 0.5;    // 0=top 1=bottom of viewport as reference
      this._clamp  = options.clamp  ?? false;
      this._active = false;
      this._scrollY = 0;
      this._ticking = false;

      if (reducedMotion()) return;

      this._onScroll = () => {
        this._scrollY = window.scrollY;
        if (!this._ticking) {
          this._ticking = true;
          add(this);
        }
      };

      window.addEventListener('scroll', this._onScroll, { passive: true });
      this._onScroll();
    }

    _tick() {
      const rect = this._el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height * 0.5;
      const offset = (center - vh * this._origin) * this._speed;
      const val = this._clamp
        ? Math.max(-vh * this._speed, Math.min(vh * this._speed, offset))
        : offset;

      this._el.style.transform = this._axis === 'x'
        ? `translateX(${val}px)`
        : `translateY(${val}px)`;

      this._ticking = false;
      remove(this);
    }

    destroy() {
      window.removeEventListener('scroll', this._onScroll);
      remove(this);
      this._el.style.transform = '';
    }
  }

  class PointerParallax {
    constructor(container, layers, options = {}) {
      this._container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this._container) { warn('PointerParallax: container not found', container); return; }

      // layers: [{ target, depth }]  depth 1 = full movement, 0 = none
      this._layers = layers.map(l => ({
        el: typeof l.target === 'string' ? document.querySelector(l.target) : l.target,
        depth: l.depth ?? 1,
      })).filter(l => l.el);

      this._strength = options.strength ?? 30;  // max px offset at depth 1
      this._ease     = options.ease     ?? 0.1; // lerp factor per frame
      this._mx = 0; this._my = 0;
      this._cx = 0; this._cy = 0;
      this._running = false;

      if (reducedMotion()) return;

      this._onMove = (e) => {
        const rect = this._container.getBoundingClientRect();
        // normalized -1 to 1
        this._mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        this._my = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        if (!this._running) { this._running = true; add(this); }
      };

      this._onLeave = () => { this._mx = 0; this._my = 0; };

      this._container.addEventListener('mousemove', this._onMove, { passive: true });
      this._container.addEventListener('mouseleave', this._onLeave);
    }

    _tick() {
      this._cx += (this._mx - this._cx) * this._ease;
      this._cy += (this._my - this._cy) * this._ease;

      for (const { el, depth } of this._layers) {
        const x = this._cx * this._strength * depth;
        const y = this._cy * this._strength * depth;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      // keep ticking until settled
      const settled = Math.abs(this._mx - this._cx) < 0.001 && Math.abs(this._my - this._cy) < 0.001;
      if (settled) { this._running = false; remove(this); }
      else add(this);
    }

    destroy() {
      this._container.removeEventListener('mousemove', this._onMove);
      this._container.removeEventListener('mouseleave', this._onLeave);
      remove(this);
      for (const { el } of this._layers) el.style.transform = '';
    }
  }

  /**
   * strokeDraw(target, options) - animates stroke drawing
   * for an SVG path/polyline/circle etc.
   * Automatically measures the path length and sets up dasharray/dashoffset.
   */
  function strokeDraw(target, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el || typeof el.getTotalLength !== 'function') {
      warn('strokeDraw: target must be an SVG shape with getTotalLength()', target);
      return null;
    }

    const length = el.getTotalLength();
    el.setAttribute('stroke-dasharray', length);
    el.setAttribute('stroke-dashoffset', length);

    return new Animation(
      el,
      { 'stroke-dashoffset': length },
      { 'stroke-dashoffset': 0 },
      options
    );
  }

  /**
   * scene3d(container) sets up a 3D perspective
   * on a container element.
   * Returns a scene object with animate3d() for animating children in 3D space.
   *
   * UAE.scene3d('.stage', { perspective: 800 })
   *   .animate3d('.card', { rotateY: 0 }, { rotateY: 180 }, { duration: 600 })
   */
  function scene3d(container, options = {}) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) { warn('scene3d: container not found', container); return null; }

    const perspective     = options.perspective     ?? 800;
    const perspectiveOrigin = options.perspectiveOrigin ?? '50% 50%';

    el.style.perspective       = `${perspective}px`;
    el.style.perspectiveOrigin = perspectiveOrigin;

    return {
      /**
       * Animate a child element in 3D space.
       * Automatically applies transform-style: preserve-3d to the target.
       */
      animate3d(target, fromVars, toVars, animOptions = {}) {
        const child = typeof target === 'string' ? el.querySelector(target) : target;
        if (!child) { warn('scene3d.animate3d: target not found', target); return null; }

        child.style.transformStyle = 'preserve-3d';

        if (animOptions.backfaceHidden !== false) {
          child.style.backfaceVisibility = 'hidden';
        }

        return new Animation(child, fromVars, toVars, animOptions);
      },

      /** Remove perspective from the container. */
      destroy() {
        el.style.perspective       = '';
        el.style.perspectiveOrigin = '';
      }
    };
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
  class CanvasAnimation {
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

  const rand = (min, max) => min + Math.random() * (max - min);

  /**
   * Particle system drawable — register with a CanvasRenderer.
   *
   * const renderer = new CanvasRenderer('#canvas');
   * const particles = new ParticleSystem(renderer, { count: 120, color: '#fff' });
   */
  class ParticleSystem {
    constructor(renderer, options = {}) {
      this._renderer = renderer;
      this._opts = {
        count:      options.count      ?? 80,
        color:      options.color      ?? '#ffffff',
        minSize:    options.minSize    ?? 2,
        maxSize:    options.maxSize    ?? 5,
        minSpeed:   options.minSpeed   ?? 0.2,
        maxSpeed:   options.maxSpeed   ?? 1.2,
        minLife:    options.minLife    ?? 60,   // frames
        maxLife:    options.maxLife    ?? 180,
        spawnRate:  options.spawnRate  ?? 2,    // particles per frame
        gravity:    options.gravity    ?? 0,
        fade:       options.fade       !== false,
        origin:     options.origin     ?? null, // { x, y } in px, null = random
      };

      this._particles = [];
      this._frame = 0;

      if (!reducedMotion()) renderer.add(this);
    }

    _spawn(w, h) {
      const o = this._opts;
      const ox = o.origin ? o.origin.x : rand(0, w);
      const oy = o.origin ? o.origin.y : rand(0, h);
      const angle = rand(0, Math.PI * 2);
      const speed = rand(o.minSpeed, o.maxSpeed);
      return {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(o.minSize, o.maxSize),
        life: 0,
        maxLife: rand(o.minLife, o.maxLife),
        color: o.color,
      };
    }

    draw(ctx, w, h) {
      const o = this._opts;
      this._frame++;

      // spawn
      for (let i = 0; i < o.spawnRate && this._particles.length < o.count; i++) {
        this._particles.push(this._spawn(w, h));
      }

      // update + draw
      this._particles = this._particles.filter(p => {
        p.life++;
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += o.gravity;

        const progress = p.life / p.maxLife;
        if (progress >= 1) return false;

        ctx.save();
        ctx.globalAlpha = o.fade ? 1 - progress : 1;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });
    }

    /** Change options at runtime */
    set(opts) { Object.assign(this._opts, opts); return this; }

    destroy() {
      this._renderer.remove(this);
      this._particles = [];
    }
  }

  const DIRECTIONS = {
    left:   ['inset(0 100% 0 0)',   'inset(0 0% 0 0)'],
    right:  ['inset(0 0 0 100%)',   'inset(0 0 0 0%)'],
    top:    ['inset(100% 0 0 0)',   'inset(0% 0 0 0)'],
    bottom: ['inset(0 0 100% 0)',   'inset(0 0 0% 0)'],
    center: ['inset(50% 50% 50% 50%)', 'inset(0% 0% 0% 0%)'],
  };

  /**
   * Reveal an element using clip-path animation.
   * UAE.maskReveal('.text', { direction: 'left', duration: 700 })
   */
  function maskReveal(target, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('maskReveal: target not found', target); return null; }

    const dir = options.direction ?? 'left';
    const [from, to] = DIRECTIONS[dir] ?? DIRECTIONS.left;
    const reveal = options.reveal !== false;

    el.style.clipPath = reveal ? from : to;

    return new Animation(
      el,
      { clipPath: reveal ? from : to },
      { clipPath: reveal ? to : from },
      options
    );
  }

  /**
   * Animate CSS filter properties on an element.
   * Supported: blur(px), brightness, contrast, saturate, grayscale, hueRotate(deg)
   *
   * UAE.filterEffect('.img', { blur: 20, brightness: 0.5 }, { blur: 0, brightness: 1 }, { duration: 600 })
   */
  function filterEffect(target, fromFilters, toFilters, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('filterEffect: target not found', target); return null; }

    const keys     = Object.keys({ ...fromFilters, ...toFilters });
    const from     = {};
    const to       = {};
    for (const k of keys) {
      from[k] = fromFilters[k] ?? toFilters[k];
      to[k]   = toFilters[k]   ?? fromFilters[k];
    }

    const duration  = options.duration ?? 600;
    const delay     = options.delay    ?? 0;
    const easing    = getEasing(options.easing ?? 'easeOutCubic');
    let elapsed     = 0;
    let state       = 'idle';

    function buildFilter(vals) {
      const parts = [];
      if (vals.blur       !== null) parts.push(`blur(${vals.blur}px)`);
      if (vals.brightness !== null) parts.push(`brightness(${vals.brightness})`);
      if (vals.contrast   !== null) parts.push(`contrast(${vals.contrast})`);
      if (vals.saturate   !== null) parts.push(`saturate(${vals.saturate})`);
      if (vals.grayscale  !== null) parts.push(`grayscale(${vals.grayscale})`);
      if (vals.hueRotate  !== null) parts.push(`hue-rotate(${vals.hueRotate}deg)`);
      return parts.join(' ') || 'none';
    }

    function render(t) {
      const vals = {};
      for (const k of keys) vals[k] = from[k] + (to[k] - from[k]) * t;
      el.style.filter = buildFilter(vals);
      options.onUpdate?.(t);
    }

    const handle = {
      _tick(delta) {
        if (state !== 'running') return;
        elapsed += delta;
        const active = elapsed - delay;
        if (active < 0) return;
        const t = easing(Math.min(1, active / duration));
        render(t);
        if (active >= duration) {
          state = 'finished';
          remove(handle);
          options.onComplete?.();
        }
      },
      play()    { state = 'running'; add(handle); return handle; },
      pause()   { state = 'paused';  remove(handle); return handle; },
      destroy() { state = 'cancelled'; remove(handle); el.style.filter = ''; },
      get state() { return state; },
    };

    el.style.filter = buildFilter(from);
    if (options.autoplay !== false) handle.play();
    return handle;
  }

  /**
   * Split element text into spans and stagger-animate each unit.
   *
   * UAE.textEffect('.heading', 'chars', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, {
   *   duration: 400, stagger: 30, easing: 'easeOutCubic'
   * })
   */
  function textEffect(target, splitBy = 'chars', fromVars, toVars, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) { warn('textEffect: target not found', target); return []; }
    if (reducedMotion()) return [];

    const staggerMs = options.stagger ?? 40;
    const units = split(el, splitBy);

    return units.map((span, i) =>
      new Animation(span, { ...fromVars }, { ...toVars }, {
        ...options,
        delay: (options.delay ?? 0) + i * staggerMs,
        autoplay: options.autoplay !== false,
      })
    );
  }

  function split(el, by) {
    const text = el.textContent ?? '';
    el.textContent = '';
    el.style.display = el.style.display || 'block';

    let tokens;
    if (by === 'chars') {
      tokens = [...text];
    } else if (by === 'words') {
      tokens = text.split(/(\s+)/);
    } else {
      // lines — wrap in a measuring div first
      tokens = text.split('\n').filter(Boolean);
    }

    return tokens.map(token => {
      const span = document.createElement('span');
      span.textContent = token;
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      el.appendChild(span);
      return span;
    });
  }

  const effects = new Map();

  /**
   * Register a custom effect.
   *
   * UAE.registerEffect('bounce', (target, options) => {
   *   return UAE.fromTo(target, { y: 0 }, { y: -30 }, { ...options, easing: 'easeOutElastic' });
   * });
   *
   * UAE.effect('bounce', '.box', { duration: 600 });
   */
  function registerEffect(name, fn) {
    if (typeof name !== 'string' || !name) throw new Error('UAE registerEffect: name must be a non-empty string');
    if (typeof fn !== 'function') throw new Error(`UAE registerEffect: "${name}" handler must be a function`);
    if (effects.has(name)) console.warn(`UAE registerEffect: "${name}" is being overwritten`);
    effects.set(name, fn);
  }

  function runEffect(name, target, options = {}) {
    const fn = effects.get(name);
    if (!fn) throw new Error(`UAE effect: unknown effect "${name}"`);
    return fn(target, options);
  }
  function listEffects()   { return [...effects.keys()]; }

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

  exports.Animation = Animation;
  exports.CanvasAnimation = CanvasAnimation;
  exports.CanvasRenderer = CanvasRenderer;
  exports.ParticleSystem = ParticleSystem;
  exports.PointerParallax = PointerParallax;
  exports.ScrollParallax = ScrollParallax;
  exports.Timeline = Timeline;
  exports.createInteraction = createInteraction;
  exports.default = UAE;
  exports.filterEffect = filterEffect;
  exports.listEffects = listEffects;
  exports.listPlugins = listPlugins;
  exports.maskReveal = maskReveal;
  exports.registerEffect = registerEffect;
  exports.registerPlugin = registerPlugin;
  exports.runEffect = runEffect;
  exports.scene3d = scene3d;
  exports.strokeDraw = strokeDraw;
  exports.textEffect = textEffect;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=uae.umd.js.map
