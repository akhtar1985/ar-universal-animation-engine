import UAE from '../../../src/index.js';
import { state } from '../state/studioState.js';

let currentAnim = null;

export function mountPreview(containerEl) {
  const box = containerEl.querySelector('.preview-box');
  if (!box) return;

  function run() {
    currentAnim?.destroy();

    if (state.usePreset) {
      currentAnim = UAE.animate(box, state.preset, {
        duration: state.duration,
        delay: state.delay,
        easing: state.easing,
        autoplay: true,
      });
    } else {
      currentAnim = UAE.fromTo(box, state.fromVars, state.toVars, {
        duration: state.duration,
        delay: state.delay,
        easing: state.easing,
        autoplay: true,
      });
    }
  }

  state.subscribe(run);
  run();

  return {
    replay() { run(); },
    destroy() { currentAnim?.destroy(); },
  };
}
