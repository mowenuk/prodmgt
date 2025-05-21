function renderPreviewForm() {
  const typeId = document.getElementById('previewTypeSelect').value;
  const form   = document.getElementById('previewForm');
  form.innerHTML = '';

  // ─── Header ───────────────────────────────────────────────
  const mt = metaTypes.find(m => m.id === typeId) || {};
  const headerDiv = document.createElement('div');
  headerDiv.className = 'mb-4';
  const titleEl = document.createElement('h4');
  titleEl.className = 'd-flex align-items-baseline';
  if (mt.icon) {
    const iconEl = document.createElement('i');
    iconEl.className = `bi bi-${mt.icon} me-2`;
    titleEl.appendChild(iconEl);
  }
  titleEl.append(mt.name || '');
  const idEl = document.createElement('small');
  idEl.className = 'text-secondary ms-2';
  idEl.textContent = `ID: ${mt.id || ''}`;
  titleEl.appendChild(idEl);
  headerDiv.appendChild(titleEl);
  form.appendChild(headerDiv);

  // ─── Group & filter fields ─────────────────────────────────
  const grouped = {};
  schemaRows.forEach(r => {
    if (r.name === 'id' || r.name === 'object_type') return;
    if (!r.type_IDs.includes(typeId) || r.layout === 'hidden') return;
    const grp = r.group || 'Default';
    (grouped[grp] = grouped[grp] || []).push(r);
  });

  // ─── Build accordion ───────────────────────────────────────
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.id        = 'previewAccordion';

  Object.entries(grouped).forEach(([groupName, fields], gIdx) => {
    const groupId = `group${gIdx}`;
    const onlyOne = fields.length === 1;

    // a) Header
    const item = document.createElement('div'); item.className = 'accordion-item';
    const hdr  = document.createElement('h2'); hdr.className = 'accordion-header';
    const btn  = document.createElement('button');
    btn.className = `accordion-button${gIdx>0?' collapsed':''}`;
    btn.type       = 'button';
    btn.setAttribute('data-bs-toggle','collapse');
    btn.setAttribute('data-bs-target', `#collapse-${groupId}`);
    btn.textContent = groupName;
    hdr.appendChild(btn); item.appendChild(hdr);

    // b) Body
    const collapse = document.createElement('div');
    collapse.id = `collapse-${groupId}`;
    collapse.className = `accordion-collapse collapse${gIdx===0?' show':''}`;
    collapse.setAttribute('data-bs-parent','#previewAccordion');
    const body = document.createElement('div'); body.className = 'accordion-body';
    const row  = document.createElement('div'); row.className = 'row g-3';

    // c) Each field
    fields.forEach(r => {

        // 🐞 debug: see every widget being rendered
console.log(`▶️ renderPreviewForm: widget = "${r.widget}", field id = ${r.id}`);

      const col = document.createElement('div');
      // layout
      const layoutKey = onlyOne ? 'full-width' : r.layout;
      switch (layoutKey) {
        case 'half-left': case 'half-right': col.className='col-md-6'; break;
        case 'one-third':     col.className='col-md-4'; break;
        case 'two-thirds':    col.className='col-md-8'; break;
        case 'quarter':       col.className='col-md-3'; break;
        case 'three-quarters':col.className='col-md-9'; break;
        case 'inline': case 'auto': col.className='col-auto'; break;
        default:              col.className='col-12';
      }

      const wrap = document.createElement('div');
      wrap.className = r.widget === 'checkbox'
        ? 'form-check form-switch mt-2'
        : 'mb-3';

      // Generic Label + Icon
      if (r.widget !== 'checkbox') {
        const lbl = document.createElement('label');
        lbl.className = 'form-label';
        if (r.icon) {
          const ico = document.createElement('i');
          ico.className = `bi bi-${r.icon} me-1`;
          lbl.appendChild(ico);
        }
        lbl.append(r.label || r.name);
        wrap.appendChild(lbl);
      }

      // Formula editor (read-only output)
      if (r.widget === 'formula editor') {
        const help = document.createElement('div');
        help.className = 'form-text text-muted';
        help.textContent = 'Formula: ' +
          r.options.map(tok =>
            ['+','-','*','/'].includes(tok)
              ? tok
              : (schemaRows.find(f=>f.id===tok)?.label || tok)
          ).join(' ');
        wrap.appendChild(help);

        const out = document.createElement('div');
        out.id = `formula-${r.id}`;
        out.className = 'form-control-plaintext';
        wrap.appendChild(out);

        col.appendChild(wrap);
        row.appendChild(col);
        return;
      }

      // Generic defaultValue for primitives
      const val = r.defaultValue != null && r.defaultValue !== ''
        ? r.defaultValue
        : (r.options[0] || '');

      let input;

      switch (r.widget) {



// inside your switch(r.widget) in renderPreviewForm():
    case 'text input': {
      // r.options will be something like ["Before:£","Amount GBP"]
      const cfg = r.options;
      // flatten defaultValue array
      const dvArr = Array.isArray(r.defaultValue) ? r.defaultValue : [r.defaultValue];
      const dv    = dvArr[0] || '';

      // detect Before:/After:
      let beforeSym = '', afterSym = '', placeholder = '';
      if (cfg.length === 2 && /^Before:/i.test(cfg[0])) {
        beforeSym  = cfg[0].split(':')[1].trim();
        placeholder = cfg[1];
      } else if (cfg.length === 2 && /^After:/i.test(cfg[0])) {
        afterSym   = cfg[0].split(':')[1].trim();
        placeholder = cfg[1];
      }

      if (beforeSym || afterSym) {
        // build an input-group with addon(s)
        const grp = document.createElement('div');
        grp.className = 'input-group';

        if (beforeSym) {
          const span = document.createElement('span');
          span.className = 'input-group-text';
          span.textContent = beforeSym;
          grp.appendChild(span);
        }

        const inp = document.createElement('input');
        inp.type        = 'text';
        inp.className   = 'form-control';
        if (dv) inp.value       = dv;
        else    inp.placeholder = placeholder;
        grp.appendChild(inp);

        if (afterSym) {
          const span = document.createElement('span');
          span.className = 'input-group-text';
          span.textContent = afterSym;
          grp.appendChild(span);
        }

        wrap.appendChild(grp);
      } else {
        // plain text input
        const inp = document.createElement('input');
        inp.type      = 'text';
        inp.className = 'form-control';
        if (dv) inp.value = dv;
        wrap.appendChild(inp);
      }
      break;
    }



        case 'search input':
        case 'email input':
        case 'url input':
        case 'tel input':
        case 'floating label':
          input = document.createElement('input');
          input.type = r.widget.includes('input')
            ? r.widget.split(' ')[0]
            : 'text';
          input.className = 'form-control';
          input.value     = val;
          wrap.appendChild(input);
          break;

        case 'textarea':
          input = document.createElement('textarea');
          input.className = 'form-control';
          input.value     = val;
          wrap.appendChild(input);
          break;

case 'spinner': {
  // r.options might be [ "Before:£", "Amount GBP" ] or empty/default
  const cfg = r.options || [];
  const dvArr = Array.isArray(r.defaultValue) ? r.defaultValue : [r.defaultValue];
  const dv    = dvArr[0] != null && dvArr[0] !== '' ? dvArr[0] : '';

  // parse Before:/After:
  let beforeSym = '', afterSym = '', placeholder = '';
  if (cfg.length === 2 && /^Before:/i.test(cfg[0])) {
    beforeSym  = cfg[0].split(':')[1].trim();
    placeholder = cfg[1];
  } else if (cfg.length === 2 && /^After:/i.test(cfg[0])) {
    afterSym   = cfg[0].split(':')[1].trim();
    placeholder = cfg[1];
  }

  // helper to wire formula-listeners
  function wire(inp) {
    inp.id = `input-${r.id}`;
    inp.addEventListener('input',  evaluateAllFormulas);
    inp.addEventListener('change', evaluateAllFormulas);
  }

  if (beforeSym || afterSym) {
    const grp = document.createElement('div');
    grp.className = 'input-group';

    if (beforeSym) {
      const span = document.createElement('span');
      span.className = 'input-group-text';
      span.textContent = beforeSym;
      grp.appendChild(span);
    }

    const inp = document.createElement('input');
    inp.type        = 'number';
    inp.className   = 'form-control';
    if (dv) inp.value       = dv;
    else    inp.placeholder = placeholder;
    grp.appendChild(inp);
    wire(inp);

    if (afterSym) {
      const span = document.createElement('span');
      span.className = 'input-group-text';
      span.textContent = afterSym;
      grp.appendChild(span);
    }

    wrap.appendChild(grp);
  } else {
    // plain spinner
    const inp = document.createElement('input');
    inp.type      = 'number';
    inp.className = 'form-control';
    if (dv) inp.value = dv;
    wrap.appendChild(inp);
    wire(inp);
  }
  break;
}


        case 'stepper': {
          const grp = document.createElement('div');
          grp.className = 'input-group';
          const dec = document.createElement('button');
          dec.type='button'; dec.className='btn btn-outline-secondary'; dec.textContent='−';
          const num = document.createElement('input');
          num.type='number'; num.className='form-control'; num.value=val;
          const inc = document.createElement('button');
          inc.type='button'; inc.className='btn btn-outline-secondary'; inc.textContent='+';
          dec.onclick = () => num.value = (parseFloat(num.value)||0) - 1;
          inc.onclick = () => num.value = (parseFloat(num.value)||0) + 1;
          grp.append(dec, num, inc);
          wrap.appendChild(grp);
          break;
        }

        case 'range slider':
          input = document.createElement('input');
          input.type = 'range';
          input.className = 'form-range';
          if (r.options[0]) input.min  = r.options[0];
          if (r.options[1]) input.max  = r.options[1];
          if (r.options[2]) input.step = r.options[2];
          input.value     = val;
          wrap.appendChild(input);
          break;

        case 'date picker':
        case 'time picker':
        case 'datetime-local':
        case 'month picker':
        case 'week picker':
          input = document.createElement('input');
          input.type = r.widget.replace(' picker','');
          input.className = 'form-control';
          input.value     = val;
          wrap.appendChild(input);
          input.id = `input-${r.id}`;
          input.addEventListener('input',  evaluateAllFormulas);
     
          break;

        case 'checkbox':
          input = document.createElement('input');
          input.type = 'checkbox';
          input.className = 'form-check-input';
          input.checked = (val === 'true' || val === true);
          wrap.appendChild(input);
          const chkLbl = document.createElement('label');
          chkLbl.className = 'form-check-label ms-2';
          chkLbl.textContent = r.label || r.name;
          wrap.appendChild(chkLbl);
          break;

        case 'radio group':
        case 'toggle buttons': {
          const choices = (r.options[0] || '').split(',').map(s=>s.trim());
          choices.forEach(optText => {
            const div = document.createElement(r.widget === 'toggle buttons'
              ? 'label'
              : 'div');
            div.className = r.widget === 'toggle buttons'
              ? 'btn btn-outline-primary me-1'
              : 'form-check';
            const ip = document.createElement('input');
            ip.type = 'radio';
            ip.name = r.id;
            ip.className = r.widget === 'toggle buttons'
              ? 'btn-check'
              : 'form-check-input';
            ip.checked = (optText === val);
            div.appendChild(ip);
            const lb = document.createElement('span');
            lb.textContent = optText;
            if (r.widget !== 'toggle buttons') lb.className = 'form-check-label';
            div.appendChild(lb);
            wrap.appendChild(div);
          });
          break;
        }

        case 'select':
        case 'single select':
          input = document.createElement('select');
          input.className = 'form-select';
          r.options.forEach(optText => {
            const o = new Option(optText, optText);
            input.appendChild(o);
          });
          input.value = val;
          wrap.appendChild(input);
          break;

        case 'multi-select':
          input = document.createElement('select');
          input.className = 'form-select';
          input.multiple = true;
          r.options.forEach(optText => {
            const o = new Option(optText, optText);
            o.selected = (optText === val);
            input.appendChild(o);
          });
          wrap.appendChild(input);
          break;
        case 'progress bar': {
          // 1) Build segments from r.options as Label:Color:Value
          const segments = [];
          let maxVal = 100;
          r.options.forEach(opt => {
            const parts = opt.split(':').map(s => s.trim());
            if (parts[0].toLowerCase() === 'max') {
              // Max:80  → parts = ['Max','80'] or ['Max','80','']
              maxVal = parseFloat(parts[1] || parts[2]) || maxVal;
            } else {
              // Label:Color:Value
              const label = parts[0] || `Seg ${segments.length+1}`;
              const color = parts[1] ? BS_COLOR_MAP[parts[1].toLowerCase()] : null;
              const value = parseFloat(parts[2]) || 0;
              segments.push({ label, color, value });
            }
          });

          // 2) Parse any defaultValue overrides
          const defaultNums = (r.defaultValue || [])
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));

          // 3) Build current values from defaults or segments[].value
          const values = segments.map((seg,i) =>
            defaultNums[i] != null ? defaultNums[i] : seg.value
          );
          // if there's an extra defaultValue for Max, apply it:
          if (defaultNums.length > segments.length && !isNaN(defaultNums[segments.length])) {
            maxVal = defaultNums[segments.length];
          }

          // 4) Container
          const container = document.createElement('div');
          container.className = 'mb-2';

          // 5) One spinner per segment
          segments.forEach((seg,i) => {
            const grp = document.createElement('div');
            grp.className = 'input-group input-group-sm mb-1';
            const lbl = document.createElement('span');
            lbl.className = 'input-group-text';
            lbl.textContent = seg.label;
            grp.appendChild(lbl);
            const inp = document.createElement('input');
            inp.type      = 'number';
            inp.className = 'form-control';
            inp.value     = values[i];
            inp.onchange  = () => { values[i] = parseFloat(inp.value) || 0; redraw(); };
            grp.appendChild(inp);
            container.appendChild(grp);
          });

          // 6) Spinner for Max
          const maxGrp = document.createElement('div');
          maxGrp.className = 'input-group input-group-sm mb-1';
          const maxLbl = document.createElement('span');
          maxLbl.className = 'input-group-text';
          maxLbl.textContent = 'Max';
          maxGrp.appendChild(maxLbl);
          const maxInp = document.createElement('input');
          maxInp.type      = 'number';
          maxInp.className = 'form-control';
          maxInp.value     = maxVal;
          maxInp.onchange  = () => { maxVal = parseFloat(maxInp.value) || 1; redraw(); };
          maxGrp.appendChild(maxInp);
          container.appendChild(maxGrp);

          // 7) The bar itself
          const barContainer = document.createElement('div');
          barContainer.className = 'progress';
          container.appendChild(barContainer);

          // 8) redraw() uses the up-to-date values + maxVal
          function redraw() {
            barContainer.innerHTML = '';
            const denom = maxVal || 1;
            segments.forEach((seg,i) => {
              const pct = (values[i] / denom) * 100;
              const bar = document.createElement('div');
              bar.className = seg.color
                ? `progress-bar bg-${seg.color}`
                : 'progress-bar';
              bar.style.width = `${pct}%`;
              if (seg.label) bar.textContent = seg.label;
              barContainer.appendChild(bar);
            });
          }
          redraw();

          // 9) Append to your preview layout
          wrap.appendChild(container);
          col.appendChild(wrap);
          row.appendChild(col);
          return;
        }



        case 'editable progress bar':
          input = document.createElement('input');
          input.type = 'range';
          input.className = 'form-range';
          if (r.options[0]) input.value = (r.defaultValue || r.options[0]);
          if (r.options[1]) input.max   = r.options[1];
          wrap.appendChild(input);
          // Add the next two lines to any case statement to make them available to the function editor
          input.id = `input-${r.id}`;
          input.addEventListener('input',  evaluateAllFormulas);
          break;

          case 'dial gauge': {
            // 1) create the slider control
            const slider = document.createElement('input');
            slider.type      = 'range';
            slider.className = 'form-range mb-2';
            slider.min       = r.options[0] || 0;
            slider.max       = r.options[1] || 100;
            // initial value: defaultValue or midpoint
            slider.value     = r.defaultValue
                              ? +r.defaultValue
                              : ((+slider.min + +slider.max) / 2);

            // give it an ID so resolveToken can see it if you ever want
            slider.id = `input-${r.id}`;

            // wire it up
            slider.addEventListener('input', () => {
              const v = +slider.value;
              gaugeInstances[r.id].refresh(v);
              evaluateAllFormulas();
            });

            wrap.appendChild(slider);

            // 2) render the gauge itself and stash the instance
            const gd = document.createElement('div');
            gd.id = `gauge-${r.id}`;
            gd.style.width  = '200px';
            gd.style.height = '160px';


            wrap.appendChild(gd);
            col.appendChild(wrap);
            row.appendChild(col);

            setTimeout(() => {
              gaugeInstances[r.id] = new JustGage({
                id:              gd.id,
                value:           +slider.value,
                min:             +slider.min,
                max:             +slider.max,
                title:           '',
                label:           '',
                pointer:         true,
                gaugeWidthScale: 0.6
              });
            }, 0);
            break;
          }


        case 'rich text': {
          const editorDiv = document.createElement('div');
          editorDiv.id        = `preview-rich-${r.id}`;
          editorDiv.className = 'form-control';
          editorDiv.style.minHeight = '120px';
          wrap.appendChild(editorDiv);
          setTimeout(() => {
            const q = new Quill(editorDiv, {
              theme:    'snow',
              placeholder: r.defaultValue || r.options[0] || ''
            });
            if (r.defaultValue) q.setText(r.defaultValue);
            else if (r.options[0]) q.setText(r.options[0]);
            quillEditors[`preview-${r.id}`] = q;
          }, 0);
          break;
        }

        case 'single choice': {
          const hidden = document.createElement('input');
          hidden.type = 'hidden'; hidden.id = `input-${r.id}`;
          wrap.appendChild(hidden);
          const sel = document.createElement('select');
          sel.className = 'form-select';
          sel.onchange = () => {
            hidden.value = sel.value;
            evaluateAllFormulas();
          };
          r.options.forEach(opt => {
            const [label,val] = opt.split(':').map(s=>s.trim());
            sel.appendChild(new Option(label,val));
          });
          // apply defaultValue or first
          if (r.defaultValue) sel.value = r.defaultValue;
          hidden.value = sel.value;
          wrap.appendChild(sel);
          input.id = `input-${r.id}`;
          input.addEventListener('input',  evaluateAllFormulas);

          break;
        }

        case 'single choice color': {
          const hidden = document.createElement('input');
          hidden.type = 'hidden'; hidden.id = `input-${r.id}`;
          wrap.appendChild(hidden);
          const dd = document.createElement('div');
          dd.className = 'dropdown';
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
          btn.type = 'button';
          btn.setAttribute('data-bs-toggle','dropdown');
          dd.appendChild(btn);
          const menu = document.createElement('ul');
          menu.className = 'dropdown-menu';
          dd.appendChild(menu);

          r.options.forEach((optStr,i) => {
            const parts = optStr.split(':').map(s=>s.trim());
            let label, color, value;
            if (parts.length===3) [label,color,value] = parts;
            else [color,value] = parts, label = value;
            const bsClr = BS_COLOR_MAP[color.toLowerCase()]||'secondary';
            const li = document.createElement('li');
            const a  = document.createElement('a');
            a.className = `dropdown-item text-white bg-${bsClr}`;
            a.href = '#'; a.textContent = label;
            a.addEventListener('click', e => {
              e.preventDefault();
              hidden.value = value;
              btn.textContent = label;
              btn.className   = `btn btn-sm btn-${bsClr} dropdown-toggle`;
              bootstrap.Dropdown.getOrCreateInstance(btn).hide();
              evaluateAllFormulas();
            });
            li.appendChild(a); menu.appendChild(li);

            // initial: match defaultValue first
            if (r.defaultValue && value===r.defaultValue || i===0 && !r.defaultValue) {
              hidden.value = value;
              btn.textContent = label;
              btn.className   = `btn btn-sm btn-${bsClr} dropdown-toggle`;
            }
          });

          wrap.appendChild(dd);

          break;
        }
      }

      // attach for formulas
      if (input) {
        input.id = `input-${r.id}`;
      }

      col.appendChild(wrap);
      row.appendChild(col);
    });

    body.appendChild(row);
    collapse.appendChild(body);
    item.appendChild(collapse);
    accordion.appendChild(item);
  });

  form.appendChild(accordion);



  evaluateAllFormulas();
}