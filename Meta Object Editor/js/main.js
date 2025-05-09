// js/main.js
/**
 * Entry point: initialize tabs, global controls, and modules
 */
import { initTabs } from './tabs.js';
import { initGlobalControls } from './init.js';
import { initTypesModule } from './types.js';
import { initRelsModule } from './relationships.js';
import { initSchemaModule } from './schema.js';
import { initPreviewModule } from './preview.js';
import { loadTypesFromData, loadRelsFromData, loadSchemaFromData, autoLoadCSV, getFilename } from './utils.js';

// Provide callbacks for utils
import { load Dataset } from './utils.js';

// Wire parse callbacks\Exporter.loadTypesFromData = data => { state.metaTypes = data.map(r=>({...})); document.dispatchEvent(new Event('show:types')); };
// similarly for loadRelsFromData, loadSchemaFromData



document.addEventListener('DOMContentLoaded', () => {
  initTabs([ 'types','relationships','schema','preview' ]);
  initGlobalControls();
  initTypesModule();
  initRelsModule();
  initSchemaModule();
  initPreviewModule();

  // Auto-load default dataset
  [
    ['meta-objects.csv',  loadTypesFromData],
    ['rels_meta-objects.csv', loadRelsFromData],
    ['meta-object-properties.csv', loadSchemaFromData]
  ].forEach(([file, cb]) => {
    autoLoadCSV(getFilename(file), cb);
  });
});