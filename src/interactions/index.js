export { hover }        from './hover.js';
export { click }        from './click.js';
export { intersection } from './intersection.js';
export { scroll }       from './scroll.js';
export { pointer }      from './pointer.js';
export { keyboard }     from './keyboard.js';

import { hover }        from './hover.js';
import { click }        from './click.js';
import { intersection } from './intersection.js';
import { scroll }       from './scroll.js';
import { pointer }      from './pointer.js';
import { keyboard }     from './keyboard.js';

const triggers = { hover, click, intersection, scroll, pointer, keyboard };

/**
 * createInteraction('hover', target, animation, options)
 * Returns a handle with destroy() for cleanup.
 */
export function createInteraction(type, target, animation, options = {}) {
  const fn = triggers[type];
  if (!fn) throw new Error(`UAE: unknown interaction type "${type}"`);
  return fn(target, animation, options);
}
