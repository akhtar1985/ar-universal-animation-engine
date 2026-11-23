// SVG presentation attributes that must be set via setAttribute, not style
const SVG_ATTRS = new Set([
  'cx', 'cy', 'r', 'rx', 'ry',
  'x', 'y', 'x1', 'y1', 'x2', 'y2',
  'width', 'height',
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'fill-opacity', 'stroke-opacity',
  'points', 'd',
]);

const SVG_TRANSFORM = new Set(['translateX', 'translateY', 'rotate', 'scale', 'skewX', 'skewY']);

function isSVG(el) {
  return el instanceof SVGElement;
}

function buildSVGTransform(map) {
  const parts = [];
  const tx = map.translateX ?? 0, ty = map.translateY ?? 0;
  if (tx || ty) parts.push(`translate(${tx} ${ty})`);
  if (map.rotate  !== null) parts.push(`rotate(${map.rotate})`);
  if (map.scale   !== null) parts.push(`scale(${map.scale})`);
  if (map.skewX   !== null) parts.push(`skewX(${map.skewX})`);
  if (map.skewY   !== null) parts.push(`skewY(${map.skewY})`);
  return parts.join(' ') || '';
}

export function applySVGValues(el, values) {
  if (!isSVG(el)) return false;

  const transforms = {};
  let hasTransform = false;

  for (const [prop, val] of Object.entries(values)) {
    if (SVG_TRANSFORM.has(prop)) {
      transforms[prop] = val;
      hasTransform = true;
    } else if (SVG_ATTRS.has(prop)) {
      el.setAttribute(prop, val);
    } else {
      el.style[prop] = val;
    }
  }

  if (hasTransform) {
    const t = buildSVGTransform(transforms);
    if (t) el.setAttribute('transform', t);
  }

  return true;
}

export function readSVGInitial(el, props) {
  const result = {};
  for (const prop of props) {
    if (SVG_TRANSFORM.has(prop)) {
      result[prop] = prop === 'scale' ? 1 : 0;
    } else if (SVG_ATTRS.has(prop)) {
      result[prop] = el.getAttribute(prop) ?? '0';
    } else {
      result[prop] = getComputedStyle(el)[prop] ?? '0';
    }
  }
  return result;
}
