import { jest } from '@jest/globals';
import { registerPlugin, getPlugin, listPlugins, callHook } from '../../src/plugins/pluginRegistry.js';

// isolate registry between tests by using unique names
let counter = 0;
const uid = () => `testPlugin_${counter++}`;

describe('registerPlugin', () => {
  test('registers a valid plugin', () => {
    const name = uid();
    registerPlugin({ name, version: '1.0' });
    expect(getPlugin(name)).not.toBeNull();
  });

  test('throws if name is missing', () => {
    expect(() => registerPlugin({ version: '1.0' })).toThrow('missing required field "name"');
  });

  test('throws if version is missing', () => {
    expect(() => registerPlugin({ name: uid() })).toThrow('missing required field "version"');
  });

  test('warns but does not throw on duplicate', () => {
    const name = uid();
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    registerPlugin({ name, version: '1.0' });
    registerPlugin({ name, version: '1.0' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('listPlugins', () => {
  test('returns name and version', () => {
    const name = uid();
    registerPlugin({ name, version: '2.0' });
    const found = listPlugins().find(p => p.name === name);
    expect(found).toEqual({ name, version: '2.0' });
  });
});

describe('callHook', () => {
  test('calls matching hook on registered plugin', () => {
    const name = uid();
    const fn = jest.fn();
    registerPlugin({ name, version: '1.0', onAnimationCreate: fn });
    callHook('onAnimationCreate', { fake: true });
    expect(fn).toHaveBeenCalledWith({ fake: true });
  });

  test('does not throw if plugin hook throws', () => {
    const name = uid();
    registerPlugin({ name, version: '1.0', onAnimationCreate: () => { throw new Error('boom'); } });
    expect(() => callHook('onAnimationCreate')).not.toThrow();
  });
});
