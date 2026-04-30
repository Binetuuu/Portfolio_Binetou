/**
 * projects.js — Gestion CRUD des projets (rendu + modals)
 */
const Projects = (() => {
  let allProjects = [];
  let currentFilter = 'all';
  let pendingDeleteId = null;

  // ── DOM refs ──────────────────────────────────────────────
  const grid        = document.getElementById('projectsGrid');
  const loadingEl   = document.getElementById('loadingState');
  const emptyEl     = document.getElementById('emptyState');
  const countEl     = document.getElementById('projectCount');

  // Modal add/edit
  const projectModal  = document.getElementById('projectModal');
  const modalTitle    = document.getElementById('modalTitle');
  const projectForm   = document.getElementById('projectForm');
  const projectIdEl   = document.getElementById('projectId');
  const titleEl       = document.getElementById('projectTitle');
  const categoryEl    = document.getElementById('projectCategory');
  const descEl        = document.getElementById('projectDescription');
  const techEl        = document.getElementById('projectTech');
  const statusEl      = document.getElementById('projectStatus');
  const githubEl      = document.getElementById('projectGithub');
  const demoEl        = document.getElementById('projectDemo');
  const imageEl       = document.getElementById('projectImage');

  // Modal detail
  const detailModal   = document.getElementById('detailModal');
  const detailTitle   = document.getElementById('detailTitle');
  const detailContent = document.getElementById('detailContent');

  // Modal confirm delete
  const confirmModal  = document.getElementById('confirmModal');

  // ── Helpers ───────────────────────────────────────────────
  function statusLabel(s) {
    return { completed: 'Terminé', 'in-progress': 'En cours', archived: 'Archivé' }[s] || s;
  }
  function categoryLabel(c) {
    return { web: 'Web', mobile: 'Mobile', api: 'API' }[c] || c;
  }
  function badgeClass(c) {
    return { web: 'badge-web', mobile: 'badge-mobile', api: 'badge-api' }[c] || 'badge-web';
  }
  function statusClass(s) {
    return { completed: 'status-completed', 'in-progress': 'status-in-progress', archived: 'status-archived' }[s] || '';
  }

  // ── Render ────────────────────────────────────────────────
  function renderProjects(projects) {
    // Remove old cards (keep loading/empty nodes)
    grid.querySelectorAll('.project-card').forEach(el => el.remove());

    const filtered = currentFilter === 'all'
      ? projects
      : projects.filter(p => p.category === currentFilter);

    countEl.textContent = `${filtered.length} projet(s)`;

    if (filtered.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');

    filtered.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.animationDelay = `${i * 0.08}s`;
      card.dataset.id = p._id || p.id;

      const techTags = (p.technologies || p.tech || '')
        .split(',').map(t => t.trim()).filter(Boolean)
        .map(t => `<span class="tech-tag">${t}</span>`).join('');

      card.innerHTML = `
        <div class="project-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />`
            : `<div class="project-image-placeholder"><i class="fas fa-code"></i></div>`}
          <span class="project-category-badge ${badgeClass(p.category)}">${categoryLabel(p.category)}</span>
          <span class="project-status-badge ${statusClass(p.status)}">${statusLabel(p.status)}</span>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
          <div class="project-actions">
            <button class="btn btn-outline btn-sm" data-action="view" data-id="${p._id || p.id}">
              <i class="fas fa-eye"></i> Voir
            </button>
            <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${p._id || p.id}">
              <i class="fas fa-pen"></i> Modifier
            </button>
            <button class="btn btn-danger btn-sm" data-action="delete" data-id="${p._id || p.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  // ── Load all ──────────────────────────────────────────────
  async function loadProjects() {
    loadingEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    grid.querySelectorAll('.project-card').forEach(el => el.remove());

    try {
      allProjects = await API.getAllProjects();
      renderProjects(allProjects);
    } catch (err) {
      Toast.show('Impossible de charger les projets : ' + err.message, 'error');
      emptyEl.classList.remove('hidden');
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  // ── Open add modal ────────────────────────────────────────
  function openAddModal() {
    modalTitle.textContent = 'Ajouter un projet';
    projectForm.reset();
    projectIdEl.value = '';
    document.getElementById('modalSubmit').innerHTML = '<i class="fas fa-plus"></i> Ajouter';
    openModal(projectModal);
  }

  // ── Open edit modal ───────────────────────────────────────
  async function openEditModal(id) {
    modalTitle.textContent = 'Modifier le projet';
    document.getElementById('modalSubmit').innerHTML = '<i class="fas fa-save"></i> Enregistrer';
    openModal(projectModal);

    try {
      const p = await API.getProject(id);
      projectIdEl.value   = p._id || p.id;
      titleEl.value       = p.title || '';
      categoryEl.value    = p.category || '';
      descEl.value        = p.description || '';
      techEl.value        = p.technologies || p.tech || '';
      statusEl.value      = p.status || 'completed';
      githubEl.value      = p.github || '';
      demoEl.value        = p.demo || '';
      imageEl.value       = p.image || '';
    } catch (err) {
      Toast.show('Impossible de charger le projet : ' + err.message, 'error');
      closeModal(projectModal);
    }
  }

  // ── Open detail modal ─────────────────────────────────────
  async function openDetailModal(id) {
    detailTitle.textContent = 'Chargement...';
    detailContent.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    openModal(detailModal);

    try {
      const p = await API.getProject(id);
      detailTitle.textContent = p.title;

      const techTags = (p.technologies || p.tech || '')
        .split(',').map(t => t.trim()).filter(Boolean)
        .map(t => `<span class="tech-tag">${t}</span>`).join('');

      detailContent.innerHTML = `
        <div class="detail-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.title}" />`
            : `<div class="detail-image-placeholder"><i class="fas fa-code"></i></div>`}
        </div>
        <div class="detail-meta">
          <span class="project-category-badge ${badgeClass(p.category)}">${categoryLabel(p.category)}</span>
          <span class="project-status-badge ${statusClass(p.status)}">${statusLabel(p.status)}</span>
        </div>
        <h2 class="detail-title">${p.title}</h2>
        <p class="detail-desc">${p.description}</p>
        ${techTags ? `<div class="detail-section"><h4>Technologies</h4><div class="project-tech">${techTags}</div></div>` : ''}
        <div class="detail-links">
          ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="fab fa-github"></i> GitHub</a>` : ''}
          ${p.demo   ? `<a href="${p.demo}"   target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
        </div>`;
    } catch (err) {
      detailContent.innerHTML = `<p style="color:var(--danger);padding:20px">Erreur : ${err.message}</p>`;
    }
  }

  // ── Submit form (add or edit) ─────────────────────────────
  async function handleFormSubmit(e) {
    e.preventDefault();
    const id = projectIdEl.value;

    // Validation
    let valid = true;
    [titleEl, categoryEl, descEl].forEach(el => {
      el.classList.toggle('error', !el.value.trim());
      if (!el.value.trim()) valid = false;
    });
    if (!valid) { Toast.show('Veuillez remplir les champs obligatoires.', 'error'); return; }

    const payload = {
      title:        titleEl.value.trim(),
      category:     categoryEl.value,
      description:  descEl.value.trim(),
      technologies: techEl.value.trim(),
      status:       statusEl.value,
      github:       githubEl.value.trim(),
      demo:         demoEl.value.trim(),
      image:        imageEl.value.trim(),
    };

    const submitBtn = document.getElementById('modalSubmit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px"></div> Enregistrement...';

    try {
      if (id) {
        await API.updateProject(id, payload);
        Toast.show('Projet modifié avec succès !', 'success');
      } else {
        await API.createProject(payload);
        Toast.show('Projet ajouté avec succès !', 'success');
      }
      closeModal(projectModal);
      await loadProjects();
    } catch (err) {
      Toast.show('Erreur : ' + err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = id
        ? '<i class="fas fa-save"></i> Enregistrer'
        : '<i class="fas fa-plus"></i> Ajouter';
    }
  }

  // ── Delete ────────────────────────────────────────────────
  function askDelete(id) {
    pendingDeleteId = id;
    openModal(confirmModal);
  }

  async function confirmDeleteHandler() {
    if (!pendingDeleteId) return;
    const btn = document.getElementById('confirmDelete');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div>';

    try {
      await API.deleteProject(pendingDeleteId);
      Toast.show('Projet supprimé.', 'success');
      closeModal(confirmModal);
      await loadProjects();
    } catch (err) {
      Toast.show('Erreur : ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-trash"></i> Supprimer';
      pendingDeleteId = null;
    }
  }

  // ── Modal helpers ─────────────────────────────────────────
  function openModal(modal)  { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
  function closeModal(modal) { modal.classList.add('hidden');    document.body.style.overflow = ''; }

  // ── Event delegation on grid ──────────────────────────────
  function handleGridClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'view')   openDetailModal(id);
    if (action === 'edit')   openEditModal(id);
    if (action === 'delete') askDelete(id);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    loadProjects();

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProjects(allProjects);
      });
    });

    // Add buttons
    document.getElementById('btnAddProject').addEventListener('click', openAddModal);
    document.getElementById('btnAddProjectEmpty').addEventListener('click', openAddModal);

    // Grid delegation
    grid.addEventListener('click', handleGridClick);

    // Form submit
    projectForm.addEventListener('submit', handleFormSubmit);

    // Close modals
    document.getElementById('modalClose').addEventListener('click',   () => closeModal(projectModal));
    document.getElementById('modalCancel').addEventListener('click',  () => closeModal(projectModal));
    document.getElementById('detailClose').addEventListener('click',  () => closeModal(detailModal));
    document.getElementById('confirmClose').addEventListener('click', () => closeModal(confirmModal));
    document.getElementById('confirmCancel').addEventListener('click',() => closeModal(confirmModal));
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteHandler);

    // Close on overlay click
    [projectModal, detailModal, confirmModal].forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
    });

    // Clear error on input
    [titleEl, categoryEl, descEl].forEach(el => {
      el.addEventListener('input', () => el.classList.remove('error'));
    });
  }

  return { init };
})();
