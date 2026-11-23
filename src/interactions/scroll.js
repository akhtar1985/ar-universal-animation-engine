import { reducedMotion } from './reducedMotion.js';
import { warn } from '../utils/warn.js';

export function scroll(target, animation, options = {}) {
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
