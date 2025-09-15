    // ===== UTIL =====
    const qs = (s, el=document) => el.querySelector(s);
    const qsa = (s, el=document) => [...el.querySelectorAll(s)];

    const Toast = {
      show(msg, type='info', title='Aviso') {
        const wrap = qs('#toasts');
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<div><div class="title">${title}</div><div class="msg">${msg}</div></div>`;
        wrap.appendChild(el);
        setTimeout(() => { el.style.opacity = .9; }, 50);
        setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translateY(8px)'; setTimeout(()=> el.remove(), 250); }, 3500);
      }
    }

    // ===== STORE (localStorage mock, fácil de reemplazar por API) =====
    const KEY = 'probuild_projects';
    const Store = {
      all() { return JSON.parse(localStorage.getItem(KEY) || '[]'); },
      save(list) { localStorage.setItem(KEY, JSON.stringify(list)); },
      upsert(p) {
        const list = this.all();
        const idx = list.findIndex(x => x.id === p.id);
        if (idx >= 0) list[idx] = p; else list.unshift(p);
        this.save(list);
      },
      remove(id) {
        const list = this.all().filter(x => x.id !== id);
        this.save(list);
      },
      seedIfEmpty() {
        if (this.all().length) return;
        const now = Date.now();
        const sample = [
          { id: crypto.randomUUID(), nombre:'Torre Empresarial Norte', codigo:'TEN-2024-001', cliente:'Constructora Moderna S.A.', progreso:75, estado:'EN_PROGRESO', fechaLimite:'2024-11-15', presupuesto:850000, descripcion:'Oficinas y comercio – Etapa 2', createdAt: now-1000 },
          { id: crypto.randomUUID(), nombre:'Residencial Los Pinos', codigo:'RLP-2024-002', cliente:'Inmobiliaria Central', progreso:45, estado:'PENDIENTE', fechaLimite:'2024-12-28', presupuesto:1200000, descripcion:'Conjunto residencial 6 torres', createdAt: now-2000 },
          { id: crypto.randomUUID(), nombre:'Centro Comercial Plaza', codigo:'CCP-2024-003', cliente:'Desarrollos Urbanos', progreso:100, estado:'COMPLETADO', fechaLimite:'2024-09-30', presupuesto:2150000, descripcion:'Remodelación y ampliación', createdAt: now-3000 },
          { id: crypto.randomUUID(), nombre:'Complejo Habitacional Sur', codigo:'CHS-2024-004', cliente:'Vivienda Social Corp.', progreso:30, estado:'EN_PROGRESO', fechaLimite:'2025-02-15', presupuesto:3500000, descripcion:'Vivienda VIS – 500 aptos', createdAt: now-4000 },
          { id: crypto.randomUUID(), nombre:'Oficinas Corporativas Este', codigo:'OCE-2024-005', cliente:'TechCorp Solutions', progreso:90, estado:'EN_PROGRESO', fechaLimite:'2024-10-08', presupuesto:975000, descripcion:'Sede corporativa 12 pisos', createdAt: now-5000 },
        ];
        sample.forEach(x => this.upsert(x));
      }
    };

    // ===== STATE =====
    const state = {
      editingId: null,
      search: '',
      filtroEstado: '',
      sort: '-createdAt'
    };

    // ===== RENDER =====
    function badge(estado) {
      const map = { EN_PROGRESO:'status-active', PENDIENTE:'status-pending', COMPLETADO:'status-completed', CANCELADO:'status-inactive' };
      const label = { EN_PROGRESO:'En Progreso', PENDIENTE:'Pendiente', COMPLETADO:'Completado', CANCELADO:'Cancelado' };
      return `<span class="status-badge ${map[estado]}">${label[estado] || estado}</span>`;
    }

    function formatMoney(v){ return Intl.NumberFormat('en-US',{style:'currency', currency:'USD', maximumFractionDigits:0}).format(Number(v||0)); }
    function formatDate(iso){ if(!iso) return ''; const d=new Date(iso); return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' }); }

    function applyFilters(list){
      let out = [...list];
      const s = state.search.trim().toLowerCase();
      if (s) out = out.filter(p => `${p.nombre} ${p.codigo} ${p.cliente}`.toLowerCase().includes(s));
      if (state.filtroEstado) out = out.filter(p => p.estado === state.filtroEstado);
      const sort = state.sort;
      out.sort((a,b) => {
        const dir = sort.startsWith('-') ? -1 : 1;
        const key = sort.replace('-', '');
        const va = a[key]; const vb = b[key];
        if (key === 'fechaLimite') return (new Date(va) - new Date(vb)) * dir;
        if (typeof va === 'string') return va.localeCompare(vb) * dir;
        return ((va||0) - (vb||0)) * dir;
      });
      if (sort==='-createdAt') out.sort((a,b)=> (b.createdAt - a.createdAt));
      return out;
    }

    function render(){
      const tbody = qs('#tabla tbody');
      const list = applyFilters(Store.all());
      qs('#count').textContent = `${list.length} proyecto(s)`;
      tbody.innerHTML = list.map(p => `
        <tr>
          <td style="font-weight:700">${p.nombre}</td>
          <td>${p.codigo}</td>
          <td>${p.cliente}</td>
          <td>
            <div style="display:flex; align-items:center; gap:.6rem">
              <div style="width:90px;height:6px;background:var(--border-color);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${p.progreso||0}%;background:var(--primary-color)"></div>
              </div>
              <span>${p.progreso||0}%</span>
            </div>
          </td>
          <td>${badge(p.estado)}</td>
          <td>${formatDate(p.fechaLimite)}</td>
          <td>${formatMoney(p.presupuesto)}</td>
          <td class="actions">
            <button class="icon-btn icon-edit" title="Editar" onclick="onEdit('${p.id}')">✏️</button>
            <button class="icon-btn icon-del" title="Eliminar" onclick="onDelete('${p.id}')">🗑️</button>
          </td>
        </tr>
      `).join('');
    }

    // ===== MODAL =====
    const backdrop = qs('#backdrop');
    const modal = qs('#modal');
    function openModal(title='Nuevo Proyecto'){
      qs('#modalTitle').textContent = title;
      backdrop.style.display = 'flex';
      requestAnimationFrame(()=> modal.classList.add('open'));
    }
    function closeModal(){
      modal.classList.remove('open');
      setTimeout(()=> backdrop.style.display='none', 150);
      qs('#formProyecto').reset();
      state.editingId = null;
    }

    // ===== CRUD EVENTS =====
    function onEdit(id){
      const p = Store.all().find(x => x.id === id);
      if(!p) return;
      state.editingId = id;
      const f = qs('#formProyecto');
      f.nombre.value = p.nombre;
      f.codigo.value = p.codigo;
      f.cliente.value = p.cliente;
      f.estado.value = p.estado;
      f.progreso.value = p.progreso;
      f.presupuesto.value = p.presupuesto;
      f.fechaLimite.value = p.fechaLimite;
      f.descripcion.value = p.descripcion || '';
      openModal('Editar Proyecto');
    }

    function onDelete(id){
      const p = Store.all().find(x => x.id === id);
      if(!p) return;
      const ok = confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`);
      if(!ok) return;
      Store.remove(id);
      Toast.show('Proyecto eliminado correctamente.', 'success', 'Eliminado');
      render();
    }

    // ===== INIT & LISTENERS =====
    function init(){
      Store.seedIfEmpty();
      render();

      // Toolbar
      qs('#btnNuevo').addEventListener('click', () => openModal('Nuevo Proyecto'));
      qs('#inputSearch').addEventListener('input', e => { state.search = e.target.value; render(); });
      qs('#filterEstado').addEventListener('change', e => { state.filtroEstado = e.target.value; render(); });
      qs('#sortBy').addEventListener('change', e => { state.sort = e.target.value; render(); });

      // Export/Import
      qs('#btnExport').addEventListener('click', () => {
        const data = JSON.stringify(Store.all(), null, 2);
        const blob = new Blob([data], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `proyectos_${Date.now()}.json`;
        a.click();
      });
      qs('#btnImport').addEventListener('click', () => qs('#fileImport').click());
      qs('#fileImport').addEventListener('change', async (e) => {
        const file = e.target.files[0]; if(!file) return;
        const text = await file.text();
        try { const arr = JSON.parse(text); if(!Array.isArray(arr)) throw new Error('Formato no válido');
          Store.save(arr); Toast.show('Proyectos importados con éxito','success','Importación'); render();
        } catch(err){ Toast.show('No se pudo importar: '+err.message, 'error', 'Error'); }
        e.target.value = '';
      });

      // Modal
      qs('#btnClose').addEventListener('click', closeModal);
      qs('#btnCancel').addEventListener('click', closeModal);
      backdrop.addEventListener('click', (e) => { if(e.target === backdrop) closeModal(); });

      // Submit
      qs('#formProyecto').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        // Validaciones básicas
        const prog = Number(f.progreso.value);
        if (prog < 0 || prog > 100) { Toast.show('El progreso debe estar entre 0 y 100.','warn','Validación'); return; }

        const payload = {
          id: state.editingId || crypto.randomUUID(),
          nombre: f.nombre.value.trim(),
          codigo: f.codigo.value.trim(),
          cliente: f.cliente.value.trim(),
          estado: f.estado.value,
          progreso: Number(f.progreso.value || 0),
          presupuesto: Number(f.presupuesto.value || 0),
          fechaLimite: f.fechaLimite.value,
          descripcion: f.descripcion.value.trim(),
          createdAt: state.editingId ? (Store.all().find(x=>x.id===state.editingId)?.createdAt || Date.now()) : Date.now()
        };

        // Simular colisión de código (único)
        const dup = Store.all().some(x => x.codigo.toLowerCase() === payload.codigo.toLowerCase() && x.id !== payload.id);
        if (dup) { Toast.show('Ya existe un proyecto con ese código.', 'warn', 'Duplicado'); return; }

        Store.upsert(payload);
        closeModal();
        Toast.show(state.editingId ? 'Proyecto actualizado.' : 'Proyecto creado.', 'success', 'Guardado');
        render();
      });
    }

    // ===== API HOOK (reemplazo fácil) =====
    // Si luego quieres conectar a Flask/Express:
    // - Reemplaza las llamadas Store.* por fetch('/api/proyectos', { ... })
    // - Mantén el mismo shape de objeto para minimizar cambios en la UI.

    document.addEventListener('DOMContentLoaded', init);

    // Make helpers global for inline handlers
    window.onEdit = onEdit;
    window.onDelete = onDelete;