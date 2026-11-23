const active = new Set();
let rafId = null;
let lastTime = 0;
let hidden = false;

function tick(now) {
  if (hidden) { lastTime = 0; rafId = active.size ? requestAnimationFrame(tick) : null; return; }
  const delta = lastTime ? now - lastTime : 0;
  lastTime = now;
  for (const anim of active) anim._tick(delta, now);
  rafId = active.size ? requestAnimationFrame(tick) : null;
  if (!rafId) lastTime = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if (!hidden && active.size && !rafId) rafId = requestAnimationFrame(tick);
  });
}

export function add(anim) {
  active.add(anim);
  if (!rafId) rafId = requestAnimationFrame(tick);
}

export function remove(anim) {
  active.delete(anim);
}
