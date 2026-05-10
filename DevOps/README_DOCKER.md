# Déploiement Docker - Portfolio

## Architecture

3 conteneurs Docker :
- **MongoDB** : Base de données (image officielle)
- **Backend** : API Node.js + Express
- **Frontend** : Site web servi par Nginx

## Installation et Démarrage

```bash
# 1. Aller dans le dossier DevOps
cd ~/Portfolio_Binetou/DevOps

# 2. Construire les images
docker build -t binetuuu/portfolio-backend:latest ./Backend
docker build -t binetuuu/portfolio-frontend:latest ./Frontend

# 3. Lancer tous les services
docker-compose up -d

# 4. Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f
```

## Accès à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:3000
- **Test API** : http://localhost:3000/api/projects

## Publier sur Docker Hub

```bash
# Se connecter
docker login

# Publier les images
docker push binetuuu/portfolio-backend:latest
docker push binetuuu/portfolio-frontend:latest
```

## Commandes utiles

```bash
# Arrêter tous les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Redémarrer un service
docker-compose restart backend

# Reconstruire et relancer
docker-compose down
docker build -t binetuuu/portfolio-backend:latest ./Backend
docker build -t binetuuu/portfolio-frontend:latest ./Frontend
docker-compose up -d

# Nettoyer complètement (attention : supprime les données MongoDB)
docker-compose down -v
```

## Structure des fichiers

```
DevOps/
├── Backend/
│   ├── Dockerfile              # Configuration Docker du backend
│   ├── app.js                  # Application originale
│   ├── app.docker.js           # Application pour Docker (API seulement)
│   └── ...
├── Frontend/
│   ├── Dockerfile              # Configuration Docker du frontend
│   ├── nginx.conf              # Configuration Nginx (proxy API)
│   └── public/                 # Fichiers statiques du site
└── docker-compose.yml          # Orchestration des 3 services
```

## Dépannage

### Les conteneurs ne démarrent pas

```bash
# Voir les erreurs
docker-compose logs

# Redémarrer proprement
docker-compose down
docker-compose up -d
```

### Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB est bien démarré
docker-compose ps

# Voir les logs MongoDB
docker-compose logs mongodb
```

### Reconstruire après modification du code

```bash
# Arrêter
docker-compose down

# Supprimer les anciennes images
docker rmi binetuuu/portfolio-backend:latest
docker rmi binetuuu/portfolio-frontend:latest

# Reconstruire
docker build -t binetuuu/portfolio-backend:latest ./Backend
docker build -t binetuuu/portfolio-frontend:latest ./Frontend

# Relancer
docker-compose up -d
```

## Notes importantes

- MongoDB stocke les données dans un volume Docker (`mongodb_data`)
- Les données persistent même après `docker-compose down`
- Pour supprimer les données : `docker-compose down -v`
- Le Backend utilise `app.docker.js` qui sert uniquement l'API
- Le Frontend utilise Nginx qui redirige `/api/*` vers le Backend
