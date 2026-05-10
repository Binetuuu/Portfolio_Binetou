# Instructions Docker - Portfolio

## Prérequis
- Docker installé sur Ubuntu
- Compte Docker Hub créé

## 1. Installation de Docker sur Ubuntu

```bash
# Mettre à jour les paquets
sudo apt update

# Installer Docker
sudo apt install docker.io -y

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker (pour éviter sudo)
sudo usermod -aG docker $USER

# Redémarrer la session ou exécuter
newgrp docker

# Installer Docker Compose
sudo apt install docker-compose -y
```

## 2. Construire les images localement

```bash
# Construire l'image Backend
docker build -t votre-username/portfolio-backend:latest ./Backend

# Construire l'image Frontend
docker build -t votre-username/portfolio-frontend:latest ./Frontend
```

## 3. Tester localement avec Docker Compose

```bash
# Lancer tous les services
docker-compose up -d

# Vérifier que les conteneurs fonctionnent
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

Accès aux services :
- Frontend : http://localhost
- Backend API : http://localhost:3000
- MongoDB : localhost:27017

## 4. Publier les images sur Docker Hub

```bash
# Se connecter à Docker Hub
docker login

# Entrer votre username et password Docker Hub

# Pousser l'image Backend
docker push votre-username/portfolio-backend:latest

# Pousser l'image Frontend
docker push votre-username/portfolio-frontend:latest
```

## 5. Utiliser les images depuis Docker Hub

Modifiez le `docker-compose.yml` pour utiliser les images publiées :

```yaml
services:
  backend:
    image: votre-username/portfolio-backend:latest
    # Supprimer la section build:
    
  frontend:
    image: votre-username/portfolio-frontend:latest
    # Supprimer la section build:
```

Puis lancez :
```bash
docker-compose up -d
```

## 6. Commandes utiles

```bash
# Voir toutes les images
docker images

# Voir tous les conteneurs
docker ps -a

# Supprimer une image
docker rmi nom-image

# Supprimer un conteneur
docker rm nom-conteneur

# Nettoyer les ressources inutilisées
docker system prune -a

# Reconstruire et relancer
docker-compose up -d --build

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## 7. Variables d'environnement

Le Backend utilise ces variables (déjà configurées dans docker-compose.yml) :
- `PORT=3000`
- `MONGO_URI=mongodb://mongodb:27017/Node`

## 8. Volumes et persistance

Les données MongoDB sont persistées dans un volume Docker nommé `mongodb_data`.
Pour sauvegarder/restaurer :

```bash
# Sauvegarder
docker exec portfolio-mongodb mongodump --out /data/backup

# Restaurer
docker exec portfolio-mongodb mongorestore /data/backup
```

## Notes importantes

1. **MongoDB** : L'image officielle `mongo:latest` est utilisée directement depuis Docker Hub
2. **Réseau** : Les trois services communiquent via le réseau `portfolio-network`
3. **Ports exposés** :
   - Frontend : 80
   - Backend : 3000
   - MongoDB : 27017

## Dépannage

Si vous rencontrez des problèmes :

```bash
# Vérifier les logs
docker-compose logs

# Redémarrer un service
docker-compose restart backend

# Reconstruire complètement
docker-compose down -v
docker-compose up -d --build
```
