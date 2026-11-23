/**
 * Studio state — plain observable object.
 * All components read from and write to this; the preview reacts to changes.
 */
export const state = {
  target: '.preview-box',
  preset: 'fadeIn',
  duration: 600,
  delay: 0,
  easing: 'easeOutCubic',
  fromVars: {},
  toVars: {},
  usePreset: true,

  _listeners: new Set(),

  subscribe(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); },

  update(patch) {
    Object.assign(this, patch);
    for (const fn of this._listeners) fn({ ...this });
  },
};
