import { presets, getPreset } from '../../src/presets/presets.js';

describe('presets', () => {
  test('all presets have from and to', () => {
    for (const [name, p] of Object.entries(presets)) {
      expect(p).toHaveProperty('from');
      expect(p).toHaveProperty('to');
    }
  });

  test('fadeIn has opacity', () => {
    expect(presets.fadeIn.from.opacity).toBe(0);
    expect(presets.fadeIn.to.opacity).toBe(1);
  });

  test('slideUp has y', () => {
    expect(presets.slideUp.from).toHaveProperty('y');
    expect(presets.slideUp.to.y).toBe(0);
  });

  test('zoomIn has scale', () => {
    expect(presets.zoomIn.from.scale).toBeLessThan(1);
    expect(presets.zoomIn.to.scale).toBe(1);
  });
});

describe('getPreset', () => {
  test('returns preset by name', () => {
    const p = getPreset('fadeIn');
    expect(p).toHaveProperty('from');
    expect(p).toHaveProperty('to');
  });

  test('throws on unknown preset', () => {
    expect(() => getPreset('notReal')).toThrow('UAE: unknown preset');
  });
});
