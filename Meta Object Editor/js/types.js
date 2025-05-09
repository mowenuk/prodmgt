// js/types.js
/**
 * Module: Object Types CRUD UI and CSV handling.
 */
import Papa from 'papaparse';
import { state, autoLoadCSV } from './utils.js';

export function initTypesModule() {
  const container = document.getElementById('typesTab');
  container.innerHTML = `
    <div class="controls">
      <input type="file" id="typesFile" accept=".csv">
      <button class="btn btn-primary" id="loadTypesBtn">Load Types</button>
      <button class="btn btn-primary" id="addTypeBtn">Add Type</button>
      <button class="btn btn-primary" id="downloadTypesBtn">Download Types</button>
    </div>
    <table><thead>
      <tr><th>ID</th><th>Name</th><th>Description</th><th>System</th><th>Actions</th></tr>
    </thead><tbody id="typesBody"></tbody></table>
  `;

  function render() {
    const tbody = document.getElementById('typesBody'); tbody.innerHTML = '';
    state.metaTypes.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input disabled value="${t.id}"></td>
        <td><input value="${t.name}" data-field="name"></td>
        <td><input value="${t.description}" data-field="description"></td>
        <td><input type="checkbox" ${t.system? 'checked': ''} data-field="system"></td>
        <td><button class="btn btn-danger btn-sm" data-action="delete">Delete</button></td>
      `;
      // Field change
      tr.querySelectorAll('input[data-field]').forEach(inp => {
        inp.addEventListener('change', e => {
          const field = e.target.dataset.field;
          t[field] = inp.type === 'checkbox' ? inp.checked : inp.value;
        });
      });
      // Delete
      tr.querySelector('[data-action=delete]').addEventListener('click', () => { state.metaTypes.splice(i,1); render(); });
      tbody.appendChild(tr);
    });
  }

  document.getElementById('loadTypesBtn').addEventListener('click', () => {
    const f = document.getElementById('typesFile').files[0]; if (!f) return;
    Papa.parse(f, { header:true, skipEmptyLines:true, complete: res => {
      state.metaTypes = res.data.map(r=>({ id:r.id,name:r.name,description:r.description,system:String(r.system).toLowerCase()==='true'})); render();
    }});
  });
  document.getElementById('addTypeBtn').addEventListener('click', () => {
    const maxId = state.metaTypes.reduce((m,t)=>Math.max(m,parseInt(t.id)||0),0);
    state.metaTypes.push({ id:String(maxId+1), name:'', description:'', system:false }); render();
  });
  document.getElementById('downloadTypesBtn').addEventListener('click', () => {
    const csv = Papa.unparse(state.metaTypes,{columns:['id','name','description','system']});
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='meta-objects.csv'; a.click(); URL.revokeObjectURL(url);
  });

  // initial load via global fetch
  document.addEventListener('show:types', () => render());
}