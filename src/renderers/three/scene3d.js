import { Animation } from '../../core/Animation.js';
import { warn } from '../../utils/warn.js';
/**
 * scene3d(container) sets up a 3D perspective
 * on a container element.
 * Returns a scene object with animate3d() for animating children in 3D space.
 *
 * UAE.scene3d('.stage', { perspective: 800 })
 *   .animate3d('.card', { rotateY: 0 }, { rotateY: 180 }, { duration: 600 })
 */
export function scene3d(container, options = {}) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) { warn('scene3d: container not found', container); return null; }

  const perspective     = options.perspective     ?? 800;
  const perspectiveOrigin = options.perspectiveOrigin ?? '50% 50%';

  el.style.perspective       = `${perspective}px`;
  el.style.perspectiveOrigin = perspectiveOrigin;

  return {
    /**
     * Animate a child element in 3D space.
     * Automatically applies transform-style: preserve-3d to the target.
     */
    animate3d(target, fromVars, toVars, animOptions = {}) {
      const child = typeof target === 'string' ? el.querySelector(target) : target;
      if (!child) { warn('scene3d.animate3d: target not found', target); return null; }

      child.style.transformStyle = 'preserve-3d';

      if (animOptions.backfaceHidden !== false) {
        child.style.backfaceVisibility = 'hidden';
      }

      return new Animation(child, fromVars, toVars, animOptions);
    },

    /** Remove perspective from the container. */
    destroy() {
      el.style.perspective       = '';
      el.style.perspectiveOrigin = '';
    }
  };
}
