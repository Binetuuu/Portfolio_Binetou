# 🚀 Kubernetes Deployment avec Kind

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Déploiement](#déploiement)
4. [Accès aux services](#accès-aux-services)
5. [Intégration Jenkins](#intégration-jenkins)
6. [Dépannage](#dépannage)

---

## 📦 Prérequis

- **Docker** : Installé et en cours d'exécution
- **Kind** : Cluster déjà créé (`portfolio`)
- **kubectl** : Configuré pour accéder au cluster
- **Docker images** : Backend et Frontend construites

Vérifiez avec :
```bash
kind get clusters
kubectl get nodes
```

---

## 📥 Installation

### 1. Charger les images Docker dans Kind

```bash
cd DevOps/kubernetes

# Construire et charger les images
./load-images.sh

# Ou manuellement
kind load docker-image binetuuu/portfolio-backend:latest --name portfolio
kind load docker-image binetuuu/portfolio-frontend:latest --name portfolio
```

### 2. Déployer tous les services

```bash
./deploy.sh
```

Ou déployer manuellement :
```bash
kubectl apply -f namespace.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml
```

---

## 🚀 Déploiement

### Étape 1 : Créer le namespace
```bash
kubectl apply -f namespace.yaml
```

### Étape 2 : Déployer MongoDB
```bash
kubectl apply -f mongodb-deployment.yaml

# Attendre que MongoDB soit prêt
kubectl wait --for=condition=ready pod -l app=mongodb -n portfolio --timeout=300s
```

### Étape 3 : Déployer le Backend
```bash
kubectl apply -f backend-deployment.yaml

# Attendre que le Backend soit prêt
kubectl wait --for=condition=ready pod -l app=backend -n portfolio --timeout=300s
```

### Étape 4 : Déployer le Frontend
```bash
kubectl apply -f frontend-deployment.yaml

# Attendre que le Frontend soit prêt
kubectl wait --for=condition=ready pod -l app=frontend -n portfolio --timeout=300s
```

### Étape 5 : Configurer l'Ingress
```bash
kubectl apply -f ingress.yaml
```

---

## 🌐 Accès aux services

### Port Forwarding

```bash
# Frontend
kubectl port-forward -n portfolio svc/frontend 8080:80

# Backend
kubectl port-forward -n portfolio svc/backend 3000:3000

# MongoDB
kubectl port-forward -n portfolio svc/mongodb 27017:27017
```

Ou utiliser le script :
```bash
./portforward.sh
```

### Vérifier le statut

```bash
# Voir tous les pods
kubectl get pods -n portfolio

# Voir les services
kubectl get svc -n portfolio

# Voir l'ingress
kubectl get ingress -n portfolio

# Voir les logs
kubectl logs -n portfolio -l app=backend -f
```

---

## 🔗 Intégration Jenkins

### Configuration Jenkins pour Kubernetes

1. **Installer le plugin Kubernetes**
   - Manage Jenkins → Manage Plugins
   - Chercher "Kubernetes"
   - Installer et redémarrer

2. **Configurer les credentials**
   - Ajouter une credential de type "Secret file"
   - Uploader votre kubeconfig
   - ID : `kubeconfig-portfolio`

3. **Créer un pipeline Jenkins**
   - Utiliser le fichier `Jenkinsfile-kubernetes`
   - Pointer vers ce Jenkinsfile dans la config

4. **Variables d'environnement**
   - `KIND_CLUSTER` : nom du cluster (portfolio)
   - `KUBECONFIG` : chemin vers kubeconfig

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Kubernetes Cluster (Kind - Portfolio)         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Namespace: portfolio                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  Frontend (2 replicas)                          │   │
│  │  ├── Pod 1: Nginx                              │   │
│  │  └── Pod 2: Nginx                              │   │
│  │  Service: LoadBalancer (Port 80)               │   │
│  │                                                  │   │
│  │  Backend (2 replicas)                           │   │
│  │  ├── Pod 1: Express.js                         │   │
│  │  └── Pod 2: Express.js                         │   │
│  │  Service: ClusterIP (Port 3000)                │   │
│  │                                                  │   │
│  │  MongoDB (1 replica)                            │   │
│  │  ├── Pod 1: MongoDB                            │   │
│  │  Service: ClusterIP (Port 27017)               │   │
│  │  PVC: 5Gi storage                              │   │
│  │                                                  │   │
│  │  Ingress: portfolio-ingress                    │   │
│  │  ├── portfolio.local → Frontend                │   │
│  │  └── portfolio.local/api → Backend             │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Fichiers de configuration

### namespace.yaml
- Crée le namespace `portfolio`

### mongodb-deployment.yaml
- Déploie MongoDB avec stockage persistant
- Utilisateur admin : `admin` / `admin123`
- Volume : 5Gi

### backend-deployment.yaml
- Déploie 2 replicas du Backend
- Port : 3000
- Connecté à MongoDB

### frontend-deployment.yaml
- Déploie 2 replicas du Frontend (Nginx)
- Port : 80
- Configuration Nginx pour proxy /api vers le Backend

### ingress.yaml
- Configure le routage HTTP
- Domaine : `portfolio.local`
- Routage : `/` → Frontend, `/api` → Backend

---

## 📋 Commandes utiles

```bash
# État général
kubectl get all -n portfolio
kubectl describe node

# Pods
kubectl get pods -n portfolio
kubectl describe pod <pod-name> -n portfolio
kubectl logs <pod-name> -n portfolio
kubectl exec -it <pod-name> -n portfolio -- /bin/bash

# Services
kubectl get svc -n portfolio
kubectl port-forward svc/backend 3000:3000 -n portfolio

# Ingress
kubectl get ingress -n portfolio
kubectl describe ingress portfolio-ingress -n portfolio

# Ressources
kubectl top nodes
kubectl top pods -n portfolio

# Suppression
kubectl delete namespace portfolio
```

---

## 🔍 Dépannage

### Pod ne démarre pas

```bash
# Vérifier le statut
kubectl describe pod <pod-name> -n portfolio

# Voir les événements
kubectl get events -n portfolio

# Voir les logs
kubectl logs <pod-name> -n portfolio
```

### Connection refusée

```bash
# Vérifier que le service existe
kubectl get svc -n portfolio

# Tester la connection
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- sh
curl http://backend:3000
```

### Ingress ne fonctionne pas

```bash
# Vérifier l'ingress
kubectl get ingress -n portfolio
kubectl describe ingress portfolio-ingress -n portfolio

# Ajouter l'entry hosts
echo "127.0.0.1 portfolio.local" >> /etc/hosts
```

### Base de données vide

```bash
# Vérifier MongoDB
kubectl exec -it $(kubectl get pod -l app=mongodb -n portfolio -o name) -n portfolio -- mongosh admin --eval "db.auth('admin', 'admin123')"

# Restaurer si nécessaire
kubectl cp backup.dump portfolio/$(kubectl get pod -l app=mongodb -n portfolio -o name):/restore.dump
```

---

## ✅ Checklist déploiement

- [ ] Cluster Kind créé et actif
- [ ] Images Docker construites
- [ ] Images chargées dans Kind
- [ ] Namespace créé
- [ ] MongoDB déployé et prêt
- [ ] Backend déployé et prêt
- [ ] Frontend déployé et prêt
- [ ] Ingress configuré
- [ ] Services accessibles via port-forward
- [ ] Logs vérifiés, pas d'erreurs

---

## 🎯 Prochaines étapes

1. Vérifier que tous les pods sont en Running
2. Accéder au Frontend via localhost:8080
3. Vérifier la connexion Backend → MongoDB
4. Configurer les logs et monitoring
5. Intégrer avec Jenkins

