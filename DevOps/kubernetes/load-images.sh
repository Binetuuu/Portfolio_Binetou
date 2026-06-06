#!/bin/bash

CLUSTER_NAME="portfolio"
BACKEND_IMAGE="binetuuu/portfolio-backend:latest"
FRONTEND_IMAGE="binetuuu/portfolio-frontend:latest"

echo "======================================"
echo "📦 Chargement des images Docker"
echo "======================================"

# Construire les images si nécessaire
echo "🔨 Construction de l'image Backend..."
docker build -t $BACKEND_IMAGE ../Backend/

echo ""
echo "🔨 Construction de l'image Frontend..."
docker build -t $FRONTEND_IMAGE ../Frontend/

# Charger dans Kind
echo ""
echo "📤 Chargement dans Kind ($CLUSTER_NAME)..."

echo "   Backend..."
kind load docker-image $BACKEND_IMAGE --name $CLUSTER_NAME

echo "   Frontend..."
kind load docker-image $FRONTEND_IMAGE --name $CLUSTER_NAME

echo ""
echo "✅ Images chargées avec succès!"
echo ""
echo "Images disponibles dans Kind:"
kind get nodes --name $CLUSTER_NAME | while read node; do
    echo "   Node: $node"
    docker exec $node ctr images ls
done
