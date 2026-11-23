import { reducedMotion } from './reducedMotion.js';
import { warn } from '../utils/warn.js';

export function click(target, animation, options = {}) {
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
