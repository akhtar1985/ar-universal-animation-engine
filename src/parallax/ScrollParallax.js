import { add, remove } from '../scheduler/scheduler.js';
import { reducedMotion } from '../interactions/reducedMotion.js';
import { warn } from '../utils/warn.js';

export class ScrollParallax {
  constructor(target, options = {}) {
    this._el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._el) { warn('ScrollParallax: target not found', target); return; }

    this._speed  = options.speed  ?? 0.3;   // 0 = no movement, 1 = moves with scroll
    this._axis   = options.axis   ?? 'y';    // 'x' | 'y'
    this._origin = options.origin ?? 0.5;    // 0=top 1=bottom of viewport as reference
    this._clamp  = options.clamp  ?? false;
    this._active = false;
    this._scrollY = 0;
    this._ticking = false;

    if (reducedMotion()) return;

    this._onScroll = () => {
      this._scrollY = window.scrollY;
      if (!this._ticking) {
        this._ticking = true;
        add(this);
      }
    };

    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  }

  _tick() {
    const rect = this._el.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = rect.top + rect.height * 0.5;
    const offset = (center - vh * this._origin) * this._speed;
    const val = this._clamp
      ? Math.max(-vh * this._speed, Math.min(vh * this._speed, offset))
      : offset;

    this._el.style.transform = this._axis === 'x'
      ? `translateX(${val}px)`
      : `translateY(${val}px)`;

    this._ticking = false;
    remove(this);
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    remove(this);
    this._el.style.transform = '';
  }
}
