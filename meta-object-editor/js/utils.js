/**
 * Utility functions: CSV load/save, URL helpers, and centralized app state.
 * Now uses local `meta-models` folder for CSV files on GitHub Pages.
 */
import Papa from 'papaparse';

export const state = {
  metaTypes: [],
  metaRels: [],
  schemaRows: []
};

// Local folder where CSVs are stored
export const BASE_PATH = './meta-models/';

/**
 * Constructs the relative URL for a CSV file in the meta-models folder.
 * @param {string} base - Filename (e.g., 'meta-objects.csv').
 * @param {string=} prefix - Optional prefix (e.g., 'togaf').
 * @returns {string} Relative path to fetch.
 */
export function getFilename(base, prefix = '') {
  const name = `${prefix ? prefix + '_' : ''}${base}`;
  return `${BASE_PATH}${name}`;
}

/**
 * Fetches and parses a CSV from a given URL, then calls back with the data.
 * @param {string} url - Relative path to the CSV file.
 * @param {function(Array<Object>)} callback - Receives parsed CSV data.
 */
export function autoLoadCSV(url, callback) {
  fetch(url)
    .then(res => { if (!res.ok) throw new Error(`Failed to fetch ${url}`); return res.text(); })
    .then(text => Papa.parse(text, { header: true, skipEmptyLines: true, complete: ({ data }) => callback(data) }))
    .catch(err => console.error(err));
}

/**
 * Serializes data to CSV and triggers a download in the browser.
 * @param {Array<Object>} data - Array of objects to serialize.
 * @param {string} filename - Desired download filename.
 * @param {Array<string>} columns - Column order for CSV.
 */
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

/**
 * Loads all datasets from the meta-models folder by invoking registered callbacks.
 * @param {string=} prefix - Optional prefix for dataset filenames.
 */
export function loadDataset(prefix = '') {
  autoLoadCSV(getFilename('meta-objects.csv', prefix), loadTypesFromData);
  autoLoadCSV(getFilename('rels_meta-objects.csv', prefix), loadRelsFromData);
  autoLoadCSV(getFilename('meta-object-properties.csv', prefix), loadSchemaFromData);
}

// Placeholder callbacks; to be wired in main.js or init.js
export let loadTypesFromData;
export let loadRelsFromData;
export let loadSchemaFromData;