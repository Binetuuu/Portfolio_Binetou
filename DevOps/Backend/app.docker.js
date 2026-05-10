require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');

const projectRoutes = require('./src/routes/project.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Connexion MongoDB ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Node')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée :', err.message));

// ── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes API ────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);

// ── Route de santé ────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Backend API is running',
    endpoints: {
      projects: '/api/projects'
    }
  });
});

// ── Démarrage du serveur ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
