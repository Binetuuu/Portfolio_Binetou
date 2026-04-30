/**
 * project.controller.js
 * Logique métier pour la gestion des projets.
 *
 * NOTE : MongoDB n'est pas encore connecté.
 * On utilise un tableau en mémoire (inMemoryProjects) comme base de données temporaire.
 * Quand vous serez prêt à brancher MongoDB, il suffira de décommenter les lignes
 * Mongoose et de supprimer les blocs "// --- MÉMOIRE ---".
 */

// const Project = require('../models/project.model'); // ← décommenter pour MongoDB

// ── Base de données temporaire en mémoire ─────────────────────
let inMemoryProjects = [];
let nextId = 1;

// Helper : simuler un _id MongoDB
function generateId() {
  return String(nextId++);
}
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/projects
 * Ajouter un projet
 */
const createProject = async (req, res) => {
  try {
    const { title, description, category, technologies, status, github, demo, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Titre, description et catégorie sont obligatoires.' });
    }

    // --- MÉMOIRE ---
    const project = {
      _id: generateId(),
      title,
      description,
      category,
      technologies: technologies || '',
      status: status || 'completed',
      github: github || '',
      demo: demo || '',
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryProjects.push(project);
    // --- FIN MÉMOIRE ---

    /* MongoDB (décommenter quand prêt) :
    const project = await Project.create({ title, description, category, technologies, status, github, demo, image });
    */

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/projects
 * Retourner tous les projets
 */
const getAllProjects = async (req, res) => {
  try {
    // --- MÉMOIRE ---
    const projects = inMemoryProjects;
    // --- FIN MÉMOIRE ---

    /* MongoDB (décommenter quand prêt) :
    const projects = await Project.find().sort({ createdAt: -1 });
    */

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/projects/:id
 * Retourner toutes les informations d'un projet donné
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // --- MÉMOIRE ---
    const project = inMemoryProjects.find(p => p._id === id);
    // --- FIN MÉMOIRE ---

    /* MongoDB (décommenter quand prêt) :
    const project = await Project.findById(id);
    */

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/projects/:id
 * Modifier les informations d'un projet donné
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // --- MÉMOIRE ---
    const index = inMemoryProjects.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    inMemoryProjects[index] = { ...inMemoryProjects[index], ...updates, updatedAt: new Date() };
    const project = inMemoryProjects[index];
    // --- FIN MÉMOIRE ---

    /* MongoDB (décommenter quand prêt) :
    const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Projet introuvable.' });
    */

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/projects/:id
 * Supprimer un projet
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // --- MÉMOIRE ---
    const index = inMemoryProjects.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    inMemoryProjects.splice(index, 1);
    // --- FIN MÉMOIRE ---

    /* MongoDB (décommenter quand prêt) :
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable.' });
    */

    res.status(200).json({ message: 'Projet supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
