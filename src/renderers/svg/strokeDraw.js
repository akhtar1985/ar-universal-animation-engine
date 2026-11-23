import { Animation } from '../../core/Animation.js';
import { warn } from '../../utils/warn.js';
/**
 * strokeDraw(target, options) - animates stroke drawing
 * for an SVG path/polyline/circle etc.
 * Automatically measures the path length and sets up dasharray/dashoffset.
 */
export function strokeDraw(target, options = {}) {
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
