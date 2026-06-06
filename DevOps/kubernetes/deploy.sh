#!/bin/bash

set -e

CLUSTER_NAME="portfolio"
REGISTRY="binetuuu"
BACKEND_IMAGE="$REGISTRY/portfolio-backend:latest"
FRONTEND_IMAGE="$REGISTRY/portfolio-frontend:latest"

echo "======================================"
echo "🚀 Portfolio Kubernetes Deployment"
echo "======================================"

# 1. Vérifier que Kind est disponible
echo "✓ Vérification de Kind..."
if ! command -v kind &> /dev/null; then
    echo "❌ Kind n'est pas installé"
    exit 1
fi

# 2. Vérifier que kubectl est disponible
echo "✓ Vérification de kubectl..."
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl n'est pas installé"
    exit 1
fi

# 3. Vérifier que le cluster existe
echo "✓ Vérification du cluster '$CLUSTER_NAME'..."
if ! kind get clusters | grep -q "^$CLUSTER_NAME$"; then
    echo "❌ Cluster '$CLUSTER_NAME' n'existe pas"
    echo "Créez-le avec: kind create cluster --name portfolio"
    exit 1
fi

# 4. Configurer kubectl
echo "✓ Configuration de kubectl..."
kubectl cluster-info --context kind-$CLUSTER_NAME

# 5. Charger les images dans Kind
echo ""
echo "📦 Chargement des images Docker dans Kind..."
echo "   - Backend: $BACKEND_IMAGE"
kind load docker-image $BACKEND_IMAGE --name $CLUSTER_NAME || echo "⚠️  Backend image non trouvée localement"

echo "   - Frontend: $FRONTEND_IMAGE"
kind load docker-image $FRONTEND_IMAGE --name $CLUSTER_NAME || echo "⚠️  Frontend image non trouvée localement"

# 6. Créer le namespace
echo ""
echo "📝 Création du namespace 'portfolio'..."
kubectl apply -f namespace.yaml

# 7. Déployer MongoDB
echo ""
echo "🗄️  Déploiement de MongoDB..."
kubectl apply -f mongodb-deployment.yaml
echo "   Attente de MongoDB..."
kubectl wait --for=condition=ready pod -l app=mongodb -n portfolio --timeout=300s

# 8. Déployer le Backend
echo ""
echo "🔧 Déploiement du Backend..."
kubectl apply -f backend-deployment.yaml
echo "   Attente du Backend..."
kubectl wait --for=condition=ready pod -l app=backend -n portfolio --timeout=300s

# 9. Déployer le Frontend
echo ""
echo "🎨 Déploiement du Frontend..."
kubectl apply -f frontend-deployment.yaml
echo "   Attente du Frontend..."
kubectl wait --for=condition=ready pod -l app=frontend -n portfolio --timeout=300s

# 10. Créer l'Ingress
echo ""
echo "🌐 Création de l'Ingress..."
kubectl apply -f ingress.yaml

# 11. Afficher les informations
echo ""
echo "======================================"
echo "✅ Déploiement terminé !"
echo "======================================"
echo ""
echo "📊 Pods actifs:"
kubectl get pods -n portfolio

echo ""
echo "📝 Services:"
kubectl get svc -n portfolio

echo ""
echo "🌐 Ingress:"
kubectl get ingress -n portfolio

echo ""
echo "🔗 Accès aux services:"
echo "   Frontend (via LoadBalancer): kubectl port-forward -n portfolio svc/frontend 8080:80"
echo "   Backend (via service): kubectl port-forward -n portfolio svc/backend 3000:3000"
echo "   MongoDB (via service): kubectl port-forward -n portfolio svc/mongodb 27017:27017"

echo ""
echo "📊 Voir les logs:"
echo "   Backend: kubectl logs -n portfolio -l app=backend -f"
echo "   Frontend: kubectl logs -n portfolio -l app=frontend -f"
echo "   MongoDB: kubectl logs -n portfolio -l app=mongodb -f"

echo ""
echo "======================================"
