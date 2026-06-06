#!/bin/bash

CLUSTER_NAME="portfolio"

echo "======================================"
echo "🗑️  Suppression du déploiement"
echo "======================================"

echo "Suppression du namespace 'portfolio'..."
kubectl delete namespace portfolio --ignore-not-found=true

echo ""
echo "✅ Déploiement supprimé!"
