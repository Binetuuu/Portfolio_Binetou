# 📁 Portfolio React — Guide de démarrage

## Structure du projet

```
portfolio/
├── db.json                        ← Base de données json-server
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js                   ← Point d'entrée React
    ├── index.css                  ← Styles globaux
    ├── App.jsx                    ← Composant racine
    ├── api.js                     ← Couche d'accès à l'API REST
    └── components/
        ├── Dossier.jsx            ← Gère la liste des projets (CRUD)
        ├── Projet.jsx             ← Affiche une carte projet
        ├── AjouterProjet.jsx      ← Formulaire d'ajout
        └── DetaillerProjet.jsx    ← Détail + édition d'un projet
```

## Prérequis

- Node.js ≥ 16
- npm ≥ 8

## Installation

```bash
npm install
npm install -g concurrently   # optionnel, pour lancer les 2 serveurs ensemble
```

## Lancement

### Option A — deux terminaux séparés

**Terminal 1 — API REST (json-server sur le port 3001)**
```bash
npm run server
```

**Terminal 2 — Application React (port 3000)**
```bash
npm start
```

### Option B — un seul terminal (nécessite concurrently)

```bash
npm install concurrently --save-dev
npm run dev
```

Ouvrez ensuite http://localhost:3000

## Fonctionnalités

| Fonctionnalité | Composant concerné |
|---|---|
| Lister les projets | `Dossier` + `Projet` |
| Rechercher un projet | `Dossier` (filtre local) |
| Ajouter un projet | `AjouterProjet` → POST /projets |
| Supprimer un projet | `Projet` → DELETE /projets/:id |
| Afficher le détail | `DetaillerProjet` (clic sur le libellé) |
| Éditer un projet | `DetaillerProjet` (mode édition) → PUT /projets/:id |
| Annuler le détail | `DetaillerProjet` bouton Annuler |
| Persistance côté serveur | `api.js` + `json-server` + `db.json` |

## API REST disponible (json-server)

| Méthode | URL | Action |
|---|---|---|
| GET | /projets | Liste tous les projets |
| GET | /projets/:id | Détail d'un projet |
| POST | /projets | Créer un projet |
| PUT | /projets/:id | Modifier un projet |
| DELETE | /projets/:id | Supprimer un projet |
