import { add, remove } from '../../scheduler/scheduler.js';
import { getEasing } from '../../easing/easing.js';
import { warn } from '../../utils/warn.js';

/**
 * Animate CSS filter properties on an element.
 * Supported: blur(px), brightness, contrast, saturate, grayscale, hueRotate(deg)
 *
 * UAE.filterEffect('.img', { blur: 20, brightness: 0.5 }, { blur: 0, brightness: 1 }, { duration: 600 })
 */
export function filterEffect(target, fromFilters, toFilters, options = {}) {
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
