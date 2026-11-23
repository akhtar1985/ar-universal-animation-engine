import { jest } from '@jest/globals';
import { add, remove } from '../../src/scheduler/scheduler.js';

// Mock requestAnimationFrame in Node
global.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
global.cancelAnimationFrame  = id => clearTimeout(id);

describe('scheduler', () => {
  test('calls _tick on registered object', done => {
    const obj = { _tick: jest.fn() };
    add(obj);
    setTimeout(() => {
      expect(obj._tick).toHaveBeenCalled();
      remove(obj);
      done();
    }, 50);
  });

  test('does not call _tick after remove', done => {
    const obj = { _tick: jest.fn() };
    add(obj);
    remove(obj);
    const callsBefore = obj._tick.mock.calls.length;
    setTimeout(() => {
      expect(obj._tick.mock.calls.length).toBe(callsBefore);
      done();
    }, 50);
  });

  test('handles multiple objects independently', done => {
    const a = { _tick: jest.fn() };
    const b = { _tick: jest.fn() };
    add(a); add(b);
    setTimeout(() => {
      expect(a._tick).toHaveBeenCalled();
      expect(b._tick).toHaveBeenCalled();
      remove(a); remove(b);
      done();
    }, 50);
  });
});
