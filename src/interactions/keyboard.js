import { reducedMotion } from './reducedMotion.js';

const DEFAULTS = {
  ' ':          anim => anim.state === 'running' ? anim.pause() : anim.play(),
  'ArrowRight': anim => anim.seek(Math.min(1, (anim._elapsed / anim.duration) + 0.1)),
  'ArrowLeft':  anim => anim.seek(Math.max(0, (anim._elapsed / anim.duration) - 0.1)),
};

export function keyboard(animation, options = {}) {
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
