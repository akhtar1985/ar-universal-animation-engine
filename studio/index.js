import { mountPreview }  from './src/components/Preview.js';
import { mountControls } from './src/components/Controls.js';
import { mountScrubber } from './src/components/Scrubber.js';
import { mountExporter } from './src/components/Exporter.js';

export function mountStudio(rootEl) {
  rootEl.innerHTML = `
    <div class="uae-studio">
      <aside class="studio-sidebar" id="studio-controls"></aside>
      <main class="studio-main">
        <div class="studio-preview" id="studio-preview">
          <div class="preview-box"></div>
        </div>
        <div id="studio-scrubber"></div>
        <div id="studio-exporter"></div>
      </main>
    </div>
  `;

  const preview = mountPreview(rootEl.querySelector('#studio-preview'));
  mountControls(rootEl.querySelector('#studio-controls'));
  mountScrubber(rootEl.querySelector('#studio-scrubber'), preview);
  mountExporter(rootEl.querySelector('#studio-exporter'));

  return { destroy() { preview?.destroy(); } };
}
