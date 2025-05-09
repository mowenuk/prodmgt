// js/relationships.js
/**
 * Module: Relationships CRUD and filtering.
 */
import Papa from 'papaparse';
import { state } from './utils.js';

export function initRelsModule() {
  const container = document.getElementById('relationshipsTab');
  container.innerHTML = `
    <div class="controls">
      <input type="file" id="relsFile" accept=".csv">
      <button class="btn btn-primary" id="loadRelsBtn">Load Relationships</button>
      <button class="btn btn-primary" id="addRelBtn">Add Relationship</button>
      <button class="btn btn-primary" id="downloadRelsBtn">Download Relationships</button>
    </div>
    <div class="controls">
      <label>Filter From Type:</label>
      <select id="relsFilterSelect"></select>
    </div>
    <table><thead>
      <tr><th>ID</th><th>Name</th><th>Reverse Name</th><th>Label</th><th>From</th><th>To</th><th>System</th><th>Actions</th></tr>
    </thead><tbody id="relsBody"></tbody></table>
  `;

  function populateFilter() {
    const sel = document.getElementById('relsFilterSelect'); sel.innerHTML = '';
    state.metaTypes.forEach(t => sel.add(new Option(t.name, t.id)));
    sel.addEventListener('change', render);
  }
  function render() {
    const from = document.getElementById('relsFilterSelect').value;
    const tbody = document.getElementById('relsBody'); tbody.innerHTML = '';
    state.metaRels.filter(r=>r.fromMetaObjectID===from).forEach((r,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td><input value="${r.name}" data-field="name"></td>
        <td><input value="${r.reverseName}" data-field="reverseName"></td>
        <td><input value="${r.label}" data-field="label"></td>
        <td>${r.fromMetaObjectID}</td>
        <td><select data-field="toMetaObjectID"></select></td>
        <td><input type="checkbox" ${r.system? 'checked':''} data-field="system"></td>
        <td><button class="btn btn-danger btn-sm" data-action="delete">Delete</button></td>
      `;
      // wire fields
      tr.querySelectorAll('input[data-field], select[data-field]').forEach(inp=>{
        if(inp.tagName==='SELECT') {
          state.metaTypes.forEach(t=>{
            const o=new Option(t.name,t.id);
            if(t.id===r.toMetaObjectID) o.selected=true;
            inp.add(o);
          });
        }
        inp.addEventListener('change', e=>{
          const f=e.target.dataset.field;
          r[f] = inp.type==='checkbox'?inp.checked:inp.value;
        });
      });
      tr.querySelector('[data-action=delete]').addEventListener('click', ()=>{ state.metaRels.splice(i,1); render(); });
      tbody.appendChild(tr);
    });
  }

  document.getElementById('loadRelsBtn').addEventListener('click', () => {
    const f = document.getElementById('relsFile').files[0]; if(!f)return;
    Papa.parse(f,{header:true,skipEmptyLines:true,complete:res=>{
      state.metaRels = res.data.map(r=>({
        id:r.id,name:r.name,reverseName:r.reverseName||'',label:r.label,
        fromMetaObjectID:r.fromMetaObjectID,toMetaObjectID:r.toMetaObjectID,system:String(r.system).toLowerCase()==='true'
      })); populateFilter(); render();
    }});
  });
  document.getElementById('addRelBtn').addEventListener('click', () => {
    if(state.metaTypes.length===0){ alert('Load types first'); return; }
    const from = document.getElementById('relsFilterSelect').value;
    const max = state.metaRels.reduce((m,r)=>Math.max(m,parseInt(r.id)||0),0);
    state.metaRels.push({ id:String(max+1), name:'', reverseName:'', label:'', fromMetaObjectID:from, toMetaObjectID:state.metaTypes[0].id, system:false });
    render();
  });
  document.getElementById('downloadRelsBtn').addEventListener('click', () => {
    const csv = Papa.unparse(state.metaRels,{columns:['id','name','reverseName','label','fromMetaObjectID','toMetaObjectID','system']});
    const blob=new Blob([csv],{type:'text/csv'}), url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='rels_meta-objects.csv'; a.click(); URL.revokeObjectURL(url);
  });

  document.addEventListener('show:relationships', () => { populateFilter(); render(); });
}