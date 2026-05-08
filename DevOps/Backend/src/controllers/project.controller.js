/**
 * project.controller.js
 * Logique métier pour la gestion des projets — connecté à MongoDB via Mongoose.
 */

const Project = require('../models/project.model');

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

    const project = await Project.create({
      title,
      description,
      category,
      technologies,
      status,
      github,
      demo,
      image,
    });

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
    const projects = await Project.find().sort({ createdAt: -1 });
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
    const project = await Project.findById(req.params.id);

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
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

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
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

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
