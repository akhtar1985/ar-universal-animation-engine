import { interpolate } from '../../src/interpolation/interpolate.js';

describe('interpolate — numeric', () => {
  test('midpoint', () => expect(interpolate(0, 100, 0.5)).toBe(50));
  test('start',    () => expect(interpolate(0, 100, 0)).toBe(0));
  test('end',      () => expect(interpolate(0, 100, 1)).toBe(100));
  test('negative', () => expect(interpolate(-50, 50, 0.5)).toBe(0));
});

describe('interpolate — hex color', () => {
  test('black to white midpoint', () => {
    expect(interpolate('#000000', '#ffffff', 0.5)).toBe('rgb(128,128,128)');
  });
  test('shorthand hex', () => {
    const result = interpolate('#000', '#fff', 1);
    expect(result).toBe('rgb(255,255,255)');
  });
});

describe('interpolate — rgb color', () => {
  test('rgb midpoint', () => {
    expect(interpolate('rgb(0,0,0)', 'rgb(100,100,100)', 0.5)).toBe('rgb(50,50,50)');
  });
});

describe('interpolate — unit strings', () => {
  test('px values', () => expect(interpolate('0px', '100px', 0.5)).toBe('50px'));
  test('percent',   () => expect(interpolate('0%',  '100%',  0.5)).toBe('50%'));
  test('em values', () => expect(interpolate('1em', '3em',   0.5)).toBe('2em'));
});

describe('interpolate — inset clip-path', () => {
  test('inset midpoint', () => {
    const result = interpolate('inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)', 0.5);
    expect(result).toBe('inset(0% 50% 0% 0%)');
  });
});

describe('interpolate — fallback', () => {
  test('returns to value at t=1 for non-interpolable', () => {
    expect(interpolate('auto', 'none', 1)).toBe('none');
  });
  test('returns from value at t=0 for non-interpolable', () => {
    expect(interpolate('auto', 'none', 0)).toBe('auto');
  });
});
