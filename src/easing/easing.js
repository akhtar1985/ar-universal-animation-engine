const c1 = 1.70158, c2 = c1 * 1.525, c3 = c1 + 1;

export const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => 1 - (1 - t) ** 2,
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2,
  easeInCubic: t => t ** 3,
  easeOutCubic: t => 1 - (1 - t) ** 3,
  easeInOutCubic: t => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
  easeInQuart: t => t ** 4,
  easeOutQuart: t => 1 - (1 - t) ** 4,
  easeInOutQuart: t => t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2,
  easeInBack: t => c3 * t ** 3 - c1 * t * t,
  easeOutBack: t => 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2,
  easeInOutBack: t => t < 0.5
    ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
    : ((2 * t - 2) ** 2 * ((c2 + 1) * (2 * t - 2) + c2) + 2) / 2,
  easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * (2 * Math.PI) / 3),
  easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
  easeOutBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

export function getEasing(name) {
  if (typeof name === 'function') return name;
  const fn = easings[name];
  if (!fn) throw new Error(`UAE: unknown easing "${name}"`);
  return fn;
}
