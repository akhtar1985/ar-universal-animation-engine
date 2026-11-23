import { state } from '../state/studioState.js';

let _preview = null;

export function mountScrubber(containerEl, previewHandle) {
  _preview = previewHandle;

  containerEl.innerHTML = `
    <div class="studio-scrubber">
      <span>0ms</span>
      <input type="range" min="0" max="1000" step="1" value="0" style="flex:1">
      <span class="scrub-label">0ms</span>
    </div>
  `;

  const range = containerEl.querySelector('input[type=range]');
  const label = containerEl.querySelector('.scrub-label');

  // keep max in sync with duration
  state.subscribe(s => { range.max = s.duration; });

  range.addEventListener('input', () => {
    const ms = Number(range.value);
    label.textContent = `${ms}ms`;
    // pause and seek current animation via preview
    _preview?.seekMs(ms);
  });
}
