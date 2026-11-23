import { state } from '../state/studioState.js';

export function mountExporter(containerEl) {
  containerEl.innerHTML = `
    <div class="studio-export">
      <button data-action="export">Export code</button>
      <pre class="export-output" style="display:none"></pre>
      <button data-action="copy" style="display:none">Copy</button>
    </div>
  `;

  const pre  = containerEl.querySelector('.export-output');
  const copy = containerEl.querySelector('[data-action=copy]');

  containerEl.addEventListener('click', e => {
    if (e.target.dataset.action === 'export') {
      pre.textContent = generateCode(state);
      pre.style.display = 'block';
      copy.style.display = 'inline-block';
    }
    if (e.target.dataset.action === 'copy') {
      navigator.clipboard?.writeText(pre.textContent);
    }
  });
}

function generateCode(s) {
  const opts = `{\n  duration: ${s.duration},\n  delay: ${s.delay},\n  easing: '${s.easing}',\n}`;

  if (s.usePreset) {
    return `import UAE from './src/index.js';\n\nUAE.animate('${s.target}', '${s.preset}', ${opts});`;
  }

  const from = JSON.stringify(s.fromVars, null, 2);
  const to   = JSON.stringify(s.toVars,   null, 2);
  return `import UAE from './src/index.js';\n\nUAE.fromTo('${s.target}',\n  ${from},\n  ${to},\n  ${opts}\n);`;
}
