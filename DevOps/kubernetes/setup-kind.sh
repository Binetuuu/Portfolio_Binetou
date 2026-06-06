#!/bin/bash

set -e

CLUSTER_NAME="portfolio"

echo "======================================"
echo "🔧 Configuration du cluster Kind"
echo "======================================"

# 1. Créer le cluster
echo "✓ Création du cluster '$CLUSTER_NAME'..."
kind create cluster --name $CLUSTER_NAME --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
EOF

# 2. Attendre que le cluster soit prêt
echo "✓ Attente du démarrage du cluster..."
sleep 10

# 3. Vérifier que le cluster fonctionne
echo "✓ Vérification du cluster..."
kubectl cluster-info --context kind-$CLUSTER_NAME

# 4. Installer un ingress controller (optionnel)
echo ""
echo "✓ Installation de l'Ingress Controller (NGINX)..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# 5. Attendre que l'ingress soit prêt
echo "✓ Attente de l'Ingress Controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

echo ""
echo "✅ Cluster Kind configuré avec succès!"
echo ""
echo "Cluster: $CLUSTER_NAME"
echo "Contexte: kind-$CLUSTER_NAME"
echo ""
echo "Commandes utiles:"
echo "  kubectl cluster-info --context kind-$CLUSTER_NAME"
echo "  kubectl get nodes"
echo "  kubectl config current-context"
echo ""
echo "Prochain step:"
echo "  ./load-images.sh"
echo "  ./deploy.sh"
