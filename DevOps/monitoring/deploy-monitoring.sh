#!/bin/bash

# Script de déploiement du monitoring Prometheus + Grafana
# Portfolio Binetou - Monitoring Stack

set -e

echo "🚀 Déploiement du monitoring Prometheus + Grafana"
echo "=================================================="

# Étape 1: Vérifier Docker et Docker Compose
echo "📋 Vérification des prérequis..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "✅ Docker et Docker Compose sont disponibles"

# Étape 2: Vérifier le réseau Docker de l'application
echo "📋 Vérification du réseau Docker..."
NETWORK_NAME=$(docker network ls --format "table {{.Name}}" | grep -E "(devops|portfolio)" | head -1)

if [ -z "$NETWORK_NAME" ]; then
    echo "⚠️  Aucun réseau portfolio/devops trouvé. Création du réseau..."
    docker network create devops_default
    NETWORK_NAME="devops_default"
fi

echo "✅ Réseau détecté: $NETWORK_NAME"

# Étape 3: Adapter le docker-compose.yml
echo "📋 Configuration du réseau dans docker-compose..."
sed -i "s/app-network/$NETWORK_NAME/g" docker-compose.monitoring.yml
echo "✅ Configuration réseau mise à jour"

# Étape 4: Vérifier les noms des conteneurs existants
echo "📋 Vérification des conteneurs existants..."
CONTAINERS=$(docker ps --format "table {{.Names}}" | tail -n +2)
echo "Conteneurs détectés:"
echo "$CONTAINERS"

# Étape 5: Démarrer la stack de monitoring
echo "🚀 Démarrage de la stack de monitoring..."
docker-compose -f docker-compose.monitoring.yml up -d

# Étape 6: Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Étape 7: Vérifier l'état des services
echo "📋 Vérification de l'état des services..."
docker-compose -f docker-compose.monitoring.yml ps

# Étape 8: Tests de connectivité
echo "🔍 Tests de connectivité..."

# Test Prometheus
if curl -s http://localhost:9090/-/healthy > /dev/null; then
    echo "✅ Prometheus: http://localhost:9090"
else
    echo "❌ Prometheus n'est pas accessible"
fi

# Test Grafana
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Grafana: http://localhost:3001 (admin/admin123)"
else
    echo "❌ Grafana n'est pas accessible"
fi

# Test AlertManager
if curl -s http://localhost:9093/-/healthy > /dev/null; then
    echo "✅ AlertManager: http://localhost:9093"
else
    echo "❌ AlertManager n'est pas accessible"
fi

# Test Node Exporter
if curl -s http://localhost:9100/metrics > /dev/null; then
    echo "✅ Node Exporter: http://localhost:9100"
else
    echo "❌ Node Exporter n'est pas accessible"
fi

# Test cAdvisor
if curl -s http://localhost:8080/healthz > /dev/null; then
    echo "✅ cAdvisor: http://localhost:8080"
else
    echo "❌ cAdvisor n'est pas accessible"
fi

echo ""
echo "🎉 Déploiement terminé !"
echo "========================"
echo ""
echo "📊 Accès aux services:"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3001 (admin/admin123)"
echo "  • AlertManager: http://localhost:9093"
echo "  • Node Exporter: http://localhost:9100"
echo "  • cAdvisor: http://localhost:8080"
echo ""
echo "📈 Dashboards Grafana disponibles:"
echo "  • Infrastructure Monitoring (8 panneaux)"
echo "  • Containers Monitoring (5 panneaux)"
echo ""
echo "🚨 Configuration des alertes email:"
echo "  • Éditez alertmanager/alertmanager.yml"
echo "  • Remplacez VOTRE_EMAIL@gmail.com par votre email"
echo "  • Remplacez REMPLACER_PAR_APP_PASSWORD par votre App Password Gmail"
echo "  • Redémarrez: docker-compose -f docker-compose.monitoring.yml restart alertmanager"
echo ""
echo "🔍 Commandes utiles:"
echo "  • Logs: docker-compose -f docker-compose.monitoring.yml logs -f"
echo "  • Stop: docker-compose -f docker-compose.monitoring.yml down"
echo "  • Restart: docker-compose -f docker-compose.monitoring.yml restart"