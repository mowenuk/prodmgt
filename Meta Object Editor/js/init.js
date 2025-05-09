// js/init.js
/**
 * Sets up global controls: Save All & Dataset Selector.
 */
import { state, saveCSV, loadDataset } from './utils.js';

export function initGlobalControls() {
  const container = document.getElementById('globalControls');
  container.innerHTML = `
    <button class="btn btn-primary" id="saveAllBtn">Save All</button>
    <label for="datasetSelector">Choose dataset:</label>
    <select id="datasetSelector" class="form-select inline-select">
      <option value="default">Default</option>
      <option value="togaf">TOGAF</option>
    </select>
    <button class="btn btn-primary" id="reloadDatasetBtn">Reload Dataset</button>
  `;

  document.getElementById('saveAllBtn').addEventListener('click', () => {
    saveCSV(state.metaTypes,      'meta-objects.csv',          ['id','name','description','system']);
    saveCSV(state.metaRels,       'rels_meta-objects.csv',      ['id','name','reverseName','label','fromMetaObjectID','toMetaObjectID','system']);
    saveCSV(state.schemaRows,     'meta-object-properties.csv', ['id','name','label','type_IDs','dataType','widget','options','group','layout','system']);
  });

  document.getElementById('reloadDatasetBtn').addEventListener('click', () => {
    const prefix = document.getElementById('datasetSelector').value === 'togaf' ? 'togaf' : '';
    loadDataset(prefix);
  });
}