require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const path          = require('path');

// const connectDB  = require('./src/config/connectdb'); // ← décommenter pour MongoDB

const projectRoutes = require('./src/routes/project.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Connexion MongoDB ─────────────────────────────────────────
// connectDB(); // ← décommenter quand MongoDB est prêt

// ── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Fichiers statiques (front) ────────────────────────────────
app.use(express.static(path.join(__dirname, 'Frontend', 'public')));

// ── Routes API ────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);

// ── Route fallback → index.html ───────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'public', 'index.html'));
});

// ── Démarrage du serveur ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Mode : données en mémoire (MongoDB non connecté)`);
});
