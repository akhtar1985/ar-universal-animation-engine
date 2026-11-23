import { easings, getEasing } from '../../src/easing/easing.js';

describe('easings', () => {
  const names = Object.keys(easings);

  test.each(names)('%s(0) === 0', name => {
    expect(easings[name](0)).toBeCloseTo(0, 5);
  });

  test.each(names)('%s(1) === 1', name => {
    expect(easings[name](1)).toBeCloseTo(1, 5);
  });

  test.each(names)('%s output is a number', name => {
    expect(typeof easings[name](0.5)).toBe('number');
  });
});

describe('getEasing', () => {
  test('returns function by name', () => {
    expect(typeof getEasing('linear')).toBe('function');
  });

  test('passes through custom function', () => {
    const fn = t => t * 2;
    expect(getEasing(fn)).toBe(fn);
  });

  test('throws on unknown name', () => {
    expect(() => getEasing('notReal')).toThrow('UAE: unknown easing');
  });
});
