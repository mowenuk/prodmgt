// This file contains JavaScript functions related to managing schema attributes, including loading, rendering, and downloading schema data.

let schemaRows = [], metaTypes = [], metaRels = [];
const dataTypeOptions = ['short text','long text','integer','date','percentage','boolean'];
const widgetsByDataType = {
  'short text':   ['text input','search input','email input','url input','tel input','floating label','select', 'single select', 'multi-select'],
  'long text':    ['textarea','rich text','markdown editor','code editor'],
  'integer':      ['spinner','stepper','range slider'],
  'date':         ['date picker','time picker','datetime-local','month picker','week picker'],
  'percentage':   ['progress bar','editable progress bar','dial gauge'],
  'boolean':      ['checkbox','radio group','toggle buttons'],
};

const widgetHelpText = {
  'range slider':           'User enters min,max,step (e.g. 0,100,10).',
  'stepper':                'User enters min,max,step (e.g. 0,10,1).',
  'radio group':            'Enter choices comma-separated (e.g. High,Medium,Low).',
  'toggle buttons':         'Enter choices comma-separated (e.g. On,Off).',
  'select':                 'Enter choices comma-separated (e.g. Red,Green,Blue).',
  'single select':          'Enter choices comma-separated (e.g. Small,Medium,Large).',
  'multi-select':           'Enter choices comma-separated (e.g. Apple,Banana,Cherry).',
  'editable progress bar':  'Enter initialValue,max (e.g. 50,100).',
  'dial gauge':             'Enter min,max (e.g. 0,360).',
  'text input':             'Enter the default text you want pre-filled (e.g. Specify your name).',
};

const widgetOptions = ['text input','textarea','spinner','date picker','progress bar','checkbox','slider','select','single select','multi-select'];
const layoutOptions = [
  'full-width',
  'half-left',
  'half-right',
  'one-third',
  'two-thirds',
  'quarter',
  'three-quarters',
  'inline',
  'auto',
  'hidden'
];
const userOptionWidgets = [
  'text input',
  'range slider',
  'stepper',
  'radio group',
  'toggle buttons',
  'select',
  'single select',
  'multi-select',
  'editable progress bar',
  'dial gauge'
];

function renderSchema() {
  const tbody = document.getElementById('schemaBody');
  tbody.innerHTML = '';

  schemaRows.forEach((r, i) => {
    const tr = document.createElement('tr');

    const idTd = document.createElement('td');
    const idIn = document.createElement('input');
    idIn.type = 'text';
    idIn.value = r.id;
    idIn.disabled = true;
    idTd.appendChild(idIn);
    tr.appendChild(idTd);

    const nameTd = document.createElement('td');
    const nameIn = document.createElement('input');
    nameIn.type = 'text';
    nameIn.value = r.name;
    nameIn.onchange = e => r.name = e.target.value;
    nameTd.appendChild(nameIn);
    tr.appendChild(nameTd);

    const labelTd = document.createElement('td');
    const labelIn = document.createElement('input');
    labelIn.type = 'text';
    labelIn.value = r.label;
    labelIn.onchange = e => r.label = e.target.value;
    labelTd.appendChild(labelIn);
    tr.appendChild(labelTd);

    const typesTd = document.createElement('td');
    if (metaTypes.length > 0) {
      const sel = document.createElement('select');
      sel.multiple = true;
      sel.style.width = '100%';
      metaTypes.forEach(mt => {
        const opt = document.createElement('option');
        opt.value = mt.id;
        opt.textContent = mt.name;
        if (r.type_IDs.includes(mt.id)) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.onchange = () => {
        r.type_IDs = Array.from(sel.selectedOptions).map(o => o.value);
      };
      typesTd.appendChild(sel);
    } else {
      typesTd.textContent = r.type_IDs.join(',');
    }
    tr.appendChild(typesTd);

    const dtTd = document.createElement('td');
    const dtSel = document.createElement('select');
    dataTypeOptions.forEach(optText => {
      const opt = document.createElement('option');
      opt.value = optText;
      opt.textContent = optText;
      if (r.dataType === optText) opt.selected = true;
      dtSel.appendChild(opt);
    });
    dtSel.onchange = e => {
      r.dataType = e.target.value;
      renderSchema();
    };
    dtTd.appendChild(dtSel);
    tr.appendChild(dtTd);

    const wTd = document.createElement('td');
    const wSel = document.createElement('select');
    const allowed = widgetsByDataType[r.dataType] || [];
    allowed.forEach(optText => {
      const opt = document.createElement('option');
      opt.value = optText;
      opt.textContent = optText;
      if (r.widget === optText) opt.selected = true;
      wSel.appendChild(opt);
    });
    wSel.onchange = e => {
      r.widget = e.target.value;
      renderSchema();
    };
    wTd.appendChild(wSel);
    tr.appendChild(wTd);

    const helpTd = document.createElement('td');
    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'btn btn-outline-secondary btn-sm';
    helpBtn.textContent = '?';
    helpBtn.onclick = () => {
      const help = widgetHelpText[r.widget] || 'No help available for this widget.';
      alert(`${r.widget}:\n\n${help}`);
    };
    helpTd.appendChild(helpBtn);
    tr.appendChild(helpTd);

    const optTd = document.createElement('td');
    if (userOptionWidgets.includes(r.widget)) {
      const optIn = document.createElement('input');
      optIn.type = 'text';
      optIn.value = r.options.join(',');
      optIn.placeholder = widgetHelpText[r.widget] || '';
      optIn.onchange = e => {
        r.options = e.target.value.split(',').map(s => s.trim()).filter(s => s);
      };
      optTd.appendChild(optIn);
    } else {
      optTd.textContent = '—';
    }
    tr.appendChild(optTd);

    const groupTd = document.createElement('td');
    const groupIn = document.createElement('input');
    groupIn.type = 'text';
    groupIn.value = r.group || '';
    groupIn.onchange = e => r.group = e.target.value;
    groupTd.appendChild(groupIn);
    tr.appendChild(groupTd);

    const layoutTd = document.createElement('td');
    const layoutSel = document.createElement('select');
    layoutOptions.forEach(optText => {
      const opt = document.createElement('option');
      opt.value = optText;
      opt.textContent = optText;
      if (r.layout === optText) opt.selected = true;
      layoutSel.appendChild(opt);
    });
    layoutSel.onchange = e => r.layout = e.target.value;
    layoutTd.appendChild(layoutSel);
    tr.appendChild(layoutTd);

    const sysTd = document.createElement('td');
    const sysCb = document.createElement('input');
    sysCb.type = 'checkbox';
    sysCb.checked = r.system;
    sysCb.onchange = e => r.system = e.target.checked;
    sysTd.appendChild(sysCb);
    tr.appendChild(sysTd);

    const actTd = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => { schemaRows.splice(i, 1); renderSchema(); };
    actTd.appendChild(delBtn);
    tr.appendChild(actTd);

    tbody.appendChild(tr);
  });
}

document.getElementById('loadSchemaBtn').addEventListener('click', () => {
  const file = document.getElementById('schemaFile').files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: res => {
      schemaRows = res.data.map(r => ({
        id:        r.id,
        name:      r.name,
        label:     r.label,
        type_IDs:  (r.type_IDs || '').split(',').map(s => s.trim()),
        dataType:  r.dataType,
        widget:    r.widget,
        options:   (r.options || '').split(',').map(s => s.trim()),
        group:     r.group || '',
        layout:    r.layout || 'full-width',
        system:    String(r.system || '').toLowerCase() === 'true'
      }));
      renderSchema();
    }
  });
});

document.getElementById('downloadSchemaBtn').addEventListener('click', () => {
  const out = schemaRows.map(r => ({
    id:        r.id,
    name:      r.name,
    label:     r.label,
    type_IDs:  r.type_IDs.join(','),
    dataType:  r.dataType,
    widget:    r.widget,
    options:   r.options.join(','),
    group:     r.group || '',
    layout:    r.layout || 'full-width',
    system:    r.system
  }));
  const csv = Papa.unparse(out, {
    columns: [
      'id','name','label','type_IDs','dataType','widget',
      'options','group','layout','system'
    ]
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meta-object-properties.csv';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('addSchemaBtn').addEventListener('click', () => {
  const maxId = schemaRows.reduce((m, r) => Math.max(m, parseInt(r.id, 10) || 0), 0);
  const nextId = (maxId + 1).toString();
  schemaRows.push({
    id: nextId,
    system: false
  });
  renderSchema();
});