// js/utils.js
/**
 * Utility functions: CSV load/save, URL helpers, and centralized app state.
 */
import Papa from 'papaparse';

export const state = {
  metaTypes: [],
  metaRels: [],
  schemaRows: []
};

export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/mowenuk/prodmgt/main/';

export function getFilename(base, prefix = '') {
  return `${GITHUB_RAW_BASE}${prefix ? `${prefix}_` : ''}${base}`;
}

export function autoLoadCSV(url, callback) {
  fetch(url)
    .then(res => { if (!res.ok) throw new Error(`Failed to fetch ${url}`); return res.text(); })
    .then(text => Papa.parse(text, { header: true, skipEmptyLines: true, complete: ({ data }) => callback(data) }))
    .catch(err => console.error(err));
}

export function saveCSV(data, filename, columns) {
  const csv = Papa.unparse(data, { columns });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadDataset(prefix = '') {
  autoLoadCSV(getFilename('meta-objects.csv', prefix), loadTypesFromData);
  autoLoadCSV(getFilename('rels_meta-objects.csv', prefix), loadRelsFromData);
  autoLoadCSV(getFilename('meta-object-properties.csv', prefix), loadSchemaFromData);
}

// Placeholder callbacks to be injected in init.js
export let loadTypesFromData;
export let loadRelsFromData;
export let loadSchemaFromData;