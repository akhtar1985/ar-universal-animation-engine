const REQUIRED_FIELDS = ['name', 'version'];
const registry = new Map();

/**
 * A plugin must have:
 *   name: string
 *   version: string
 * And any of these optional hooks:
 *   install(UAE)           — called once on registration, receives the public API
 *   onAnimationCreate(anim) — called when any Animation is constructed
 *   onAnimationComplete(anim)
 *   onTick(anim, progress)
 */
export function registerPlugin(plugin) {
  for (const field of REQUIRED_FIELDS) {
    if (!plugin[field]) throw new Error(`UAE plugin: missing required field "${field}"`);
  }
  if (registry.has(plugin.name)) {
    console.warn(`UAE plugin: "${plugin.name}" is already registered, skipping`);
    return;
  }
  registry.set(plugin.name, plugin);
}

export function getPlugin(name) {
  return registry.get(name) ?? null;
}

export function listPlugins() {
  return [...registry.values()].map(p => ({ name: p.name, version: p.version }));
}

export function callHook(hook, ...args) {
  for (const plugin of registry.values()) {
    if (typeof plugin[hook] === 'function') {
      try { plugin[hook](...args); }
      catch (e) { console.error(`UAE plugin "${plugin.name}" hook "${hook}" threw:`, e); }
    }
  }
}
