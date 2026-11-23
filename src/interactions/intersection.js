import { reducedMotion } from './reducedMotion.js';
import { warn } from '../utils/warn.js';

export function intersection(target, animation, options = {}) {
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
