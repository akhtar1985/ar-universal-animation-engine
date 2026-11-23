import { Animation } from '../../core/Animation.js';
import { reducedMotion } from '../../interactions/reducedMotion.js';
import { warn } from '../../utils/warn.js';

/**
 * Split element text into spans and stagger-animate each unit.
 *
 * UAE.textEffect('.heading', 'chars', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, {
 *   duration: 400, stagger: 30, easing: 'easeOutCubic'
 * })
 */
export function textEffect(target, splitBy = 'chars', fromVars, toVars, options = {}) {
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
