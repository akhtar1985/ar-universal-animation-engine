import { reducedMotion } from './reducedMotion.js';
import { warn } from '../utils/warn.js';

export function pointer(target, onMove, options = {}) {
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
