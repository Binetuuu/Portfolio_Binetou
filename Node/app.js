require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const mongoose = require('mongoose');

const projectRoutes = require('./src/routes/project.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Connexion MongoDB Atlas ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://seye10bineta_db_user:2BCIiVtxLYNpCVMW@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.log('❌ Connexion à MongoDB échouée :', err.message));

// ── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Fichiers statiques (front) ────────────────────────────────
app.use(express.static(path.join(__dirname, 'Frontend', 'public')));

// ── Routes API ────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);

// ── Route fallback → index.html ───────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'public', 'index.html'));
});

// ── Démarrage du serveur ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
