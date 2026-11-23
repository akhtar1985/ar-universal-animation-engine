import { reducedMotion } from './reducedMotion.js';
import { warn } from '../utils/warn.js';

export function hover(target, animation, options = {}) {
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
