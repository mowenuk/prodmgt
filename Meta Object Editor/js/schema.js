// js/schema.js
/**
 * Module: Schema Attributes CRUD, example widgets toggle.
 */
import Papa from 'papaparse';
import JustGage from 'justgage';
import { state } from './utils.js';

// Mappings and options (as in original script)
const dataTypeOptions = ['short text','long text','integer','date','percentage','boolean'];
const widgetsByDataType = { /* same mapping object */ };
const widgetHelpText = { /* same help text object */ };
const userOptionWidgets = [ /* same array */ ];
const layoutOptions = [ /* same array */ ];

export function initSchemaModule() {
  const container = document.getElementById('schemaTab');
  container.innerHTML = `
    <div class="controls">
      <input type="file" id="schemaFile" accept=".csv">
      <button class="btn btn-primary" id="loadSchemaBtn">Load Properties</button>
      <button class="btn btn-primary" id="addSchemaBtn">Add Attribute</button>
      <button class="btn btn-primary" id="downloadSchemaBtn">Download Properties</button>
      <button class="btn btn-secondary" id="toggleExampleTabBtn">Toggle Example Widgets</button>
    </div>
    <div id="exampleWidgetTab" style="display:none;"></div>
    <table><thead><tr>
      <th>ID</th><th>Name</th><th>Label</th><th>Types</th><th>Data Type</th>
      <th>Widget</th><th>Help</th><th>Options</th><th>Group</th><th>Layout</th><th>System</th><th>Actions</th>
    </tr></thead><tbody id="schemaBody"></tbody></table>
  `;
  // Implement renderSchema, file load, add, download, toggle example exactly as original, but scoped to state.schemaRows

  // ...
  document.addEventListener('show:schema', () => renderSchema());
}