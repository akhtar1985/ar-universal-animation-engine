import { Animation } from '../../core/Animation.js';
import { warn } from '../../utils/warn.js';
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
export function maskReveal(target, options = {}) {
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
