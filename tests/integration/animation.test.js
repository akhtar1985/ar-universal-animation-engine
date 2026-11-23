import { jest } from '@jest/globals';
// Mock browser APIs needed by Animation
global.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
global.cancelAnimationFrame  = id => clearTimeout(id);
global.document = {
  querySelectorAll: () => [],
};

import { Animation } from '../../src/core/Animation.js';

function makeAnim(overrides = {}) {
  return new Animation(
    [],                          // empty targets — no DOM needed
    { opacity: 0 },
    { opacity: 1 },
    { duration: 200, autoplay: false, ...overrides }
  );
}

describe('Animation — state machine', () => {
  test('starts in idle when autoplay false', () => {
    expect(makeAnim().state).toBe('idle');
  });

  test('transitions to running on play()', () => {
    const a = makeAnim();
    a.play();
    expect(a.state).toBe('running');
    a.cancel();
  });

  test('transitions to paused on pause()', () => {
    const a = makeAnim();
    a.play();
    a.pause();
    expect(a.state).toBe('paused');
    a.cancel();
  });

  test('transitions to finished on finish()', () => {
    const a = makeAnim();
    a.play();
    a.finish();
    expect(a.state).toBe('finished');
  });

  test('transitions to cancelled on cancel()', () => {
    const a = makeAnim();
    a.play();
    a.cancel();
    expect(a.state).toBe('cancelled');
  });
});

describe('Animation — seek', () => {
  test('seek clamps to 0–1', () => {
    const a = makeAnim();
    a._initialValues = { opacity: 0 };
    a.seek(-1);
    expect(a._elapsed).toBeGreaterThanOrEqual(0);
    a.seek(99);
    expect(a._elapsed).toBeLessThanOrEqual(a.duration + a.delay);
  });
});

describe('Animation — callbacks', () => {
  test('onComplete fires on finish()', () => {
    const onComplete = jest.fn();
    const a = makeAnim({ onComplete });
    a._initialValues = { opacity: 0 };
    a.play();
    a.finish();
    expect(onComplete).toHaveBeenCalled();
  });
});

describe('Animation — destroy', () => {
  test('clears targets after destroy()', () => {
    const a = makeAnim();
    a.destroy();
    expect(a.targets).toHaveLength(0);
  });
});
