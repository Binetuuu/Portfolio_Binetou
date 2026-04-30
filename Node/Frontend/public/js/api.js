/**
 * api.js — Couche d'accès au backend Express
 * Adaptez BASE_URL selon votre configuration serveur.
 */
const API = (() => {
  const BASE_URL = '/api';

  async function request(method, endpoint, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Erreur ${res.status}`);
    }
    return data;
  }

  return {
    /** GET /api/projects — Retourner tous les projets */
    getAllProjects: () => request('GET', '/projects'),

    /** GET /api/projects/:id — Retourner un projet donné */
    getProject: (id) => request('GET', `/projects/${id}`),

    /** POST /api/projects — Ajouter un projet */
    createProject: (payload) => request('POST', '/projects', payload),

    /** PUT /api/projects/:id — Modifier un projet */
    updateProject: (id, payload) => request('PUT', `/projects/${id}`, payload),

    /** DELETE /api/projects/:id — Supprimer un projet */
    deleteProject: (id) => request('DELETE', `/projects/${id}`),
  };
})();
