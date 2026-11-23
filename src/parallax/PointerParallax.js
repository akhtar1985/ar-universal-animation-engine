import { add, remove } from '../scheduler/scheduler.js';
import { reducedMotion } from '../interactions/reducedMotion.js';
import { warn } from '../utils/warn.js';

export class PointerParallax {
  constructor(container, layers, options = {}) {
    this._container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this._container) { warn('PointerParallax: container not found', container); return; }

    // layers: [{ target, depth }]  depth 1 = full movement, 0 = none
    this._layers = layers.map(l => ({
      el: typeof l.target === 'string' ? document.querySelector(l.target) : l.target,
      depth: l.depth ?? 1,
    })).filter(l => l.el);

    this._strength = options.strength ?? 30;  // max px offset at depth 1
    this._ease     = options.ease     ?? 0.1; // lerp factor per frame
    this._mx = 0; this._my = 0;
    this._cx = 0; this._cy = 0;
    this._running = false;

    if (reducedMotion()) return;

    this._onMove = (e) => {
      const rect = this._container.getBoundingClientRect();
      // normalized -1 to 1
      this._mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      this._my = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      if (!this._running) { this._running = true; add(this); }
    };

    this._onLeave = () => { this._mx = 0; this._my = 0; };

    this._container.addEventListener('mousemove', this._onMove, { passive: true });
    this._container.addEventListener('mouseleave', this._onLeave);
  }

  _tick() {
    this._cx += (this._mx - this._cx) * this._ease;
    this._cy += (this._my - this._cy) * this._ease;

    for (const { el, depth } of this._layers) {
      const x = this._cx * this._strength * depth;
      const y = this._cy * this._strength * depth;
      el.style.transform = `translate(${x}px, ${y}px)`;
    }

    // keep ticking until settled
    const settled = Math.abs(this._mx - this._cx) < 0.001 && Math.abs(this._my - this._cy) < 0.001;
    if (settled) { this._running = false; remove(this); }
    else add(this);
  }

  destroy() {
    this._container.removeEventListener('mousemove', this._onMove);
    this._container.removeEventListener('mouseleave', this._onLeave);
    remove(this);
    for (const { el } of this._layers) el.style.transform = '';
  }
}
