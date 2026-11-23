export const presets = {
  fadeIn:      { from: { opacity: 0 },              to: { opacity: 1 } },
  fadeOut:     { from: { opacity: 1 },              to: { opacity: 0 } },
  slideUp:     { from: { opacity: 0, y: 40 },       to: { opacity: 1, y: 0 } },
  slideDown:   { from: { opacity: 0, y: -40 },      to: { opacity: 1, y: 0 } },
  slideLeft:   { from: { opacity: 0, x: 40 },       to: { opacity: 1, x: 0 } },
  slideRight:  { from: { opacity: 0, x: -40 },      to: { opacity: 1, x: 0 } },
  zoomIn:      { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
  zoomOut:     { from: { opacity: 1, scale: 1 },    to: { opacity: 0, scale: 0.85 } },
};

export function getPreset(name) {
  const p = presets[name];
  if (!p) throw new Error(`UAE: unknown preset "${name}"`);
  return p;
}
