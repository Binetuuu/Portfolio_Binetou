# Portfolio Monitoring Stack
## Prometheus + Grafana + AlertManager

### 🏗️ Architecture

Cette stack de monitoring comprend :

- **Prometheus** (port 9090) - Collecte des métriques
- **Grafana** (port 3001) - Visualisation et dashboards  
- **AlertManager** (port 9093) - Gestion des alertes
- **Node Exporter** (port 9100) - Métriques système Ubuntu
- **cAdvisor** (port 8080) - Métriques conteneurs Docker
- **MongoDB Exporter** (port 9216) - Métriques MongoDB

### 🚀 Déploiement rapide

#### Prérequis
- Docker et Docker Compose installés
- Votre application Portfolio déjà lancée

#### Installation

1. **Aller dans le répertoire monitoring :**
```bash
cd ~/Portfolio_Binetou/DevOps/monitoring
```

2. **Lancer le script de déploiement :**
```bash
chmod +x deploy-monitoring.sh
./deploy-monitoring.sh
```

3. **Ou lancer manuellement :**
```bash
# Adapter le réseau Docker
NETWORK=$(docker network ls --format "table {{.Name}}" | grep -E "(devops|portfolio)" | head -1)
sed -i "s/app-network/$NETWORK/g" docker-compose.monitoring.yml

# Démarrer la stack
docker-compose -f docker-compose.monitoring.yml up -d
```

### 📊 Accès aux services

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3001 | admin / admin123 |
| Prometheus | http://localhost:9090 | - |
| AlertManager | http://localhost:9093 | - |
| Node Exporter | http://localhost:9100 | - |
| cAdvisor | http://localhost:8080 | - |

### 📈 Dashboards disponibles

#### 1. Infrastructure Monitoring (8 panneaux)
- CPU Usage
- Memory Usage  
- Disk Usage
- Network I/O
- Services Status
- System Load
- Context Switches

#### 2. Containers Monitoring (5 panneaux)
- Container CPU Usage
- Container Memory Usage
- Container Network I/O
- Container Status
- Container Disk I/O

### 🚨 Configuration des alertes

#### Règles d'alertes disponibles (6 règles) :

1. **InstanceDown** - Service inaccessible (1min)
2. **HighCpuUsage** - CPU > 80% (2min)
3. **HighMemoryUsage** - RAM > 85% (2min) 
4. **LowDiskSpace** - Disque > 90% (1min)
5. **ContainerDown** - Conteneur arrêté (1min)
6. **HighContainerMemory** - Conteneur RAM > 90% (2min)

#### Configuration email Gmail :

1. **Éditer le fichier alertmanager/alertmanager.yml :**
```yaml
global:
  smtp_from: 'votre-email@gmail.com'
  smtp_auth_username: 'votre-email@gmail.com'
  smtp_auth_password: 'votre-app-password'
```

2. **Remplacer les placeholders :**
- `VOTRE_EMAIL@gmail.com` → votre adresse Gmail
- `REMPLACER_PAR_APP_PASSWORD` → votre App Password Gmail

3. **Redémarrer AlertManager :**
```bash
docker-compose -f docker-compose.monitoring.yml restart alertmanager
```

### 🔧 Commandes utiles

```bash
# Voir les logs
docker-compose -f docker-compose.monitoring.yml logs -f

# Arrêter la stack
docker-compose -f docker-compose.monitoring.yml down

# Redémarrer un service
docker-compose -f docker-compose.monitoring.yml restart grafana

# Voir l'état des services
docker-compose -f docker-compose.monitoring.yml ps

# Nettoyer les volumes (attention: perte de données)
docker-compose -f docker-compose.monitoring.yml down -v
```

### 🔍 Dépannage

#### Prometheus ne voit pas les conteneurs
- Vérifiez que le réseau Docker est correct
- Vérifiez les noms des conteneurs dans prometheus.yml

#### Grafana ne charge pas les dashboards
- Vérifiez les permissions des fichiers JSON
- Redémarrez Grafana : `docker-compose restart grafana`

#### MongoDB Exporter ne fonctionne pas  
- Vérifiez l'URI MongoDB dans docker-compose.monitoring.yml
- Testez la connexion : `docker exec mongodb-exporter wget -qO- localhost:9216/metrics`

#### Alertes pas reçues
- Vérifiez la configuration Gmail App Password
- Testez AlertManager : `curl -XPOST http://localhost:9093/-/reload`

### 📁 Structure des fichiers

```
monitoring/
├── prometheus/
│   ├── prometheus.yml          # Configuration Prometheus
│   └── rules/
│       └── alerts.yml         # 6 règles d'alertes
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── prometheus.yml  # Auto-config Prometheus
│   │   └── dashboards/
│   │       └── dashboards.yml  # Auto-import dashboards
│   └── dashboards/
│       ├── infrastructure.json # Dashboard 8 panneaux
│       └── containers.json    # Dashboard 5 panneaux
├── alertmanager/
│   └── alertmanager.yml       # Configuration alertes email
├── docker-compose.monitoring.yml # Orchestration complète
├── deploy-monitoring.sh       # Script de déploiement
└── README.md                 # Cette documentation
```