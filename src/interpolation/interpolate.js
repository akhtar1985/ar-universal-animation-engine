const HEX = /^#([0-9a-f]{3,8})$/i;
const RGB = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/;

function parseColor(v) {
  let m = v.match(HEX);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  m = v.match(RGB);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}

function isColor(v) { return typeof v === 'string' && (HEX.test(v) || RGB.test(v)); }

const UNIT = /^(-?[\d.]+)([a-z%]*)$/i;
const INSET = /inset\(([^)]+)\)/;

function interpolateInset(from, to, t) {
  const fa = from.match(INSET)?.[1].trim().split(/\s+/) ?? [];
  const ta = to.match(INSET)?.[1].trim().split(/\s+/) ?? [];
  const parts = fa.map((f, i) => {
    const mf = f.match(UNIT), mt = (ta[i] ?? f).match(UNIT);
    if (mf && mt) return `${+mf[1] + (+mt[1] - +mf[1]) * t}${mt[2] || mf[2]}`;
    return t < 1 ? f : ta[i] ?? f;
  });
  return `inset(${parts.join(' ')})`;
}

export function interpolate(from, to, t) {
  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * t;
  }
  if (isColor(from) && isColor(to)) {
    const a = parseColor(from), b = parseColor(to);
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r},${g},${bl})`;
  }
  if (typeof from === 'string' && typeof to === 'string') {
    if (from.startsWith('inset') && to.startsWith('inset')) return interpolateInset(from, to, t);
    const mf = from.match(UNIT), mt = to.match(UNIT);
    if (mf && mt) {
      const val = +mf[1] + (+mt[1] - +mf[1]) * t;
      return `${val}${mt[2] || mf[2]}`;
    }
  }
  return t < 1 ? from : to;
}
