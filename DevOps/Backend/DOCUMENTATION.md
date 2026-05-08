# 📚 Documentation du Projet — Portfolio Full Stack

> **Stack :** Node.js · Express · MongoDB (Mongoose) · HTML/CSS/JavaScript vanilla  
> **Mode actuel :** données en mémoire (MongoDB non connecté)

---

## 📁 Structure du projet

```
Node/
├── app.js                          → Point d'entrée du serveur
├── package.json                    → Dépendances npm
├── .env                            → Variables d'environnement
├── src/
│   ├── config/
│   │   └── connectdb.js            → Connexion à MongoDB
│   ├── models/
│   │   └── project.model.js        → Schéma de données (Mongoose)
│   ├── controllers/
│   │   └── project.controller.js   → Logique métier CRUD
│   └── routes/
│       └── project.routes.js       → Définition des routes API
└── Frontend/
    └── public/
        ├── index.html              → Page HTML principale
        ├── css/
        │   └── style.css           → Styles de l'interface
        └── js/
            ├── api.js              → Appels HTTP vers le backend
            ├── projects.js         → Gestion CRUD côté front
            └── main.js             → Animations et interactions UI
```

---

## ⚙️ Fichiers Backend

---

### 1. `.env` — Variables d'environnement

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/portfolio
```

Ce fichier contient les variables sensibles de configuration :
- **PORT** : le port sur lequel le serveur Express écoute (3000 par défaut).
- **MONGO_URI** : la chaîne de connexion à la base de données MongoDB. Elle pointe vers une instance locale avec une base nommée `portfolio`.

> ⚠️ Ce fichier ne doit jamais être partagé publiquement (ajoutez-le dans `.gitignore`).

---

### 2. `app.js` — Point d'entrée de l'application

C'est le fichier principal qui démarre le serveur Express.

**Ce qu'il fait :**
- Charge les variables d'environnement avec `dotenv`.
- Crée une instance Express.
- Active les middlewares : `cors` (autorise les requêtes cross-origin), `express.json()` (parse le JSON), `express.urlencoded()` (parse les formulaires).
- Sert les fichiers statiques du front depuis `Frontend/public/`.
- Monte les routes API sous le préfixe `/api/projects`.
- Définit une route fallback `*` qui renvoie toujours `index.html` (utile pour les SPA).
- Lance le serveur sur le port défini dans `.env`.

**Connexion MongoDB (désactivée pour l'instant) :**
```js
// const connectDB = require('./src/config/connectdb');
// connectDB(); // ← décommenter quand MongoDB est prêt
```

---

### 3. `src/config/connectdb.js` — Connexion à MongoDB

Ce module gère la connexion à MongoDB via Mongoose.

**Fonctionnement :**
- La fonction `connectDB` est asynchrone.
- Elle appelle `mongoose.connect()` avec l'URI définie dans `.env`.
- En cas de succès, elle affiche l'hôte connecté dans la console.
- En cas d'échec, elle affiche l'erreur et arrête le processus avec `process.exit(1)` pour éviter que le serveur tourne sans base de données.

```js
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur : ${error.message}`);
    process.exit(1);
  }
};
```

---

### 4. `src/models/project.model.js` — Modèle de données

Définit la structure d'un projet dans MongoDB via un schéma Mongoose.

**Champs du modèle :**

| Champ          | Type   | Obligatoire | Valeurs possibles                        | Description                        |
|----------------|--------|-------------|------------------------------------------|------------------------------------|
| `title`        | String | ✅ Oui      | —                                        | Titre du projet                    |
| `description`  | String | ✅ Oui      | —                                        | Description détaillée              |
| `category`     | String | ✅ Oui      | `web`, `mobile`, `api`                   | Catégorie du projet                |
| `technologies` | String | Non         | —                                        | Technologies utilisées (ex: React) |
| `status`       | String | Non         | `completed`, `in-progress`, `archived`   | État du projet (défaut: completed) |
| `github`       | String | Non         | —                                        | Lien vers le dépôt GitHub          |
| `demo`         | String | Non         | —                                        | Lien vers la démo en ligne         |
| `image`        | String | Non         | —                                        | URL de l'image de couverture       |
| `createdAt`    | Date   | Auto        | —                                        | Date de création (timestamps)      |
| `updatedAt`    | Date   | Auto        | —                                        | Date de modification (timestamps)  |

L'option `timestamps: true` ajoute automatiquement `createdAt` et `updatedAt`.

---

### 5. `src/controllers/project.controller.js` — Logique métier

Contient les 5 fonctions qui traitent les requêtes HTTP pour chaque opération CRUD.

> **Mode actuel :** les données sont stockées dans un tableau JavaScript en mémoire (`inMemoryProjects`). Les lignes MongoDB sont commentées et prêtes à être activées.

---

#### `createProject` — POST /api/projects

Ajoute un nouveau projet.

- Vérifie que `title`, `description` et `category` sont présents (sinon retourne 400).
- Crée un objet projet avec un ID généré automatiquement.
- L'ajoute au tableau `inMemoryProjects`.
- Retourne le projet créé avec le statut **201**.

```js
// MongoDB (quand prêt) :
const project = await Project.create({ title, description, category, ... });
```

---

#### `getAllProjects` — GET /api/projects

Retourne tous les projets.

- Lit le tableau `inMemoryProjects` et le retourne en JSON avec le statut **200**.

```js
// MongoDB (quand prêt) :
const projects = await Project.find().sort({ createdAt: -1 });
```

---

#### `getProjectById` — GET /api/projects/:id

Retourne un seul projet par son identifiant.

- Recherche le projet par `_id` dans le tableau.
- Si introuvable, retourne **404** avec un message d'erreur.
- Sinon retourne le projet avec le statut **200**.

```js
// MongoDB (quand prêt) :
const project = await Project.findById(id);
```

---

#### `updateProject` — PUT /api/projects/:id

Modifie les informations d'un projet existant.

- Recherche le projet par son index dans le tableau.
- Si introuvable, retourne **404**.
- Fusionne les nouvelles données avec `{ ...ancien, ...updates }` et met à jour `updatedAt`.
- Retourne le projet modifié avec le statut **200**.

```js
// MongoDB (quand prêt) :
const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
```

---

#### `deleteProject` — DELETE /api/projects/:id

Supprime un projet.

- Recherche le projet par son index.
- Si introuvable, retourne **404**.
- Le supprime avec `splice()`.
- Retourne un message de confirmation avec le statut **200**.

```js
// MongoDB (quand prêt) :
const project = await Project.findByIdAndDelete(id);
```

---

### 6. `src/routes/project.routes.js` — Routes API

Définit les 5 routes REST et les associe aux fonctions du contrôleur.

| Méthode  | Route               | Contrôleur        | Description                    |
|----------|---------------------|-------------------|--------------------------------|
| POST     | `/api/projects`     | `createProject`   | Ajouter un projet              |
| GET      | `/api/projects`     | `getAllProjects`   | Retourner tous les projets     |
| GET      | `/api/projects/:id` | `getProjectById`  | Retourner un projet par son ID |
| PUT      | `/api/projects/:id` | `updateProject`   | Modifier un projet             |
| DELETE   | `/api/projects/:id` | `deleteProject`   | Supprimer un projet            |

```js
router.post('/',      createProject);
router.get('/',       getAllProjects);
router.get('/:id',    getProjectById);
router.put('/:id',    updateProject);
router.delete('/:id', deleteProject);
```

---

## 🖥️ Fichiers Frontend

---

### 7. `Frontend/public/index.html` — Page principale

Fichier HTML unique qui structure toute l'interface du portfolio.

**Sections de la page :**

| Section   | ID HTML     | Description                                              |
|-----------|-------------|----------------------------------------------------------|
| Navbar    | `#navbar`   | Barre de navigation fixe avec liens d'ancrage            |
| Hero      | `#hero`     | Section d'accueil avec nom, titre animé et carte de code |
| À propos  | `#about`    | Présentation personnelle avec statistiques               |
| Skills    | `#skills`   | Grille de compétences avec barres de progression         |
| Projets   | `#projects` | Liste des projets avec filtres et boutons CRUD           |
| Contact   | `#contact`  | Formulaire de contact et informations                    |
| Footer    | —           | Pied de page avec liens sociaux                          |

**Modals inclus dans le HTML :**
- `#projectModal` : formulaire d'ajout / modification d'un projet.
- `#detailModal` : affichage complet des informations d'un projet.
- `#confirmModal` : confirmation avant suppression d'un projet.
- `#toastContainer` : zone d'affichage des notifications toast.

**Scripts chargés en fin de body (ordre important) :**
```html
<script src="js/api.js"></script>      <!-- 1. Couche HTTP -->
<script src="js/projects.js"></script> <!-- 2. Logique CRUD (utilise API) -->
<script src="js/main.js"></script>     <!-- 3. UI (utilise Toast et Projects) -->
```

---

### 8. `Frontend/public/js/api.js` — Couche d'accès au backend

Module IIFE (fonction auto-exécutée) qui centralise tous les appels HTTP vers l'API Express.

**Fonction interne `request(method, endpoint, body)` :**
- Construit les options fetch (méthode, headers JSON, body si présent).
- Appelle `fetch('/api' + endpoint)`.
- Parse la réponse JSON.
- Lance une erreur si le statut HTTP n'est pas OK.

**Méthodes exposées :**

| Méthode              | Appel HTTP                        | Description                  |
|----------------------|-----------------------------------|------------------------------|
| `API.getAllProjects()`| GET `/api/projects`               | Récupère tous les projets    |
| `API.getProject(id)` | GET `/api/projects/:id`           | Récupère un projet           |
| `API.createProject()`| POST `/api/projects`              | Crée un projet               |
| `API.updateProject()`| PUT `/api/projects/:id`           | Modifie un projet            |
| `API.deleteProject()`| DELETE `/api/projects/:id`        | Supprime un projet           |

---

### 9. `Frontend/public/js/projects.js` — Gestion CRUD des projets

Module IIFE qui gère tout le cycle de vie des projets dans l'interface : affichage, filtres, modals, formulaires.

**Variables internes :**
- `allProjects` : tableau local de tous les projets chargés depuis l'API.
- `currentFilter` : filtre actif (`all`, `web`, `mobile`, `api`).
- `pendingDeleteId` : ID du projet en attente de suppression.

**Fonctions principales :**

| Fonction               | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| `loadProjects()`       | Appelle `API.getAllProjects()`, affiche le spinner, puis rend les cartes  |
| `renderProjects()`     | Génère dynamiquement les cartes HTML des projets filtrés                 |
| `openAddModal()`       | Réinitialise et ouvre le formulaire en mode "Ajouter"                    |
| `openEditModal(id)`    | Appelle `API.getProject(id)`, pré-remplit le formulaire, ouvre le modal  |
| `openDetailModal(id)`  | Appelle `API.getProject(id)`, affiche toutes les infos dans un modal     |
| `handleFormSubmit()`   | Valide le formulaire, appelle `createProject` ou `updateProject` selon le cas |
| `askDelete(id)`        | Stocke l'ID et ouvre le modal de confirmation                            |
| `confirmDeleteHandler()` | Appelle `API.deleteProject()` puis recharge la liste                   |
| `openModal(modal)`     | Affiche un modal et bloque le scroll de la page                          |
| `closeModal(modal)`    | Cache un modal et restaure le scroll                                     |
| `handleGridClick()`    | Délégation d'événements sur la grille pour Voir / Modifier / Supprimer   |
| `init()`               | Initialise tous les écouteurs d'événements et charge les projets         |

**Rendu d'une carte projet :**
Chaque carte affiche : image (ou placeholder), badge catégorie, badge statut, titre, description tronquée, tags technologies, et 3 boutons d'action (Voir, Modifier, Supprimer).

---

### 10. `Frontend/public/js/main.js` — Animations et interactions UI

Gère toutes les fonctionnalités visuelles et interactives de la page.

**Module `Toast` :**
- Crée des notifications temporaires en bas à droite de l'écran.
- 3 types : `success` (vert), `error` (rouge), `info` (violet).
- Disparaît automatiquement après 4 secondes avec une animation de sortie.

**`initNavbar()` :**
- Ajoute la classe `scrolled` à la navbar quand on défile de plus de 50px (fond semi-transparent + blur).
- Gère le menu hamburger pour mobile (toggle de la classe `open`).
- Met à jour le lien actif dans la navbar selon la section visible à l'écran.

**`initTyped()` :**
- Effet de machine à écrire sur le titre du hero.
- Tape et efface en boucle les phrases : `"Développeur Full Stack"`, `"Expert Node.js"`, `"Créateur d'APIs REST"`, `"Passionné de code"`.
- Utilise `setTimeout` récursif avec des délais différents pour taper (100ms), effacer (60ms) et pauser (1800ms).

**`initSkillBars()` :**
- Utilise `IntersectionObserver` pour détecter quand la section Skills entre dans le viewport.
- Anime les barres de progression en lisant l'attribut `data-width` de chaque barre.
- L'animation ne se déclenche qu'une seule fois grâce à `observer.unobserve()`.

**`initScrollReveal()` :**
- Applique un effet d'apparition (fade + slide up) sur les cartes de compétences, la section À propos et le formulaire de contact.
- Utilise `IntersectionObserver` avec un seuil de 10% de visibilité.

**`initContactForm()` :**
- Valide que tous les champs requis sont remplis avant l'envoi.
- Affiche un spinner pendant l'envoi.
- Affiche un toast de succès ou d'erreur selon le résultat.
- ⚠️ L'envoi réel est simulé (`setTimeout`). À remplacer par un vrai appel `fetch('/api/contact', ...)`.

---

### 11. `Frontend/public/css/style.css` — Styles de l'interface

Feuille de style complète du portfolio avec thème sombre.

**Variables CSS (`:root`) :**

| Variable         | Valeur      | Usage                          |
|------------------|-------------|--------------------------------|
| `--primary`      | `#6c63ff`   | Couleur principale (violet)    |
| `--secondary`    | `#ff6584`   | Couleur secondaire (rose)      |
| `--dark`         | `#0f0f1a`   | Fond principal                 |
| `--dark-2`       | `#1a1a2e`   | Fond des sections alternées    |
| `--card-bg`      | `#1e1e35`   | Fond des cartes                |
| `--text`         | `#e2e2f0`   | Texte principal                |
| `--text-muted`   | `#8888aa`   | Texte secondaire               |
| `--success`      | `#4ade80`   | Vert (statut terminé)          |
| `--warning`      | `#fbbf24`   | Jaune (en cours)               |
| `--danger`       | `#f87171`   | Rouge (suppression, erreur)    |
| `--radius`       | `12px`      | Arrondi standard               |
| `--radius-lg`    | `20px`      | Arrondi large (cartes, modals) |
| `--transition`   | `0.3s ease` | Durée des transitions          |

**Animations CSS définies :**
- `blobFloat` : mouvement flottant des blobs de fond du hero.
- `float` : lévitation de la carte de code dans le hero.
- `blink` : clignotement du curseur de l'effet typewriter.
- `bounce` : rebond de la flèche de défilement.
- `fadeInUp` : apparition des cartes projets depuis le bas.
- `spin` : rotation du spinner de chargement.
- `fadeIn` / `slideUp` : animation d'ouverture des modals.
- `toastIn` / `toastOut` : glissement des notifications toast.

**Responsive :**
- `≤ 1024px` : hero en colonne, grille À propos en 1 colonne, contact en 1 colonne.
- `≤ 768px` : navbar mobile avec hamburger, grille projets en 1 colonne, formulaires en 1 colonne, modals en plein écran.

---

## 🔌 Comment brancher MongoDB

Quand votre base de données MongoDB est prête, 3 étapes suffisent :

**1. Dans `.env`, vérifiez l'URI :**
```env
MONGO_URI=mongodb://localhost:27017/portfolio
```

**2. Dans `app.js`, décommentez :**
```js
const connectDB = require('./src/config/connectdb');
// ...
connectDB();
```

**3. Dans `src/controllers/project.controller.js`, décommentez :**
```js
const Project = require('../models/project.model');
```
Et remplacez chaque bloc `// --- MÉMOIRE ---` par le bloc `/* MongoDB */` correspondant.

---

## 🚀 Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer en mode développement (avec rechargement automatique)
npm run dev

# Lancer en mode production
npm start
```

Le portfolio sera accessible sur : **http://localhost:3000**

---

## 📡 Résumé des routes API

| Méthode  | URL                   | Action                          | Réponse succès |
|----------|-----------------------|---------------------------------|----------------|
| `POST`   | `/api/projects`       | Créer un projet                 | 201            |
| `GET`    | `/api/projects`       | Lister tous les projets         | 200            |
| `GET`    | `/api/projects/:id`   | Obtenir un projet par ID        | 200            |
| `PUT`    | `/api/projects/:id`   | Modifier un projet              | 200            |
| `DELETE` | `/api/projects/:id`   | Supprimer un projet             | 200            |
