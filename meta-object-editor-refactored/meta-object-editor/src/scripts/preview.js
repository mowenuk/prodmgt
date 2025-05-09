// This file contains JavaScript functions for rendering the preview form based on selected object types and attributes.

function updatePreviewTypeSelect() {
  const sel = document.getElementById('previewTypeSelect');
  if (!sel) return console.error('No #previewTypeSelect found');
  
  sel.options.length = 0;

  metaTypes.forEach(mt => {
    const opt = new Option(mt.name, mt.id);
    sel.add(opt);
  });

  sel.onchange = renderPreviewForm;

  if (sel.options.length) {
    sel.selectedIndex = 0;
    renderPreviewForm();
  }
}

function renderPreviewForm() {
  const typeId = document.getElementById('previewTypeSelect').value;
  const form = document.getElementById('previewForm');
  form.innerHTML = '';

  const grouped = {};
  schemaRows.forEach(r => {
    if (!r.type_IDs.includes(typeId) || r.layout === 'hidden') return;
    const grp = r.group || 'Default';
    if (!grouped[grp]) grouped[grp] = [];
    grouped[grp].push(r);
  });

  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.id = 'previewAccordion';

  let groupCount = 0;
  Object.entries(grouped).forEach(([groupName, fields]) => {
    const groupId = `group${groupCount++}`;

    const item = document.createElement('div');
    item.className = 'accordion-item';

    const header = document.createElement('h2');
    header.className = 'accordion-header';
    const btn = document.createElement('button');
    btn.className = `accordion-button${groupCount > 1 ? ' collapsed' : ''}`;
    btn.type = 'button';
    btn.setAttribute('data-bs-toggle', 'collapse');
    btn.setAttribute('data-bs-target', `#collapse-${groupId}`);
    btn.innerText = `Group: ${groupName}`;
    header.appendChild(btn);

    const collapse = document.createElement('div');
    collapse.id = `collapse-${groupId}`;
    collapse.className = 'accordion-collapse collapse';
    const body = document.createElement('div');
    body.className = 'accordion-body';

    fields.forEach(field => {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = field.name;
      const fieldInput = document.createElement('input');
      fieldInput.type = field.widget === 'checkbox' ? 'checkbox' : 'text';
      fieldInput.value = field.widget === 'checkbox' ? field.system : '';
      body.appendChild(fieldLabel);
      body.appendChild(fieldInput);
    });

    collapse.appendChild(body);
    item.appendChild(header);
    item.appendChild(collapse);
    accordion.appendChild(item);
  });

  form.appendChild(accordion);
}