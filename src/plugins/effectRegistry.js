const effects = new Map();

/**
 * Register a custom effect.
 *
 * UAE.registerEffect('bounce', (target, options) => {
 *   return UAE.fromTo(target, { y: 0 }, { y: -30 }, { ...options, easing: 'easeOutElastic' });
 * });
 *
 * UAE.effect('bounce', '.box', { duration: 600 });
 */
export function registerEffect(name, fn) {
  if (typeof name !== 'string' || !name) throw new Error('UAE registerEffect: name must be a non-empty string');
  if (typeof fn !== 'function') throw new Error(`UAE registerEffect: "${name}" handler must be a function`);
  if (effects.has(name)) console.warn(`UAE registerEffect: "${name}" is being overwritten`);
  effects.set(name, fn);
}

export function runEffect(name, target, options = {}) {
  const fn = effects.get(name);
  if (!fn) throw new Error(`UAE effect: unknown effect "${name}"`);
  return fn(target, options);
}

export function hasEffect(name) { return effects.has(name); }
export function listEffects()   { return [...effects.keys()]; }
