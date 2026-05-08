const express = require('express');
const router  = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

/**
 * Routes de l'API projets
 *
 * POST   /api/projects          → Ajouter un projet
 * GET    /api/projects          → Retourner tous les projets
 * GET    /api/projects/:id      → Retourner un projet donné
 * PUT    /api/projects/:id      → Modifier un projet
 * DELETE /api/projects/:id      → Supprimer un projet
 */
router.post('/',    createProject);
router.get('/',     getAllProjects);
router.get('/:id',  getProjectById);
router.put('/:id',  updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
