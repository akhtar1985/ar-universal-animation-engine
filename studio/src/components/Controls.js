import { state } from '../state/studioState.js';
import { easings } from '../../../src/easing/easing.js';
import { presets } from '../../../src/presets/presets.js';

export function mountControls(containerEl) {
  containerEl.innerHTML = `
    <div class="studio-controls">
      <label>Mode
        <select data-key="usePreset">
          <option value="preset">Preset</option>
          <option value="custom">Custom fromTo</option>
        </select>
      </label>

      <label class="preset-row">Preset
        <select data-key="preset">
          ${Object.keys(presets).map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </label>

      <label>Duration (ms)
        <input type="number" data-key="duration" min="0" max="10000" step="50" value="${state.duration}">
      </label>

      <label>Delay (ms)
        <input type="number" data-key="delay" min="0" max="5000" step="50" value="${state.delay}">
      </label>

      <label>Easing
        <select data-key="easing">
          ${Object.keys(easings).map(e => `<option value="${e}">${e}</option>`).join('')}
        </select>
      </label>

      <label class="custom-row" style="display:none">From (JSON)
        <textarea data-key="fromVars" rows="3">{}</textarea>
      </label>

      <label class="custom-row" style="display:none">To (JSON)
        <textarea data-key="toVars" rows="3">{"opacity":1,"y":0}</textarea>
      </label>

      <button data-action="replay">▶ Replay</button>
    </div>
  `;

  const el = containerEl.querySelector('.studio-controls');

  el.addEventListener('change', e => {
    const key = e.target.dataset.key;
    if (!key) return;

    if (key === 'usePreset') {
      const isPreset = e.target.value === 'preset';
      state.update({ usePreset: isPreset });
      el.querySelectorAll('.preset-row').forEach(r => r.style.display = isPreset ? '' : 'none');
      el.querySelectorAll('.custom-row').forEach(r => r.style.display = isPreset ? 'none' : '');
      return;
    }

    if (key === 'fromVars' || key === 'toVars') {
      try { state.update({ [key]: JSON.parse(e.target.value) }); } catch {}
      return;
    }

    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    state.update({ [key]: val });
  });

  el.addEventListener('click', e => {
    if (e.target.dataset.action === 'replay') state.update({});
  });
}
