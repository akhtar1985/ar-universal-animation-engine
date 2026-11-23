const TRANSFORM_PROPS = new Set(['x', 'y', 'z', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'perspective']);

const TRANSFORM_DEFAULTS = { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, perspective: 0 };

function buildTransform(map) {
  const parts = [];
  const x = map.x ?? 0, y = map.y ?? 0, z = map.z ?? 0;
  if (x || y || z) parts.push(`translate3d(${x}px,${y}px,${z}px)`);
  if (map.rotate) parts.push(`rotate(${map.rotate}deg)`);
  if (map.rotateX) parts.push(`rotateX(${map.rotateX}deg)`);
  if (map.rotateY) parts.push(`rotateY(${map.rotateY}deg)`);
  if (map.rotateZ) parts.push(`rotateZ(${map.rotateZ}deg)`);
  const sx = map.scaleX ?? map.scale ?? 1, sy = map.scaleY ?? map.scale ?? 1;
  if (sx !== 1 || sy !== 1) parts.push(`scale(${sx},${sy})`);
  if (map.skewX) parts.push(`skewX(${map.skewX}deg)`);
  if (map.skewY) parts.push(`skewY(${map.skewY}deg)`);
  if (map.perspective) parts.unshift(`perspective(${map.perspective}px)`);
  return parts.join(' ') || 'none';
}

export function applyValues(el, values) {
  const transforms = {};
  let hasTransform = false;

  for (const [prop, val] of Object.entries(values)) {
    if (TRANSFORM_PROPS.has(prop)) {
      transforms[prop] = val;
      hasTransform = true;
    } else {
      el.style[prop] = val;
    }
  }

  if (hasTransform) {
    el.style.transform = buildTransform(transforms);
  }
}

export function readInitial(el, props) {
  const computed = getComputedStyle(el);
  const result = {};
  for (const prop of props) {
    if (TRANSFORM_PROPS.has(prop)) {
      result[prop] = TRANSFORM_DEFAULTS[prop];
    } else {
      result[prop] = computed[prop] || '0';
    }
  }
  return result;
}
