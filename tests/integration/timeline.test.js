import { jest } from '@jest/globals';
global.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
global.cancelAnimationFrame  = id => clearTimeout(id);
global.document = { querySelectorAll: () => [] };

import { Timeline } from '../../src/core/Timeline.js';

function makeTl(opts = {}) {
  return new Timeline({ autoplay: false, ...opts });
}

describe('Timeline — add and duration', () => {
  test('duration grows with each add', () => {
    const tl = makeTl();
    tl.add([], {}, { opacity: 1 }, { duration: 300 });
    expect(tl.duration).toBe(300);
    tl.add([], {}, { opacity: 1 }, { duration: 200 });
    expect(tl.duration).toBe(500);
  });

  test('overlap with -= reduces duration', () => {
    const tl = makeTl();
    tl.add([], {}, { opacity: 1 }, { duration: 400 });
    tl.add([], {}, { opacity: 1 }, { duration: 300 }, '-=100');
    expect(tl.duration).toBe(600);
  });

  test('absolute position', () => {
    const tl = makeTl();
    tl.add([], {}, { opacity: 1 }, { duration: 200 }, 500);
    expect(tl.duration).toBe(700);
  });
});

describe('Timeline — labels', () => {
  test('addLabel stores time', () => {
    const tl = makeTl();
    tl.add([], {}, {}, { duration: 300 });
    tl.addLabel('mid');
    expect(tl._labels['mid']).toBe(300);
  });

  test('seekToLabel warns on unknown label', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const tl = makeTl();
    tl.seekToLabel('ghost');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Timeline — state', () => {
  test('starts idle', () => expect(makeTl().state).toBe('idle'));

  test('play sets running', () => {
    const tl = makeTl();
    tl.play();
    expect(tl.state).toBe('running');
    tl.pause();
  });

  test('pause sets paused', () => {
    const tl = makeTl();
    tl.play();
    tl.pause();
    expect(tl.state).toBe('paused');
  });
});

describe('Timeline — callbacks', () => {
  test('onComplete fires when elapsed reaches duration', () => {
    const onComplete = jest.fn();
    const tl = makeTl({ onComplete });
    tl.add([], { opacity: 0 }, { opacity: 1 }, { duration: 100 });
    tl.play();
    tl._tick(200); // advance past end
    expect(onComplete).toHaveBeenCalled();
  });
});
