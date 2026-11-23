import { jest } from '@jest/globals';
import { registerEffect, runEffect, hasEffect, listEffects } from '../../src/plugins/effectRegistry.js';

describe('registerEffect', () => {
  test('registers and runs an effect', () => {
    const fn = jest.fn(() => 'result');
    registerEffect('testEffect_run', fn);
    const result = runEffect('testEffect_run', '.box', { duration: 300 });
    expect(fn).toHaveBeenCalledWith('.box', { duration: 300 });
    expect(result).toBe('result');
  });

  test('throws on missing name', () => {
    expect(() => registerEffect('', () => {})).toThrow('name must be a non-empty string');
  });

  test('throws on non-function handler', () => {
    expect(() => registerEffect('bad', 'notAFunction')).toThrow('must be a function');
  });

  test('warns on overwrite', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    registerEffect('overwriteMe', () => {});
    registerEffect('overwriteMe', () => {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('runEffect', () => {
  test('throws on unknown effect', () => {
    expect(() => runEffect('doesNotExist')).toThrow('UAE effect: unknown effect');
  });
});

describe('hasEffect / listEffects', () => {
  test('hasEffect returns true after registration', () => {
    registerEffect('checkMe', () => {});
    expect(hasEffect('checkMe')).toBe(true);
  });

  test('listEffects includes registered name', () => {
    registerEffect('listMe', () => {});
    expect(listEffects()).toContain('listMe');
  });
});
