const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Particle system drawable — register with a CanvasRenderer.
 *
 * const renderer = new CanvasRenderer('#canvas');
 * const particles = new ParticleSystem(renderer, { count: 120, color: '#fff' });
 */
class ParticleSystem {
  constructor(renderer, options = {}) {
    this._renderer = renderer;
    this._opts = {
      count:      options.count      ?? 80,
      color:      options.color      ?? '#ffffff',
      minSize:    options.minSize    ?? 2,
      maxSize:    options.maxSize    ?? 5,
      minSpeed:   options.minSpeed   ?? 0.2,
      maxSpeed:   options.maxSpeed   ?? 1.2,
      minLife:    options.minLife    ?? 60,   // frames
      maxLife:    options.maxLife    ?? 180,
      spawnRate:  options.spawnRate  ?? 2,    // particles per frame
      gravity:    options.gravity    ?? 0,
      fade:       options.fade       !== false,
      origin:     options.origin     ?? null, // { x, y } in px, null = random
    };

    this._particles = [];
    this._frame = 0;

    if (!reducedMotion()) renderer.add(this);
  }

  _spawn(w, h) {
    const o = this._opts;
    const ox = o.origin ? o.origin.x : rand(0, w);
    const oy = o.origin ? o.origin.y : rand(0, h);
    const angle = rand(0, Math.PI * 2);
    const speed = rand(o.minSpeed, o.maxSpeed);
    return {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: rand(o.minSize, o.maxSize),
      life: 0,
      maxLife: rand(o.minLife, o.maxLife),
      color: o.color,
    };
  }

  draw(ctx, w, h) {
    const o = this._opts;
    this._frame++;

    // spawn
    for (let i = 0; i < o.spawnRate && this._particles.length < o.count; i++) {
      this._particles.push(this._spawn(w, h));
    }

    // update + draw
    this._particles = this._particles.filter(p => {
      p.life++;
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += o.gravity;

      const progress = p.life / p.maxLife;
      if (progress >= 1) return false;

      ctx.save();
      ctx.globalAlpha = o.fade ? 1 - progress : 1;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      return true;
    });
  }

  /** Change options at runtime */
  set(opts) { Object.assign(this._opts, opts); return this; }

  destroy() {
    this._renderer.remove(this);
    this._particles = [];
  }
}

export { ParticleSystem };
//# sourceMappingURL=particles.js.map
