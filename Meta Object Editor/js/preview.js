// js/preview.js
/**
 * Module: Builds live preview form based on schema and selected type.
 */
import { state } from './utils.js';

export function initPreviewModule() {
  const container = document.getElementById('previewTab');
  container.innerHTML = `
    <div class="controls">
      <label>Select Object Type:</label>
      <select id="previewTypeSelect"></select>
    </div>
    <form id="previewForm"></form>
  `;
  document.addEventListener('show:preview', () => refreshPreview());
}

function refreshPreview() {
  const sel = document.getElementById('previewTypeSelect');
  sel.innerHTML = '';
  state.metaTypes.forEach(t => sel.add(new Option(t.name, t.id)));
  sel.onchange = render;
  if(sel.options.length){ sel.selectedIndex=0; render(); }
}

function render() {
  const typeId = document.getElementById('previewTypeSelect').value;
  const form   = document.getElementById('previewForm'); form.innerHTML='';
  // Grouping and accordion building exactly as original
}